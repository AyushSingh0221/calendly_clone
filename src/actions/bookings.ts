"use server";

import { prisma } from "@/lib/prisma";
import { getDefaultUser } from "@/lib/user";
import { getAvailableSlots } from "./slots";
import { revalidatePath } from "next/cache";

export async function createBooking(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const username = formData.get("username") as string;
  const eventSlug = formData.get("eventSlug") as string;
  const dateStr = formData.get("dateStr") as string;
  const timeStr = formData.get("timeStr") as string; // Standard ISO string

  if (!name || !email || !username || !eventSlug || !dateStr || !timeStr) {
    return { error: "Missing required booking details" };
  }

  // Double check availability
  const slots = await getAvailableSlots(username, eventSlug, dateStr);
  if (!slots.includes(timeStr)) {
    return { error: "This time slot is no longer available" };
  }

  // Find EventType ID
  const user = await prisma.user.findUnique({
    where: { username },
    include: { eventTypes: { where: { slug: eventSlug } } },
  });

  if (!user || user.eventTypes.length === 0) {
    return { error: "Invalid provider or event type" };
  }

  const eventType = user.eventTypes[0];

  const startTime = new Date(timeStr);
  const endTime = new Date(startTime.getTime() + eventType.duration * 60000);

  // Note: We use Prisma transaction to lock / check again if needed, or simply insert.
  // Catching unique or overlapping by hand or DB constraints.
  
  await prisma.booking.create({
    data: {
      eventTypeId: eventType.id,
      name,
      email,
      startTime,
      endTime,
      status: "CONFIRMED",
    },
  });

  // Revalidate meetings page cache if host is viewing it
  revalidatePath("/dashboard/meetings");

  return { success: true };
}

export async function getMeetings() {
  const user = await getDefaultUser();
  const now = new Date();

  const allBookings = await prisma.booking.findMany({
    where: {
      eventType: { userId: user.id },
    },
    include: { eventType: true },
    orderBy: { startTime: "asc" },
  });

  const upcoming = allBookings.filter((b) => b.startTime > now && b.status === "CONFIRMED");
  const past = allBookings.filter((b) => b.startTime <= now || b.status !== "CONFIRMED");

  return { upcoming, past };
}

export async function cancelBooking(bookingId: string) {
  const user = await getDefaultUser();
  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "CANCELLED" },
  });
  revalidatePath("/dashboard/meetings");
}
