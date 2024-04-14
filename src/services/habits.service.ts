import { eq, sql, and, like, inArray } from "drizzle-orm";
import { db } from "$db";
import {
  habitHistorySchema,
  habitSchema,
  Habit,
  InsertHabit,
} from "$db/schema";
import { generateDatesWithCompletion } from "$lib";

export const habitService = {
  history: {
    async seed(userId: string) {
      const habits = await habitService.seed(userId);
      const result = await Promise.all(
        habits?.map(async (habit) => {
          const histories = generateDatesWithCompletion(90);
          habit.histories = await this.createBulk(
            habit.id,
            histories
              .filter((history) => history.completed)
              .map(({ date }) => date)
          );
          return habit;
        })
      );
      return result;
    },
    async findOne(id: number, date: string) {
      const result = await db.query.habitHistorySchema.findFirst({
        where(fields, { and, eq }) {
          return and(eq(fields.date, date), eq(fields.habitId, id));
        },
      });
      return result;
    },
    async findByHabitId(habitId: number) {
      const result = await db.query.habitHistorySchema.findMany({
        where(fields, { eq }) {
          return eq(fields.habitId, habitId);
        },
      });
      return result;
    },
    async create(id: number, date: string) {
      const result = await db
        .insert(habitHistorySchema)
        .values({ date, habitId: id })
        .returning()
        .get();
      return result;
    },
    async createBulk(id: number, dates: string[]) {
      const result = await db
        .insert(habitHistorySchema)
        .values(dates.map((date) => ({ date, habitId: id })))
        .returning();
      return result;
    },
    async delete(id: number, date: string) {
      const result = await db
        .delete(habitHistorySchema)
        .where(
          and(
            eq(habitHistorySchema.date, date),
            eq(habitHistorySchema.habitId, id)
          )
        )
        .returning()
        .get();
      return result;
    },
  },
  async count(userId: string) {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(habitSchema)
      .where(eq(habitSchema.userId, userId))
      .get();

    return result?.count ?? 0;
  },
  async seed(userId: string) {
    await db.insert(habitSchema).values(getSampleHabits(userId));
    const result = await db.query.habitSchema.findMany({
      with: { histories: true },
    });
    return result;
  },
  async findById(id: number): Promise<Habit | undefined> {
    const result = await db.query.habitSchema.findFirst({
      where: (fields, { eq }) => eq(fields.id, id),
      with: {
        histories: true,
      },
    });
    return result;
  },
  async findManyByUserId(
    userId: string,
    limit: number = 4,
    offset: number = 0
  ): Promise<Habit[]> {
    const result = await db.query.habitSchema.findMany({
      where: (fields, { eq }) => eq(fields.userId, userId),
      limit,
      offset,
      with: {
        histories: true,
      },
      orderBy(fields, { desc }) {
        return desc(fields.created_at);
      },
    });
    return result;
  },
  async findByTitle(
    searchValue: string,
    userId: string,
    limit: number = 4,
    offset: number = 0
  ): Promise<Habit[]> {
    const result = await db.query.habitSchema.findMany({
      where: (fields, { eq, and, like }) =>
        and(like(fields.title, `%${searchValue}%`), eq(fields.userId, userId)),
      with: {
        histories: true,
      },
      limit,
      offset,
      orderBy(fields, { desc }) {
        return desc(fields.created_at);
      },
    });
    return result;
  },
  async countTitle(searchValue: string, userId: string) {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(habitSchema)
      .where(
        and(
          like(habitSchema.title, `%${searchValue}%`),
          eq(habitSchema.userId, userId)
        )
      )
      .get();

    return result?.count ?? 0;
  },
  async create(body: Omit<InsertHabit, "id">): Promise<Habit | undefined> {
    const [{ id }] = await db
      .insert(habitSchema)
      .values(body)
      .returning({ id: habitSchema.id });
    const result = await this.findById(id);
    return result;
  },
  async updateById(
    id: number,
    body: { title: Habit["title"]; description: Habit["description"] }
  ) {
    await db.update(habitSchema).set(body).where(eq(habitSchema.id, id));
    const result = await this.findById(id);
    return result;
  },
  async deleteById(id: number) {
    const result = await db
      .delete(habitSchema)
      .where(eq(habitSchema.id, id))
      .returning()
      .get();
    return result;
  },
  async deleteBulkIds(ids: number[]) {
    const result = await db
      .delete(habitSchema)
      .where(inArray(habitSchema.id, ids))
      .returning()
      .get();
    return result;
  },
};

function getSampleHabits(userId: string) {
  return [
    {
      title: "Running",
      description: "Run for at least 30 minutes every morning",
      color: "#FF5733",
      userId,
    },
    {
      title: "Reading",
      description: "Read a chapter of a book before bed",
      color: "#3366FF",
      userId,
    },
    {
      title: "Meditation",
      description: "Meditate for 10 minutes daily",
      color: "#33FF66",
      userId,
    },
    {
      title: "Writing",
      description: "Write 500 words every evening",
      color: "#FF33CC",
      userId,
    },
    {
      title: "Exercise",
      description: "Go to the gym three times a week",
      color: "#FFFF33",
      userId,
    },
    {
      title: "Healthy Eating",
      description: "Eat at least five servings of fruits and vegetables daily",
      color: "#33FFFF",
      userId,
    },
    {
      title: "Journaling",
      description: "Write down thoughts and experiences daily",
      color: "#9966FF",
      userId,
    },
    {
      title: "Coding",
      description: "Practice coding for an hour every day",
      color: "#FF9933",
      userId,
    },
    {
      title: "Yoga",
      description: "Practice yoga for 20 minutes every morning",
      color: "#66FF33",
      userId,
    },
    {
      title: "Learning",
      description: "Learn something new every day",
      color: "#FF3366",
      userId,
    },
    {
      title: "Drawing",
      description: "Sketch for 30 minutes daily",
      color: "#33FF99",
      userId,
    },
    {
      title: "Walking",
      description: "Take a 30-minute walk after dinner",
      color: "#FF6633",
      userId,
    },
    {
      title: "Gardening",
      description: "Spend 20 minutes in the garden every morning",
      color: "#FFCC33",
      userId,
    },
    {
      title: "Language Learning",
      description: "Study a new language for 30 minutes daily",
      color: "#33FFCC",
      userId,
    },
    {
      title: "Music Practice",
      description: "Practice playing an instrument for 1 hour daily",
      color: "#FF33FF",
      userId,
    },
    {
      title: "Cooking",
      description: "Cook a new recipe every weekend",
      color: "#66FF66",
      userId,
    },
    {
      title: "Photography",
      description: "Take a photo every day",
      color: "#3366CC",
      userId,
    },
    {
      title: "Dancing",
      description: "Dance for 30 minutes every evening",
      color: "#33CCFF",
      userId,
    },
    {
      title: "Volunteering",
      description: "Volunteer for a cause once a week",
      color: "#FF6600",
      userId,
    },
    {
      title: "Organization",
      description: "Spend 15 minutes decluttering every day",
      color: "#CC33FF",
      userId,
    },
    {
      title: "Budgeting",
      description: "Track expenses and budget weekly",
      color: "#33FF00",
      userId,
    },
    {
      title: "Networking",
      description: "Connect with a new person in your field weekly",
      color: "#FF00CC",
      userId,
    },
    {
      title: "Mindfulness",
      description: "Practice mindfulness for 10 minutes daily",
      color: "#CCFF33",
      userId,
    },
    {
      title: "Crafting",
      description: "Work on a crafting project for 1 hour daily",
      color: "#FF9933",
      userId,
    },
    {
      title: "Travel Planning",
      description: "Plan your next trip for 30 minutes daily",
      color: "#33FF33",
      userId,
    },
    {
      title: "Socializing",
      description: "Spend quality time with friends or family weekly",
      color: "#FF3366",
      userId,
    },
    {
      title: "Self-care",
      description: "Take time for self-care activities daily",
      color: "#FFFF66",
      userId,
    },
    {
      title: "DIY Projects",
      description: "Work on a DIY project for 1 hour daily",
      color: "#66FFFF",
      userId,
    },
    {
      title: "Reading News",
      description: "Read news articles for 20 minutes daily",
      color: "#9933FF",
      userId,
    },
    {
      title: "Studying",
      description: "Study for upcoming exams or certifications",
      color: "#33CCFF",
      userId,
    },
    {
      title: "Podcast Listening",
      description: "Listen to podcasts during daily commute",
      color: "#FF0066",
      userId,
    },
    {
      title: "Teaching",
      description: "Teach someone something new weekly",
      color: "#FF6600",
      userId,
    },
  ];
}
