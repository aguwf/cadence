import { PrismaClient, Difficulty } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seeding...");

  // 1. Clean up existing data (optional but good for idempotency)
  // Be careful in prod, but for dev this is fine.
  await prisma.practiceLog.deleteMany();
  await prisma.playlistVideo.deleteMany();
  await prisma.danceRoutine.deleteMany();
  await prisma.category.deleteMany();

  // 2. Create Categories
  const categoriesData = [
    {
      name: "K-Pop",
      slug: "k-pop",
      image: "https://images.unsplash.com/photo-1532452119098-a3650b3c46d3?auto=format&fit=crop&q=80&w=800",
    },
    {
        name: "Hip-Hop",
        slug: "hip-hop",
        image: "https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&q=80&w=800",
      },
    {
      name: "Cardio Dance",
      slug: "cardio-dance",
      image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800",
    },
  ];

  const categoriesMap = new Map();

  for (const cat of categoriesData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categoriesMap.set(cat.slug, created.id);
    console.log(`✅ Category created: ${cat.name}`);
  }

  // 3. Create Routines
  const routinesData = [
    // K-Pop
    {
      title: "BTS - Dynamite (Dance Workout)",
      description: "Light up your morning with this energetic K-Pop routine! Perfect for beginners wanting to learn the basics while sweating.",
      videoUrl: "https://www.youtube.com/watch?v=gdZLi9oWNZg", // Mock URL
      thumbnailUrl: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?auto=format&fit=crop&q=80&w=800",
      duration: 210, // 3:30
      difficulty: Difficulty.BEGINNER,
      bpm: 114,
      caloriesPerMin: 8,
      categoryId: categoriesMap.get("k-pop"),
    },
    {
      title: "BLACKPINK - Kill This Love (Full Body)",
      description: "Intense choreography focus. Get ready to engage your core and legs with this powerful routine.",
      videoUrl: "https://www.youtube.com/watch?v=2S24-y0Ij3Y",
      thumbnailUrl: "https://images.unsplash.com/photo-1621976498727-9e5926796c4c?auto=format&fit=crop&q=80&w=800",
      duration: 195, // 3:15
      difficulty: Difficulty.ADVANCED,
      bpm: 132,
      caloriesPerMin: 10,
      categoryId: categoriesMap.get("k-pop"),
    },
    // Hip-Hop
    {
      title: "Old School Hip Hop Groove",
      description: "Bounce to the beat with 90s inspired moves. Relaxed but rhythmic.",
      videoUrl: "https://www.youtube.com/watch?v=sample-hiphop-1",
      thumbnailUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=800",
      duration: 300, // 5:00
      difficulty: Difficulty.INTERMEDIATE,
      bpm: 95,
      caloriesPerMin: 7,
      categoryId: categoriesMap.get("hip-hop"),
    },
    {
      title: "Urban Choreography Basics",
      description: "Learn isolation and texture in your movement. A great class for stepping up your dance skills.",
      videoUrl: "https://www.youtube.com/watch?v=sample-hiphop-2",
      thumbnailUrl: "https://images.unsplash.com/photo-1535525153412-5a42439a210d?auto=format&fit=crop&q=80&w=800",
      duration: 420, // 7:00
      difficulty: Difficulty.INTERMEDIATE,
      bpm: 100,
      caloriesPerMin: 6,
      categoryId: categoriesMap.get("hip-hop"),
    },
    // Cardio Dance
    {
      title: "High Intensity Pop Remix",
      description: "Non-stop movement to top 40 hits. Maximum calorie burn in minimum time.",
      videoUrl: "https://www.youtube.com/watch?v=sample-cardio-1",
      thumbnailUrl: "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?auto=format&fit=crop&q=80&w=800",
      duration: 600, // 10:00
      difficulty: Difficulty.EXPERT,
      bpm: 140,
      caloriesPerMin: 12,
      categoryId: categoriesMap.get("cardio-dance"),
    },
    {
        title: "Latin Fusion Cardio",
        description: "Salsa and Merengue inspired steps to get your heart pumping and hips moving.",
        videoUrl: "https://www.youtube.com/watch?v=sample-cardio-2",
        thumbnailUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800",
        duration: 480, // 8:00
        difficulty: Difficulty.BEGINNER,
        bpm: 128,
        caloriesPerMin: 9,
        categoryId: categoriesMap.get("cardio-dance"),
      },
  ];

  for (const routine of routinesData) {
    if (!routine.categoryId) {
        console.warn(`⚠️ Skipping routine "${routine.title}" because category was not found.`);
        continue;
    }
    await prisma.danceRoutine.create({
      data: routine,
    });
    console.log(`✅ Routine created: ${routine.title}`);
  }

  console.log("🌱 Seeding finished.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
