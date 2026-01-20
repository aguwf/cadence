"use client";

import { api } from "@/trpc/react";
import { RoutineCard } from "@/components/studio/routine-card";
import { Loader2 } from "lucide-react";

export default function ExplorePage() {
  const { data: routines, isLoading, isError } = api.routine.getAll.useQuery();

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center text-destructive">
        <p>Failed to load routines. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
          Explore Studio
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Discover new rhythms and elevate your energy.
        </p>
      </div>

      {(!routines || routines.length === 0) ? (
         <div className="text-center text-muted-foreground py-12">
            No routines found. Check back soon!
         </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {routines.map((routine) => (
            <RoutineCard key={routine.id} routine={routine} />
            ))}
        </div>
      )}
    </div>
  );
}
