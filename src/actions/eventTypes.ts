"use server";

import { prisma } from "@/lib/prisma";
import { getDefaultUser } from "@/lib/user";
import { revalidatePath } from "next/cache";

export async function createEventType(prevState: any, formData: FormData) {
  const user = await getDefaultUser();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const duration = parseInt(formData.get("duration") as string, 10);
  const slug = formData.get("slug") as string;

  if (!name || isNaN(duration) || !slug) {
    return { error: "Missing required fields" };
  }

  try {
    const newEventType = await prisma.eventType.create({
      data: {
        userId: user.id,
        name,
        description,
        duration,
        slug,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, id: newEventType.id };
  } catch (err: any) {
    if (err.code === "P2002") {
      return { error: "An event type with this slug already exists" };
    }
    return { error: "Failed to create event type" };
  }
}

export async function getEventTypes() {
  const user = await getDefaultUser();
  return prisma.eventType.findMany({
    where: { userId: user.id },
    orderBy: { name: "asc" },
  });
}

export async function deleteEventType(id: string) {
  const user = await getDefaultUser();
  await prisma.eventType.delete({
    where: { id, userId: user.id },
  });
  revalidatePath("/dashboard");
}
