import { Habit } from "$db/models";
import { generateDatesWithCompletion } from "$lib";

export const habitService = {
  async seed(userId: string) {
    const sampleHabits = getSampleHabits(userId);
    const results = await Habit.insertMany(sampleHabits);
    return results;
  },
  async findById(id: string): Promise<Habit | null> {
    const result = await Habit.findById(id);
    return result;
  },
  async findManyWithCountByUserId(
    userId: string,
    limit: number = 4,
    skip: number = 0
  ): Promise<[Habit[], number]> {
    const result = await Habit.aggregate([
      {
        $facet: {
          totalCount: [{ $count: "count" }],
          filteredDocuments: [
            { $match: { userId } },
            { $skip: skip },
            { $limit: limit },
            { $sort: { updateAt: 1 } },
          ],
        },
      },
    ]).then((res) => res[0]);
    return [result.filteredDocuments, result.totalCount[0]?.count || 0];
  },
  async findManyWithCountByTitle(
    searchValue: string,
    userId: string,
    limit: number = 4,
    skip: number = 0
  ): Promise<[Habit[], number]> {
    const result = await Habit.aggregate([
      {
        $facet: {
          totalCount: [
            { $match: { title: { $regex: searchValue, $options: "i" } } },
            { $count: "count" },
          ],
          filteredDocuments: [
            {
              $match: { userId, title: { $regex: searchValue, $options: "i" } },
            },
            { $skip: skip },
            { $limit: limit },
            { $sort: { updateAt: 1 } },
          ],
        },
      },
    ]).then((res) => res[0]);
    return [result.filteredDocuments, result.totalCount[0]?.count || 0];
  },
  // async create(body: Omit<InsertHabit, "id">): Promise<Habit | undefined> {
  //   const [{ id }] = await db
  //     .insert(habitSchema)
  //     .values(body)
  //     .returning({ id: habitSchema.id });
  //   const result = await this.findById(id);
  //   return result;
  // },
  // async updateById(
  //   id: number,
  //   body: { title: Habit["title"]; description: Habit["description"] }
  // ) {
  //   await db.update(habitSchema).set(body).where(eq(habitSchema.id, id));
  //   const result = await this.findById(id);
  //   return result;
  // },
  // async deleteById(id: number) {
  //   const result = await db
  //     .delete(habitSchema)
  //     .where(eq(habitSchema.id, id))
  //     .returning()
  //     .get();
  //   return result;
  // },
  // async deleteBulkIds(ids: number[]) {
  //   const result = await db
  //     .delete(habitSchema)
  //     .where(inArray(habitSchema.id, ids))
  //     .returning()
  //     .get();
  //   return result;
  // },
};

function getSampleHabits(userId: string) {
  return [
    {
      title: "Running",
      description: "Run for at least 30 minutes every morning",
      color: "#FF5733",
      userId,
      histories: generateDatesWithCompletion(90)
    },
    {
      title: "Reading",
      description: "Read a chapter of a book before bed",
      color: "#3366FF",
      userId,
      histories: generateDatesWithCompletion(90)
    },
    {
      title: "Meditation",
      description: "Meditate for 10 minutes daily",
      color: "#33FF66",
      userId,
      histories: generateDatesWithCompletion(90)
    },
    {
      title: "Writing",
      description: "Write 500 words every evening",
      color: "#FF33CC",
      userId,
      histories: generateDatesWithCompletion(90)
    },
    {
      title: "Exercise",
      description: "Go to the gym three times a week",
      color: "#FFFF33",
      userId,
      histories: generateDatesWithCompletion(90)
    },
    {
      title: "Healthy Eating",
      description: "Eat at least five servings of fruits and vegetables daily",
      color: "#33FFFF",
      userId,
      histories: generateDatesWithCompletion(90)
    },
    {
      title: "Journaling",
      description: "Write down thoughts and experiences daily",
      color: "#9966FF",
      userId,
      histories: generateDatesWithCompletion(90)
    },
    {
      title: "Coding",
      description: "Practice coding for an hour every day",
      color: "#FF9933",
      userId,
      histories: generateDatesWithCompletion(90)
    },
    {
      title: "Yoga",
      description: "Practice yoga for 20 minutes every morning",
      color: "#66FF33",
      userId,
      histories: generateDatesWithCompletion(90)
    },
    {
      title: "Learning",
      description: "Learn something new every day",
      color: "#FF3366",
      userId,
      histories: generateDatesWithCompletion(90)
    },
    {
      title: "Drawing",
      description: "Sketch for 30 minutes daily",
      color: "#33FF99",
      userId,
      histories: generateDatesWithCompletion(90)
    },
    {
      title: "Walking",
      description: "Take a 30-minute walk after dinner",
      color: "#FF6633",
      userId,
      histories: generateDatesWithCompletion(90)
    },
    {
      title: "Gardening",
      description: "Spend 20 minutes in the garden every morning",
      color: "#FFCC33",
      userId,
      histories: generateDatesWithCompletion(90)
    },
    {
      title: "Language Learning",
      description: "Study a new language for 30 minutes daily",
      color: "#33FFCC",
      userId,
      histories: generateDatesWithCompletion(90)
    },
    {
      title: "Music Practice",
      description: "Practice playing an instrument for 1 hour daily",
      color: "#FF33FF",
      userId,
      histories: generateDatesWithCompletion(90)
    },
    {
      title: "Cooking",
      description: "Cook a new recipe every weekend",
      color: "#66FF66",
      userId,
      histories: generateDatesWithCompletion(90)
    },
    {
      title: "Photography",
      description: "Take a photo every day",
      color: "#3366CC",
      userId,
      histories: generateDatesWithCompletion(90)
    },
    {
      title: "Dancing",
      description: "Dance for 30 minutes every evening",
      color: "#33CCFF",
      userId,
      histories: generateDatesWithCompletion(90)
    },
    {
      title: "Volunteering",
      description: "Volunteer for a cause once a week",
      color: "#FF6600",
      userId,
      histories: generateDatesWithCompletion(90)
    },
    {
      title: "Organization",
      description: "Spend 15 minutes decluttering every day",
      color: "#CC33FF",
      userId,
      histories: generateDatesWithCompletion(90)
    },
    {
      title: "Budgeting",
      description: "Track expenses and budget weekly",
      color: "#33FF00",
      userId,
      histories: generateDatesWithCompletion(90)
    },
    {
      title: "Networking",
      description: "Connect with a new person in your field weekly",
      color: "#FF00CC",
      userId,
      histories: generateDatesWithCompletion(90)
    },
    {
      title: "Mindfulness",
      description: "Practice mindfulness for 10 minutes daily",
      color: "#CCFF33",
      userId,
      histories: generateDatesWithCompletion(90)
    },
    {
      title: "Crafting",
      description: "Work on a crafting project for 1 hour daily",
      color: "#FF9933",
      userId,
      histories: generateDatesWithCompletion(90)
    },
    {
      title: "Travel Planning",
      description: "Plan your next trip for 30 minutes daily",
      color: "#33FF33",
      userId,
      histories: generateDatesWithCompletion(90)
    },
    {
      title: "Socializing",
      description: "Spend quality time with friends or family weekly",
      color: "#FF3366",
      userId,
      histories: generateDatesWithCompletion(90)
    },
    {
      title: "Self-care",
      description: "Take time for self-care activities daily",
      color: "#FFFF66",
      userId,
      histories: generateDatesWithCompletion(90)
    },
    {
      title: "DIY Projects",
      description: "Work on a DIY project for 1 hour daily",
      color: "#66FFFF",
      userId,
      histories: generateDatesWithCompletion(90)
    },
    {
      title: "Reading News",
      description: "Read news articles for 20 minutes daily",
      color: "#9933FF",
      userId,
      histories: generateDatesWithCompletion(90)
    },
    {
      title: "Studying",
      description: "Study for upcoming exams or certifications",
      color: "#33CCFF",
      userId,
      histories: generateDatesWithCompletion(90)
    },
    {
      title: "Podcast Listening",
      description: "Listen to podcasts during daily commute",
      color: "#FF0066",
      userId,
      histories: generateDatesWithCompletion(90)
    },
    {
      title: "Teaching",
      description: "Teach someone something new weekly",
      color: "#FF6600",
      userId,
      histories: generateDatesWithCompletion(90)
    },
  ];
}
