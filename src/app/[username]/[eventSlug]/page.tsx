import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { BookingCalendar } from "@/components/BookingCalendar";

export default async function PublicEventPage({ params }: { params: Promise<{ username: string; eventSlug: string }> }) {
  const { username, eventSlug } = await params;
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      eventTypes: {
        where: { slug: eventSlug },
      },
    },
  });

  if (!user || user.eventTypes.length === 0) {
    notFound();
  }

  const eventType = user.eventTypes[0];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6">
      <BookingCalendar
        username={user.username}
        eventSlug={eventType.slug}
        eventName={eventType.name}
        duration={eventType.duration}
        description={eventType.description}
      />
    </div>
  );
}
