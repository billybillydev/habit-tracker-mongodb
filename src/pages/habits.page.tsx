
import { PageContext } from "$components/base-html.component";
import { SecondaryButton } from "$components/buttons.component";
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
      <section
        class="h-full flex flex-col gap-y-8"
      >
        <div class={"flex flex-col gap-y-4"}>
          <Headings>
            <a href="/">
              <Title text="Simple Habit Tracker" />
            </a>
          </Headings>
          <div class={"mx-auto"}>
            <SecondaryButton hx-post="/api/auth/logout" text="Log out" />
          </div>
        </div>
        <CreateHabitComponent />
        <Habits habits={habits} />
      </section>
    </RootLayout>
  );
}
