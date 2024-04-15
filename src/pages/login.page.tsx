import { LoginForm } from "$components/auth.component";
import { Divider } from "$components/divider.component";
import { Headings, Title } from "$components/headings.component";
import { RootLayout } from "$components/layouts.component";

export function LoginPage({ errorGoogle }: { errorGoogle?: string }) {
  return (
    <RootLayout title="Please login" class="flex flex-col p-2">
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
        <h2 class={"text-2xl text-center"}>Log in</h2>
        {errorGoogle ? <p class="text-red-500 text-center">{errorGoogle}</p> : null}
        <LoginForm />
        <Divider text="Or" />
        <a
          hx-get="/api/auth/login/google"
          hx-target-4xx="#error-login"
          class={
            "text-green-600 text-center hover:underline hover:underline-offset-4"
          }
        >
          Log in with Google
        </a>
        <a
          href="/register"
          class={
            "text-indigo-400 text-center hover:underline hover:underline-offset-4"
          }
        >
          No account ? Create one here !
        </a>
      </div>
    </RootLayout>
  );
}
