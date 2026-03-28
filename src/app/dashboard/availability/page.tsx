import { AvailabilityForm } from "@/components/AvailabilityForm";
import { getAvailability } from "@/actions/availability";

export default async function AvailabilityPage() {
  const initialData = await getAvailability();

  return (
    <div className="p-8 max-w-5xl mx-auto w-full">
      <div className="mb-8 pb-4 border-b">
        <h1 className="text-2xl font-semibold mb-1">Availability</h1>
        <p className="text-gray-500 text-sm">Configure your default scheduling hours.</p>
      </div>
      {/* Client Component */}
      <AvailabilityForm initialData={initialData} />
    </div>
  );
}
