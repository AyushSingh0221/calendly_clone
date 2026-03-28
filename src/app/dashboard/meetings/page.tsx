import { cancelBooking, getMeetings } from "@/actions/bookings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { Calendar, Clock, MapPin, User, X } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function MeetingsPage() {
  const { upcoming, past } = await getMeetings();

  const renderBooking = (booking: any, isUpcoming: boolean) => (
    <Card key={booking.id} className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{booking.eventType.name}</CardTitle>
            <CardDescription className="flex items-center gap-4 mt-2 font-medium text-gray-700">
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                {format(booking.startTime, "EEEE, MMMM d, yyyy")}
              </span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1 text-gray-400" />
                {format(booking.startTime, "h:mm a")} - {format(booking.endTime, "h:mm a")}
              </span>
            </CardDescription>
          </div>
          {isUpcoming && booking.status === "CONFIRMED" && (
            <form action={cancelBooking.bind(null, booking.id)}>
              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                <X className="w-4 h-4 mr-1" /> Cancel
              </Button>
            </form>
          )}
          {booking.status === "CANCELLED" && (
            <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full items-center">
              Cancelled
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2 text-sm text-gray-600">
          <div className="flex flex-row items-center">
            <User className="w-4 h-4 mr-2 text-gray-400" />
            <span className="font-medium mr-1">{booking.name}</span> ({booking.email})
          </div>
          <div className="flex flex-row items-center">
            <MapPin className="w-4 h-4 mr-2 text-gray-400" /> Web Conferencing details to follow
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-8 max-w-5xl mx-auto w-full">
      <div className="mb-8 pb-4 border-b">
        <h1 className="text-2xl font-semibold mb-1">Scheduled Events</h1>
        <p className="text-gray-500 text-sm">View and manage your upcoming and past bookings.</p>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          {upcoming.length === 0 ? (
            <div className="border-2 border-dashed rounded-lg p-12 text-center text-gray-500">
              No upcoming meetings. Share your link to get booked!
            </div>
          ) : (
            upcoming.map((b) => renderBooking(b, true))
          )}
        </TabsContent>
        <TabsContent value="past">
          {past.length === 0 ? (
            <div className="border-2 border-dashed rounded-lg p-12 text-center text-gray-500">
              No past meetings yet.
            </div>
          ) : (
            past.map((b) => renderBooking(b, false))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
