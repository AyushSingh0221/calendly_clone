"use server";

import { prisma } from "@/lib/prisma";
import { getDefaultUser } from "@/lib/user";
import { revalidatePath } from "next/cache";

export type DayAvailability = {
  dayOfWeek: number;
  enabled: boolean;
  startTime: string;
  endTime: string;
}

export async function getAvailability() {
  const user = await getDefaultUser();
  const availability = await prisma.availability.findMany({
    where: { userId: user.id },
  });

  // Default empty week
  const week = Array.from({ length: 7 }).map((_, i) => ({
    dayOfWeek: i,
    enabled: false,
    startTime: "09:00",
    endTime: "17:00",
  }));

  availability.forEach((a) => {
    week[a.dayOfWeek] = {
      dayOfWeek: a.dayOfWeek,
      enabled: true,
      startTime: a.startTime,
      endTime: a.endTime,
    };
  });

  return week;
}

export async function updateAvailability(data: { dayOfWeek: number; enabled: boolean; startTime: string; endTime: string }[]) {
  const user = await getDefaultUser();

  // Use a transaction to delete all existing and insert new
  await prisma.$transaction([
    prisma.availability.deleteMany({
      where: { userId: user.id },
    }),
    prisma.availability.createMany({
      data: data
        .filter((day) => day.enabled)
        .map((day) => ({
          userId: user.id,
          dayOfWeek: day.dayOfWeek,
          startTime: day.startTime,
          endTime: day.endTime,
        })),
    }),
  ]);

  revalidatePath("/dashboard/availability");
  return { success: true };
}
