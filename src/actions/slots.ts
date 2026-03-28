import { prisma } from "@/lib/prisma";
import { addMinutes, format, parse, isBefore, startOfDay, endOfDay, isWithinInterval } from "date-fns";

export async function getAvailableSlots(username: string, eventSlug: string, dateStr: string) {
  // 1. Fetch User and EventType
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      eventTypes: {
        where: { slug: eventSlug },
      },
      availability: true,
    },
  });

  if (!user || user.eventTypes.length === 0) {
    throw new Error("Event type not found");
  }

  const eventType = user.eventTypes[0];

  // For simplicity, we process the date in UTC based on the input date string e.g. "2024-03-29"
  // In a real app we'd map this to user.timeZone.
  const searchDate = new Date(`${dateStr}T00:00:00Z`);
  const dayOfWeek = searchDate.getUTCDay();

  // 2. Find Availability for this Day
  const dayAvailability = user.availability.find((a) => a.dayOfWeek === dayOfWeek);

  if (!dayAvailability) {
    // Host is not available on this day
    return [];
  }

  // 3. Construct Start and End Date Time Window
  const startWindow = new Date(`${dateStr}T${dayAvailability.startTime}:00Z`);
  const endWindow = new Date(`${dateStr}T${dayAvailability.endTime}:00Z`);

  // 4. Fetch existing bookings for this event type within this day window
  const bookings = await prisma.booking.findMany({
    where: {
      eventTypeId: eventType.id,
      startTime: { gte: startOfDay(searchDate) },
      endTime: { lte: endOfDay(searchDate) },
      status: "CONFIRMED",
    },
  });

  // 5. Generate slots
  let currentSlot = startWindow;
  const availableSlots: Date[] = [];
  const now = new Date();

  while (isBefore(addMinutes(currentSlot, eventType.duration), endWindow) || currentSlot.getTime() + eventType.duration * 60000 === endWindow.getTime()) {
    const slotEnd = addMinutes(currentSlot, eventType.duration);

    // Skip if it's in the past
    if (isBefore(currentSlot, now)) {
      currentSlot = addMinutes(currentSlot, 30); // Step
      continue;
    }

    // Check for overlaps
    const isOverlapping = bookings.some((b) => {
      // Booking overlaps if:
      // slotStart < bookingEnd AND slotEnd > bookingStart
      return currentSlot < b.endTime && slotEnd > b.startTime;
    });

    if (!isOverlapping) {
      availableSlots.push(currentSlot);
    }

    // Advance by 30 mins as a standard step (or by duration if < 30)
    const step = eventType.duration < 30 ? eventType.duration : 30;
    currentSlot = addMinutes(currentSlot, step);
  }

  return availableSlots.map(slot => slot.toISOString());
}
