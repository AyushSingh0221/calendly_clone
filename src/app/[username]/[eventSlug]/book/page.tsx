"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Clock, Calendar, ArrowLeft } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createBooking } from "@/actions/bookings";
import React, { useState, Suspense } from "react";
import Link from "next/link";

function BookForm({ params, dateStr, timeStr }: { params: any, dateStr: string | null, timeStr: string | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!dateStr || !timeStr) {
    return <div className="p-8 text-center text-red-500">Missing time selection. Please go back.</div>;
  }

  const parsedTime = parseISO(timeStr);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    formData.append("username", params.username);
    formData.append("eventSlug", params.eventSlug);
    formData.append("dateStr", dateStr);
    formData.append("timeStr", timeStr);

    const result = await createBooking(undefined, formData);
    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      router.push(`/${params.username}/${params.eventSlug}/success?timeStr=${encodeURIComponent(timeStr)}`);
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-lg border max-w-4xl mx-auto overflow-hidden">
      
      {/* Left Sidebar - Event Details */}
      <div className="w-full md:w-1/3 bg-gray-50/50 p-8 border-r">
        <Link href={`/${params.username}/${params.eventSlug}`} className="text-blue-600 flex flex-row items-center font-medium text-sm mb-6 hover:underline">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Link>
        <div className="mb-2 font-semibold text-gray-500 uppercase tracking-wide text-sm">{params.username}</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6 leading-tight">Meeting Details</h1>
        
        <div className="flex items-center text-gray-500 font-medium mb-3">
          <Calendar className="w-5 h-5 mr-3" />
          {format(parsedTime, "EEEE, MMMM d, yyyy")}
        </div>
        
        <div className="flex items-center text-gray-500 font-medium">
          <Clock className="w-5 h-5 mr-3" />
          {format(parsedTime, "h:mm a")}
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Enter Details</h2>
        
        {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-md font-medium text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input id="name" name="name" required placeholder="John Doe" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input id="email" name="email" type="email" required placeholder="john@example.com" />
          </div>

          <div className="pt-4">
            <Button type="submit" disabled={loading} className="w-full md:w-auto px-8 rounded-full">
              {loading ? "Scheduling..." : "Schedule Event"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function BookFormWrapper({ params }: { params: Promise<{ username: string; eventSlug: string }> }) {
  const searchParams = useSearchParams();
  const dateStr = searchParams.get("dateStr");
  const timeStr = searchParams.get("timeStr");
  const unwrappedParams = React.use(params);

  return <BookForm params={unwrappedParams} dateStr={dateStr} timeStr={timeStr} />;
}

export default function BookSelectionPage({ params }: { params: Promise<{ username: string; eventSlug: string }> }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6">
      <Suspense fallback={<div>Loading form...</div>}>
        <BookFormWrapper params={params} />
      </Suspense>
    </div>
  );
}
