const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  try {
    const user = await prisma.user.findFirst();
    await prisma.availability.createMany({
      data: [{ userId: user.id, dayOfWeek: 0, startTime: "09:00", endTime: "17:00" }]
    });
    console.log("SUCCESS");
  } catch (e) {
    console.error("ERROR:", e);
  }
}
run();
