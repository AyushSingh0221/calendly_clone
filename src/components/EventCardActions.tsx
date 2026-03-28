"use client";

import { Button } from "@/components/ui/button";
import { Copy, Trash2 } from "lucide-react";
import { deleteEventType } from "@/actions/eventTypes";
import { useState } from "react";

export function EventCardActions({ eventTypeId, link }: { eventTypeId: string, link: string }) {
  const [copied, setCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCopy = () => {
    // Requires a full URL for clipboard, create one based on current location
    const fullUrl = `${window.location.origin}${link}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this event type?")) {
      setIsDeleting(true);
      await deleteEventType(eventTypeId);
      // Wait for revalidation
    }
  };

  return (
    <>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleCopy}
        className="text-gray-600 hover:text-blue-600 hover:bg-blue-50"
      >
        <Copy className="w-4 h-4 mr-2" />
        {copied ? "Copied!" : "Copy link"}
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleDelete}
        disabled={isDeleting}
        className="text-gray-600 hover:text-red-600 hover:bg-red-50"
      >
        <Trash2 className="w-4 h-4 mr-2" />
        {isDeleting ? "Deleting..." : "Delete"}
      </Button>
    </>
  );
}
