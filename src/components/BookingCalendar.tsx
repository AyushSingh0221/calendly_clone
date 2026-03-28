"use client";

import { Calendar } from "@/components/ui/calendar";
import { format, parseISO } from "date-fns";
import { ChevronRight, Clock, Clock3, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { getAvailableSlots } from "@/actions/slots";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function BookingCalendar({ username, eventSlug, eventName, duration, description }: any) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!date) return;
    
    setLoading(true);
    setSlots([]);
    setSelectedSlot(null);
    
    // YYYY-MM-DD
    const dateStr = format(date, "yyyy-MM-dd");
    
    getAvailableSlots(username, eventSlug, dateStr)
      .then((res) => setSlots(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [date, username, eventSlug]);

  const handleNext = () => {
    if (!date || !selectedSlot) return;
    const dateStr = format(date, "yyyy-MM-dd");
    router.push(`/${username}/${eventSlug}/book?dateStr=${dateStr}&timeStr=${encodeURIComponent(selectedSlot)}`);
  };

  return (
    <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-lg border max-w-5xl mx-auto overflow-hidden min-h-[500px]">
      
      {/* Left Sidebar - Event Details */}
      <div className="w-full md:w-1/3 bg-gray-50/50 p-8 border-r">
        <div className="mb-6 mt-4 font-semibold text-gray-500 uppercase tracking-wide text-sm">{username}</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">{eventName}</h1>
        
        <div className="flex items-center text-gray-500 font-medium mb-3">
          <Clock3 className="w-5 h-5 mr-3" />
          {duration} min
        </div>
        
        {description && (
          <div className="text-gray-600 mt-6 leading-relaxed text-sm">
            {description}
          </div>
        )}
      </div>

      {/* Right Side - Calendar */}
      <div className="flex-1 p-8 flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <h2 className="text-xl text-gray-900 font-bold mb-6">Select a Date & Time</h2>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border mx-auto bg-white p-3"
            disabled={(date) => date.getTime() < new Date().setHours(0,0,0,0)}
          />
        </div>

        {/* Time Slots Area */}
        {date && (
          <div className="w-full md:w-56 mt-8 md:mt-0 flex flex-col gap-3">
            <h3 className="text-gray-700 mb-3 bg-white font-medium sticky top-0 py-2">
              {format(date, "EEEE, MMMM d")}
            </h3>
            <div className="overflow-y-auto max-h-[300px] flex flex-col gap-2 pr-2">
              {loading && <div className="text-gray-500">Loading slots...</div>}
              {!loading && slots.length === 0 && (
                <div className="text-gray-500 text-sm">No available times.</div>
              )}
              {!loading && slots.map((slot) => {
                const parsed = parseISO(slot);
                const isSelected = selectedSlot === slot;
                return (
                  <div key={slot} className="flex gap-2 transition-all">
                    <Button
                      variant="outline"
                      className={`w-full py-6 font-bold text-blue-600 border-blue-200 hover:border-blue-600 hover:text-blue-700 transition-all ${isSelected ? "w-1/2 border-blue-600 bg-blue-50" : ""}`}
                      onClick={() => setSelectedSlot(slot)}
                    >
                      {format(parsed, "h:mm a")}
                    </Button>
                    
                    {isSelected && (
                      <Button onClick={handleNext} className="w-1/2 py-6 animate-in slide-in-from-left-4 fade-in">
                        Next
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
