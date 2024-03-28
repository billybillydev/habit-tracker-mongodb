import { eq, sql, and } from "drizzle-orm";
import { db } from "../db";
import { type Habit, habitHistorySchema, habitSchema, type InsertHabit } from "../db/schema";
import { generateDatesWithCompletion } from "../lib";

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
      .select({ count: sql`count(*)`.mapWith(Number) })
      .from(habitSchema)
      .where(eq(habitSchema.userId, userId));

    return result;
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
  async findManyByUserId(userId: string): Promise<Habit[]> {
    const result = await db.query.habitSchema.findMany({
      where: (fields, { eq }) => eq(fields.userId, userId),
      with: {
        histories: true,
      },
    });
    return result;
  },
  async create(body: Omit<InsertHabit, "id">): Promise<Habit | undefined> {
    const [{id}] = await db
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
};

function getSampleHabits(userId: string) {
  return [
    {
      title: "Meditation",
      description: "Practice mindfulness for 10 minutes",
      color: "#F7D354",
      userId,
    },
    {
      title: "Exercise",
      description: "Go for a 30-minute walk or run",
      color: "#9B59B6",
      userId,
    },
    {
      title: "Journaling",
      description: "Write down your thoughts and feelings",
      color: "#F0E68C",
      userId,
    },
    {
      title: "Reading",
      description: "Read for 30 minutes before bed",
      color: "#66B3FF",
      userId,
    },
    {
      title: "Healthy eating",
      description: "Eat more fruits, vegetables, and whole grains",
      color: "#90EE90",
      userId,
    },
    {
      title: "Learning a new skill",
      description: "Spend 30 minutes learning something new",
      color: "#E0627C",
      userId,
    },
    {
      title: "Gratitude practice",
      description: "Write down 3 things you're grateful for",
      color: "#FFD700",
      userId,
    },
    {
      title: "Drinking water",
      description: "Drink 8 glasses of water per day",
      color: "#C0C0C0",
      userId,
    },
    {
      title: "Tidying up",
      description: "Spend 15 minutes decluttering your space",
      color: "#FFA500",
      userId,
    },
    {
      title: "Getting enough sleep",
      description: "Aim for 7-8 hours of sleep per night",
      color: "#3299D8",
      userId,
    },
  ];
}
