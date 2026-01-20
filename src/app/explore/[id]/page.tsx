"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { api } from "@/trpc/react";
import ReactPlayer from "react-player";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Clock, CheckCircle, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function RoutineDetailPage() {
  const params = useParams();
  const routineId = params.id as string;

  const { data: routine, isLoading, isError } = api.routine.getById.useQuery({ id: routineId });
  const logMutation = api.practice.logActivity.useMutation();

  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasLogged, setHasLogged] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Refs to handle timer
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Stop timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Timer Logic
  useEffect(() => {
    if (isPlaying && !isCompleted) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isCompleted]);

  // Log Activity Handler
  const handleComplete = async () => {
    setIsPlaying(false);
    setIsCompleted(true);
    
    // Only log if we have played meaningful duration (e.g., > 5 seconds)
    if (elapsedSeconds > 5 && !hasLogged) {
        setHasLogged(true);
        try {
            await logMutation.mutateAsync({
                routineId,
                durationPlayed: elapsedSeconds,
            });
        } catch (error) {
            console.error("Failed to log activity:", error);
        }
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !routine) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-background p-4 text-center">
        <h2 className="mb-4 text-2xl font-bold text-foreground">Routine not found</h2>
        <Link href="/explore" className="text-primary hover:underline">
          Back to Explore
        </Link>
      </div>
    );
  }

  const caloriesBurned = Math.round((elapsedSeconds / 60) * routine.caloriesPerMin);
  // Calculate completion percentage for XP bar
  const progressPercent = Math.min((elapsedSeconds / routine.duration) * 100, 100);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Bar for Back Navigation */}
      <div className="container mx-auto px-4 py-4">
        <Link href="/explore" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Explore
        </Link>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-6">
        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          
          {/* Left Column: Player (Span 2) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-black shadow-2xl ring-1 ring-white/10">
                {!isReady && (
                   <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-white/50" />
                   </div>
                )}
              <ReactPlayer
                src={routine.videoUrl}
                width="100%"
                height="100%"
                playing={isPlaying}
                controls={true}
                onReady={() => setIsReady(true)}
                onPlay={() => {
                    setIsPlaying(true);
                    setIsCompleted(false); 
                }}
                onPause={() => setIsPlaying(false)}
                onEnded={handleComplete}
                config={{
                    youtube: {
                    }
                }}
              />
            </div>

            {/* Title & Description */}
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-primary">{routine.title}</h1>
              <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
                <span className="rounded-full bg-secondary px-3 py-1 font-medium text-secondary-foreground">
                  {routine.category.name}
                </span>
                <span>•</span>
                <span>{Math.floor(routine.duration / 60)} min {routine.duration % 60 > 0 && `${routine.duration % 60}s`}</span>
                <span>•</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wider 
                    ${routine.difficulty === 'BEGINNER' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      routine.difficulty === 'INTERMEDIATE' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}
                `}>
                    {routine.difficulty}
                </span>
              </div>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                {routine.description}
              </p>
            </div>
          </div>

          {/* Right Column: Live Stats Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 rounded-3xl bg-card p-6 shadow-lg ring-1 ring-border">
              <h3 className="mb-6 flex items-center gap-3 text-xl font-bold">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <span className="relative flex h-3 w-3">
                      {isPlaying && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>}
                      <span className={`relative inline-flex rounded-full h-3 w-3 ${isPlaying ? 'bg-primary' : 'bg-muted-foreground'}`}></span>
                    </span>
                </div>
                Live Session
              </h3>

              <div className="space-y-6">
                {/* Time Widget */}
                <div className="flex items-center justify-between rounded-2xl bg-muted/50 p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-4">
                    <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Time Active</p>
                      <p className="text-3xl font-bold tabular-nums tracking-tight">
                        {Math.floor(elapsedSeconds / 60).toString().padStart(2, '0')}:
                        {(elapsedSeconds % 60).toString().padStart(2, '0')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Calories Widget */}
                <div className="flex items-center justify-between rounded-2xl bg-muted/50 p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-4">
                    <div className="rounded-xl bg-orange-100 p-3 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                      <Flame className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Est. Burn</p>
                      <p className="text-3xl font-bold tabular-nums tracking-tight">
                        {caloriesBurned} <span className="text-sm font-normal text-muted-foreground">kcal</span>
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* XP Widget */}
                <div className="mt-8 pt-6 border-t border-border">
                    <div className="flex justify-between items-end mb-2">
                         <span className="text-sm font-medium text-muted-foreground">Experience Gained</span>
                         <span className="text-lg font-bold text-primary">+{Math.floor(elapsedSeconds / 6)} XP</span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-muted/50 overflow-hidden ring-1 ring-border/50">
                        <div 
                            className="h-full bg-gradient-to-r from-primary to-purple-500 transition-all duration-1000 ease-linear"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Workout Complete Overlay */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl bg-card p-8 text-center shadow-2xl ring-1 ring-border"
            >
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400 shadow-sm">
                <CheckCircle className="h-10 w-10" />
              </div>
              
              <h2 className="mb-2 text-3xl font-bold tracking-tight text-foreground">Workout Complete!</h2>
              <p className="mb-8 text-muted-foreground">Great job! You crushed it.</p>

              <div className="mb-8 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-muted/50 p-4">
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="text-xl font-bold">
                    {Math.floor(elapsedSeconds / 60)}m {(elapsedSeconds % 60)}s
                  </p>
                </div>
                <div className="rounded-2xl bg-muted/50 p-4">
                  <p className="text-sm text-muted-foreground">Calories</p>
                  <p className="text-xl font-bold text-orange-500">{caloriesBurned}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Link
                  href="/explore"
                  className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-6 py-4 font-bold text-primary-foreground shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Find Another Routine
                </Link>
                <div className="flex gap-3 mt-2">
                     <button
                        onClick={() => {
                            setIsCompleted(false);
                            setElapsedSeconds(0);
                            setHasLogged(false);
                            setIsPlaying(false);
                        }}
                        className="flex-1 rounded-xl border border-border bg-transparent px-4 py-3 font-medium hover:bg-muted transition-colors"
                     >
                        Replay
                     </button>
                     <Link
                        href="/history"
                        className="flex-1 rounded-xl border border-border bg-transparent px-4 py-3 font-medium text-center hover:bg-muted transition-colors"
                     >
                        View History
                     </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
