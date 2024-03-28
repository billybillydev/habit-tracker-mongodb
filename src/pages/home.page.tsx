import { PageContext } from "../components/base-html.component";
import { SecondaryButton } from "../components/buttons.component";
import { Divider } from "../components/divider.component";
import { Headings, SubTitle, Title } from "../components/headings.component";
import { RootLayout } from "../components/layouts.component";
import { SEO } from "../components/seo.component";

export function HomePage({
  isAuth,
  isHTMX,
}: PageContext<{ isAuth?: boolean }>) {
  const title = "Unleash Your Potential";
  const subTitle = "Build Lasting Habits That Stick";
  return (
    <RootLayout
      title={[title, subTitle].join(" : ")}
      class="flex flex-col gap-x-8"
      isHTMX={isHTMX}
    >
      <SEO title={[title, subTitle].join(" : ")} />
      <Headings>
        <Title text={title} />
        <SubTitle text={subTitle} />
      </Headings>
      <div
        class={
          "text-lg mx-auto p-2 w-full md:w-2/3 xl:w-1/2 flex flex-col gap-y-12"
        }
      >
        <p>
          Do you dream of finally achieving your goals? Whether it's mastering a
          new skill, improving your health, or boosting your productivity,
          lasting change starts with consistent action. But let's be honest,
          sticking to new habits can be tough. That's where our innovative
          habits tracker comes in.
        </p>
        <p>
          <em class={"font-bold text-sky-400"}>Our powerful tool</em> is
          designed to simplify habit formation and keep you motivated. Track
          your progress visually, set personalized reminders, and celebrate your
          milestones. Our data-driven insights will help you identify areas for
          improvement and stay accountable on your journey to success.
        </p>
        <p hx-boost="true">
          Stop letting good intentions fall by the wayside. Take control of your
          life and create positive change that lasts.{" "}
          <a href="/register">
            <em class={"text-indigo-400 text-xl"}>Sign up</em>
          </a>{" "}
          today and <u>unlock the power of habits</u>!
        </p>
        <div class={"text-center font-medium"}>
          {isAuth ? (
            <div class={"p-2 rounded-md border"}>
              <a
                class={"hover:underline hover:underline-offset-4"}
                href="/habits"
              >
                Let me check my habits
              </a>
              <Divider text="Or" />
              <SecondaryButton hx-post="/api/auth/logout" text="Log out" />
            </div>
          ) : (
            <a
              class={
                "hover:underline hover:underline-offset-4 p-2 border rounded-md"
              }
              href="/login"
            >
              Already an account ? Log in
            </a>
          )}
        </div>
      </div>
    </RootLayout>
  );
}
