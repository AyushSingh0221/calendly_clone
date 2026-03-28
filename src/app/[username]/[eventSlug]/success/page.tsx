"use client";

import { useSearchParams } from "next/navigation";
import { CheckCircle, Calendar, Clock, Globe } from "lucide-react";
import { format, parseISO } from "date-fns";
import React, { Suspense } from "react";
import Link from "next/link";

function SuccessMessage({ params }: { params: Promise<{ username: string; eventSlug: string }> }) {
  const unwrappedParams = React.use(params);
  const searchParams = useSearchParams();
  const timeStr = searchParams.get("timeStr");

  if (!timeStr) {
    return <div className="text-center text-red-500">Could not verify booking details.</div>;
  }

  const parsedTime = parseISO(timeStr);

  return (
    <div className="bg-white rounded-xl shadow-lg border max-w-2xl mx-auto p-12 text-center">
      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-2">You are scheduled</h1>
      <p className="text-gray-500 mb-8">A calendar invitation has been sent to your email address.</p>
      
      <div className="border border-gray-100 bg-gray-50 rounded-lg p-6 max-w-sm mx-auto flex flex-col items-start gap-4 text-left">
        <div className="flex items-center text-gray-700 font-medium w-full">
          <Calendar className="w-5 h-5 mr-3 text-blue-600" />
          {format(parsedTime, "EEEE, MMMM d, yyyy")}
        </div>
        
        <div className="flex items-center text-gray-700 font-medium w-full">
          <Clock className="w-5 h-5 mr-3 text-blue-600" />
          {format(parsedTime, "h:mm a")}
        </div>
      </div>

      <div className="mt-8">
        <Link href={`/${unwrappedParams.username}`} className="text-blue-600 font-medium hover:underline">
          Return to {unwrappedParams.username}'s scheduling page
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage({ params }: { params: Promise<{ username: string; eventSlug: string }> }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6">
      <Suspense fallback={<div>Loading...</div>}>
        <SuccessMessage params={params} />
      </Suspense>
    </div>
  );
}
