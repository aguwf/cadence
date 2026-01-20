
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const practiceRouter = createTRPCRouter({
  logActivity: protectedProcedure
    .input(
      z.object({
        routineId: z.string(),
        durationPlayed: z.number(), // in seconds
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // 1. Fetch Routine for stats (caloriesPerMin)
      const routine = await ctx.db.danceRoutine.findUnique({
        where: { id: input.routineId },
      });

      if (!routine) {
        throw new Error("Routine not found");
      }

      const caloriesBurned = Math.round(
        (input.durationPlayed / 60) * routine.caloriesPerMin,
      );
      const earnedXp = Math.round(input.durationPlayed / 6); // simple formula: 1 min ~= 10 xp

      // 2. Create PracticeLog
      const log = await ctx.db.practiceLog.create({
        data: {
          userId,
          routineId: input.routineId,
          durationPlayed: input.durationPlayed,
          caloriesBurned,
        },
      });

      // 3. Upsert UserProfile to update stats
      await ctx.db.userProfile.upsert({
        where: { userId },
        create: {
          userId,
          totalCalories: caloriesBurned,
          totalMinutes: Math.round(input.durationPlayed / 60),
          currentXp: earnedXp,
        },
        update: {
          totalCalories: { increment: caloriesBurned },
          totalMinutes: { increment: Math.round(input.durationPlayed / 60) },
          currentXp: { increment: earnedXp },
        },
      });

      return {
        success: true,
        caloriesBurned,
        earnedXp,
        logId: log.id,
      };
    }),

  getHistory: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.practiceLog.findMany({
      where: { userId: ctx.session.user.id },
      take: 10,
      orderBy: { completedAt: "desc" },
      include: {
        routine: true, // Include details like title, image
      },
    });
  }),
});
