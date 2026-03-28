import { getEventTypes } from "@/actions/eventTypes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getDefaultUser } from "@/lib/user";
import { Clock, Link as LinkIcon, Plus } from "lucide-react";
import Link from "next/link";
import { EventCardActions } from "@/components/EventCardActions";

export default async function DashboardPage() {
  const eventTypes = await getEventTypes();
  const user = await getDefaultUser();

  return (
    <div className="p-8 max-w-5xl mx-auto w-full">
      <div className="flex justify-between items-center mb-8 pb-4 border-b">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Event Types</h1>
          <p className="text-gray-500 text-sm">Create and manage your event types</p>
        </div>
        <Link href="/dashboard/event-types/new">
          <Button className="rounded-full">
            <Plus className="w-4 h-4 mr-2" />
            New Event Type
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {eventTypes.length === 0 && (
          <div className="col-span-full border-2 border-dashed rounded-lg p-12 text-center text-gray-500">
            No event types yet. Create your first event type to get started!
          </div>
        )}
        
        {eventTypes.map((et: any) => (
          <Card key={et.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl mb-1">{et.name}</CardTitle>
                  <CardDescription className="flex items-center mt-2 text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {et.duration} mins
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-blue-600 truncate flex items-center">
                <LinkIcon className="w-4 h-4 mr-2 text-gray-400" />
                /{user.username}/{et.slug}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 bg-gray-50/50 flex justify-between">
              <EventCardActions eventTypeId={et.id} link={`/${user.username}/${et.slug}`} />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
