
import { z } from "zod";
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

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.danceRoutine.findUnique({
        where: { id: input.id },
        include: {
          category: true,
        },
      });
    }),
});
