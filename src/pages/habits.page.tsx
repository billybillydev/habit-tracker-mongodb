import { PageContext } from "$components/base-html.component";
import {
  CreateHabitComponent,
  HabitContainer,
  NoHabits
} from "$components/habits.component";
import { Headings, Title } from "$components/headings.component";
import { RootLayout } from "$components/layouts.component";
import { Habit } from "$db/models";

export function HabitsPage({
  habits,
  isHTMX,
  searchValue,
  count,
  limit,
  sessionUser,
}: PageContext<{
  habits: Habit[];
  searchValue?: string;
  count: number;
  limit: number;
}>) {
  return (
    <RootLayout title="Habit Tracker" isHTMX={isHTMX}>
      <section class="h-full flex flex-col gap-y-8">
        <div class={"flex flex-col gap-y-4"}>
          <Headings>
            <a href="/">
              <Title text="Simple Habit Tracker" />
            </a>
          </Headings>
          {sessionUser ? (
            <h2 class="text-center text-xl">Hello {sessionUser.name}</h2>
          ) : null}
        </div>
        <CreateHabitComponent />
        {(habits.length || searchValue) ? (
          <HabitContainer count={count} habits={habits} limit={limit} searchValue={searchValue} />
        ) : (
          <NoHabits />
        )}
      </section>
    </RootLayout>
  );
}
