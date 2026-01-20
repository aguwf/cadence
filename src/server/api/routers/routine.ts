
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const routineRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.danceRoutine.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
});
