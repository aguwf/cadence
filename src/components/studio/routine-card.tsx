
import Image from "next/image";
import { Clock, Flame, BarChart } from "lucide-react";
import type { DanceRoutine, Category, Difficulty } from "@prisma/client";

interface RoutineCardProps {
  routine: DanceRoutine & { category: Category };
}

export function RoutineCard({ routine }: RoutineCardProps) {
  // Format duration from seconds to MM:SS
  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Helper for difficulty color
  const getDifficultyColor = (diff: Difficulty) => {
    switch (diff) {
      case "BEGINNER":
        return "text-green-500 bg-green-100";
      case "INTERMEDIATE":
        return "text-yellow-500 bg-yellow-100";
      case "ADVANCED":
        return "text-orange-500 bg-orange-100";
      case "EXPERT":
        return "text-red-500 bg-red-100";
      default:
        return "text-gray-500 bg-gray-100";
    }
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl bg-card border border-border/50 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Image Section */}
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={routine.thumbnailUrl}
          alt={routine.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        {/* Category Badge */}
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary shadow-xs backdrop-blur-sm">
          {routine.category.name}
        </span>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 text-lg font-bold leading-tight text-card-foreground">
          {routine.title}
        </h3>

        <div className="mt-auto flex items-center justify-between pt-4 text-sm text-muted-foreground">
            {/* Difficulty */}
            <div className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold ${getDifficultyColor(routine.difficulty)}`}>
               <BarChart className="h-3 w-3" />
               <span className="capitalize">{routine.difficulty.toLowerCase()}</span>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{formatDuration(routine.duration)}</span>
            </div>
            
             {/* Calories (Calculated Estimate: duration_min * caloriesPerMin) */}
             <div className="flex items-center gap-1 text-orange-500">
                <Flame className="h-4 w-4 fill-orange-500" />
                <span>{Math.floor((routine.duration / 60) * routine.caloriesPerMin)}</span>
             </div>
        </div>
      </div>
    </div>
  );
}
