import { PageContext } from "$components/base-html.component";
import { SecondaryButton } from "$components/buttons.component";
import { FormField } from "$components/fields.component";
import { CreateHabitComponent, Habits } from "$components/habits.component";
import { Headings, Title } from "$components/headings.component";
import { RootLayout } from "$components/layouts.component";
import { Habit } from "$db/schema";

export function HabitsPage({
  habits,
  isHTMX,
}: PageContext<{ habits: Habit[] }>) {
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
          <div class={"mx-auto flex gap-x-3 items-center"}>
            {/* <SecondaryButton hx-post="/api/auth/logout" text="Log out" /> */}
            <label for="value">Search</label>
            <input
              class={"grow rounded-md bg-neutral-800"}
              type="search"
              name="value"
              id="value"
              hx-get="/api/habits/search"
              hx-trigger="load, keyup changed delay:1000ms"
              hx-target="#habit-list"
              hx-swap="outerHTML"
            />
          </div>
        </div>
        <CreateHabitComponent />
        <Habits habits={habits} />
      </section>
    </RootLayout>
  );
}
