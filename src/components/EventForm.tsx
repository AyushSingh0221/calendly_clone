"use client";

import { createEventType } from "@/actions/eventTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function EventForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await createEventType(undefined, formData);

    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      {error && <div className="text-red-500 font-medium bg-red-50 p-3 rounded">{error}</div>}
      
      <div className="space-y-2">
        <Label htmlFor="name">Event Name</Label>
        <Input id="name" name="name" placeholder="e.g. 15 Min Discovery Call" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Event Link / Slug</Label>
        <div className="flex items-center gap-2">
          <span className="text-gray-500 bg-gray-50 border px-3 py-2 rounded-md">calendly.com/username/</span>
          <Input id="slug" name="slug" placeholder="15min" required className="flex-1" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="duration">Duration (minutes)</Label>
        <Input id="duration" name="duration" type="number" min="5" max="480" placeholder="15" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Input id="description" name="description" placeholder="Brief details about the meeting" />
      </div>

      <div className="pt-4 flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard")}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Create Event Type"}
        </Button>
      </div>
    </form>
  );
}
