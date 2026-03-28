import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Clock, ChevronRight } from "lucide-react";

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      eventTypes: true,
    },
  });

  if (!user) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-blue-600 text-white font-bold text-3xl flex items-center justify-center rounded-full mx-auto mb-4">
            {user.name.charAt(0)}
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
          <p className="text-gray-500 mt-2">Welcome to my scheduling page. Please follow the instructions to add an event to my calendar.</p>
        </div>

        <div className="grid gap-4 w-full">
          {user.eventTypes.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              No public events available at this time.
            </div>
          ) : (
            user.eventTypes.map((et: any) => (
              <Link key={et.id} href={`/${user.username}/${et.slug}`}>
                <Card className="hover:border-blue-500 hover:shadow-md transition-all cursor-pointer">
                  <div className="flex justify-between items-center p-6">
                    <div>
                      <CardTitle className="text-xl mb-2 text-blue-600">{et.name}</CardTitle>
                      <CardDescription className="flex items-center text-gray-500">
                        <Clock className="w-4 h-4 mr-2" />
                        {et.duration} mins
                      </CardDescription>
                    </div>
                    <div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
