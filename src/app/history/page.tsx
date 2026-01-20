"use client";

import { api } from "@/trpc/react";
import { Loader2, Calendar, Clock, Flame, ChevronRight, Trophy } from "lucide-react";
import Link from "next/link";

export default function HistoryPage() {
  const { data: history, isLoading } = api.practice.getHistory.useQuery();

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // Calculate some aggregate stats
  const totalCalories = history?.reduce((acc, log) => acc + (log.caloriesBurned || 0), 0) || 0;
  const totalWorkouts = history?.length || 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-primary">Your Journey</h1>
            <p className="text-muted-foreground mt-1">Keep the momentum going!</p>
          </div>
          
          <div className="flex gap-4">
             <div className="rounded-2xl bg-card p-4 shadow-sm border border-border flex items-center gap-3">
                 <div className="p-2 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/30">
                    <Flame className="h-5 w-5" />
                 </div>
                 <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase">Total Burn</p>
                    <p className="text-lg font-bold">{totalCalories} <span className="text-xs font-normal">kcal</span></p>
                 </div>
             </div>
             <div className="rounded-2xl bg-card p-4 shadow-sm border border-border flex items-center gap-3">
                 <div className="p-2 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30">
                    <Trophy className="h-5 w-5" />
                 </div>
                 <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase">Workouts</p>
                    <p className="text-lg font-bold">{totalWorkouts}</p>
                 </div>
             </div>
          </div>
      </div>
      
      {!history || history.length === 0 ? (
        <div className="rounded-3xl border border-border bg-card p-16 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No activity yet</h3>
            <p className="text-muted-foreground mb-6">Your history will appear here once you complete a routine.</p>
            <Link href="/explore" className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition-transform hover:scale-105">
                Start Exploring
            </Link>
        </div>
      ) : (
        <div className="grid gap-4">
            {history.map((log) => (
                <div key={log.id} className="group relative flex flex-col sm:flex-row sm:items-center justify-between overflow-hidden rounded-2xl border border-border bg-card p-4 transition-all hover:bg-accent/30 hover:shadow-md hover:border-primary/30">
                   <div className="flex items-center gap-5">
                      {/* Thumbnail or Icon */}
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-muted shadow-inner relative">
                          {log.routine?.thumbnailUrl ? (
                              <img src={log.routine.thumbnailUrl} alt={log.routine.title} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                <Clock className="h-8 w-8 opacity-20" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/10"></div>
                      </div>
                      
                      <div>
                          <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{log.routine?.title || "Unknown Routine"}</h3>
                          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                             <div className="flex items-center gap-1.5">
                                <Calendar className="h-4 w-4 text-primary" />
                                {new Date(log.completedAt).toLocaleDateString(undefined, {
                                    month: 'short', day: 'numeric', year: 'numeric'
                                })}
                             </div>
                             <div className="w-1 h-1 rounded-full bg-border"></div>
                              <div className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4 text-primary" />
                                {Math.floor(log.durationPlayed / 60)}m {log.durationPlayed % 60}s
                             </div>
                          </div>
                      </div>
                   </div>

                   <div className="mt-4 sm:mt-0 flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 border-border pt-4 sm:pt-0 pl-16 sm:pl-0">
                        <div className="text-right">
                             <div className="flex items-center justify-end gap-1 font-bold text-xl text-orange-500">
                                <Flame className="h-5 w-5 fill-orange-500" />
                                {log.caloriesBurned}
                             </div>
                             <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Calories</p>
                        </div>
                   </div>
                </div>
            ))}
        </div>
      )}
    </div>
  );
}
