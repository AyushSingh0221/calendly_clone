import { EventForm } from "@/components/EventForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewEventTypePage() {
  return (
    <div className="p-8 max-w-5xl mx-auto w-full">
      <div className="mb-8 pb-4 border-b">
        <Link href="/dashboard" className="text-blue-600 flex flex-row items-center font-medium text-sm mb-4 hover:underline">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Link>
        <h1 className="text-2xl font-semibold mb-1">Add Event Type</h1>
        <p className="text-gray-500 text-sm">Create a new type of meeting to share with people.</p>
      </div>
      <EventForm />
    </div>
  );
}
