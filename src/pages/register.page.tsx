import { Html } from "@elysiajs/html";
import { Divider } from "../components/divider.component";
import { Headings, Title } from "../components/headings.component";
import { RootLayout } from "../components/layouts.component";
import { RegisterForm } from "../components/auth.component";

export function RegisterPage() {
  return (
    <RootLayout title="Create an account" class="flex flex-col p-2">
      <Headings>
        <a href="/">
          <Title text="Simple Habit Tracker" />
        </a>
      </Headings>
      <div
        class={
          "mx-auto w-full md:w-2/3 xl:w-1/2 gap-y-4 flex flex-col rounded border p-4"
        }
      >
        <h2 class={"text-2xl text-center"}>Sign up</h2>
        <RegisterForm />
        <Divider text="Or" />
        <a
          href="/login"
          class={
            "text-neutral-100 text-center hover:underline hover:underline-offset-4"
          }
        >
          Already an account ? Log in here !
        </a>
      </div>
    </RootLayout>
  );
}
