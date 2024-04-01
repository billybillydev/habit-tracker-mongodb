import { PageContext } from "$components/base-html.component";
import {
  CreateHabitComponent,
  Habits,
  HabitsMoreButton,
} from "$components/habits.component";
import { Headings, Title } from "$components/headings.component";
import { RootLayout } from "$components/layouts.component";
import { Habit } from "$db/schema";

export function HabitsPage({
  habits,
  isHTMX,
  searchValue,
  count,
  offset,
  limit,
  sessionUser,
}: PageContext<{
  habits: Habit[];
  searchValue?: string;
  count: number;
  offset: number;
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
          <hr />
          {sessionUser ? (
            <h2 class="text-center text-xl">Hello {sessionUser.name}</h2>
          ) : null}
          <div
            class={
              "mx-auto flex gap-x-3 items-center w-full px-2 md:px-6 xl:px-12"
            }
          >
            <div class="grow flex gap-x-3 items-center">
              <label for="value">Search</label>
              <input
                class={"grow rounded-md bg-neutral-800"}
                type="search"
                name="value"
                id="value"
                hx-get="/api/habits/search"
                hx-trigger="keyup changed delay:1000ms"
                hx-target="#habit-list"
                hx-swap="outerHTML"
                hx-vals={JSON.stringify({ offset, limit })}
                hx-select-oob="#more-habits"
                value={searchValue}
              />
            </div>
            <div class="px-3">
              <a title="for not found purpose" href="/settings">Settings</a>
            </div>
          </div>
        </div>
        <CreateHabitComponent />
        <Habits habits={habits} />
        <HabitsMoreButton
          habitLength={habits.length}
          count={count}
          offset={offset}
          limit={limit}
          search={searchValue}
        />
      </section>
    </RootLayout>
  );
}
