"use client";

import { DayAvailability, updateAvailability } from "@/actions/availability";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

type AvailabilityFormProps = {
  initialData: DayAvailability[];
};

export function AvailabilityForm({ initialData }: AvailabilityFormProps) {
  const [availability, setAvailability] = useState<DayAvailability[]>(initialData);
  const [loading, setLoading] = useState(false);

  const toggleDay = (index: number) => {
    const updated = [...availability];
    updated[index].enabled = !updated[index].enabled;
    setAvailability(updated);
  };

  const updateTime = (index: number, field: "startTime" | "endTime", value: string) => {
    const updated = [...availability];
    updated[index][field] = value;
    setAvailability(updated);
  };

  const handleSave = async () => {
    setLoading(true);
    await updateAvailability(availability);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl border rounded-xl overflow-hidden shadow-sm">
      <div className="bg-gray-50/50 p-6 border-b flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Weekly Hours</h2>
          <p className="text-sm text-gray-500">Set your default availability below.</p>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {availability.map((day, index) => (
          <div key={index} className="flex items-center gap-6 py-2 border-b last:border-0 hover:bg-gray-50 p-4 rounded-md transition-colors">
            <div className="flex items-center gap-3 w-40">
              <Checkbox
                checked={day.enabled}
                onCheckedChange={() => toggleDay(index)}
              />
              <span className={`font-medium ${!day.enabled && "text-gray-400 line-through"}`}>
                {DAYS[index]}
              </span>
            </div>

            {day.enabled ? (
              <div className="flex items-center gap-4 flex-1">
                <Input
                  type="time"
                  value={day.startTime}
                  onChange={(e) => updateTime(index, "startTime", e.target.value)}
                  className="w-32"
                />
                <span className="text-gray-400">-</span>
                <Input
                  type="time"
                  value={day.endTime}
                  onChange={(e) => updateTime(index, "endTime", e.target.value)}
                  className="w-32"
                />
              </div>
            ) : (
              <div className="text-gray-400 italic text-sm flex-1">Unavailable</div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-gray-50/50 p-6 border-t flex justify-end">
        <Button onClick={handleSave} disabled={loading} className="w-full md:w-auto">
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
