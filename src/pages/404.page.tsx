import { Headings, Title } from "$components/headings.component";
import { RootLayout } from "$components/layouts.component";

export function NotFoundPage() {
  return (
    <RootLayout title="404 Not Found">
      <div class="h-full flex flex-col gap-y-8">
        <div class={"flex flex-col gap-y-4"}>
          <Headings>
            <a href="/">
              <Title text="Simple Habit Tracker" />
            </a>
          </Headings>
          <hr />
        </div>
        <div class="h-full w-full flex items-center justify-center">
          <p class="text-2xl">Sorry, we didn't find the page you are looking for :(</p>
        </div>
      </div>
    </RootLayout>
  );
}
