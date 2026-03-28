import { prisma } from "./prisma";

// Since there's no auth, we create/fetch a default user
export const getDefaultUser = async () => {
  const user = await prisma.user.upsert({
    where: { email: "hello@calendly.clone" },
    update: {},
    create: {
      email: "hello@calendly.clone",
      name: "Demo User",
      username: "demo",
    },
  });

  return user;
};
