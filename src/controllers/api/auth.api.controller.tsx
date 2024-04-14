import { Hono } from "hono";
import { Argon2id } from "oslo/password";
import { generateCodeVerifier, generateState } from "arctic";
import { getCookie, setCookie } from "hono/cookie";
import { zValidator } from "@hono/zod-validator";
import { generateId } from "lucia";
import { z } from "zod";
import { GoogleProfile } from "$auth";
import { fetchApi } from "$lib";
import { userService } from "$services/user.service";
import { AppVariables } from "src";
import { HomePage } from "$pages/home.page";

const googleAuthApiController = new Hono<{ Variables: AppVariables }>()
  .get("/", async (ctx) => {
    const auth = ctx.get("auth");
    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    const url = await auth.google.createAuthorizationURL(state, codeVerifier, {
      scopes: ["https://www.googleapis.com/auth/userinfo.profile"],
    });
    setCookie(ctx, "google_code_verifier", codeVerifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 10,
      path: "/",
    });
    setCookie(ctx, "google_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 10,
      path: "/",
    });
    console.log("in api/login/google");
    return ctx.header("HX-Redirect", url.href);
  })
  .get(
    "/callback",
    zValidator(
      "query",
      z.object({
        state: z.string(),
        code: z.string(),
      })
    ),
    async (ctx) => {
      const auth = ctx.get("auth");
      const lucia = ctx.get("lucia");
      const { state, code } = ctx.req.query();
      const stateCookie = getCookie(ctx, "google_state");
      const codeVerifier = getCookie(ctx, "google_code_verifier");
      if (!state || !stateCookie || stateCookie !== state || !codeVerifier) {
        throw new Error("state or codeVerifier invalid");
      }

      const tokens = await auth.google.validateAuthorizationCode(
        code,
        codeVerifier
      );
      const googleUserResult = await fetchApi<GoogleProfile>(
        "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
        {
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
          },
        }
      );
      async function getUserOrCreate() {
        const existingUser = await userService.getByGoogleId(
          googleUserResult.id
        );

        return (
          existingUser ??
          (await userService.create({
            googleId: googleUserResult.id,
            name: googleUserResult.name,
            id: generateId(15),
            authType: "google",
          }))
        );
      }
      const user = await getUserOrCreate();

      const session = await lucia.createSession(user.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      setCookie(ctx, "lucia_session", sessionCookie.value, {
        domain: sessionCookie.attributes.domain,
        expires: sessionCookie.attributes.expires,
        httpOnly: sessionCookie.attributes.httpOnly,
        path: sessionCookie.attributes.path,
        maxAge: sessionCookie.attributes.maxAge,
      });
      return ctx.redirect("/habits");
    }
  );

const loginApiController = new Hono<{ Variables: AppVariables }>()
  .post(
    "/",
    zValidator(
      "form",
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    ),
    async (ctx) => {
      const lucia = ctx.get("lucia");
      const { email, password } = ctx.req.valid("form");
      const user = await userService.getByEmail(email);
      if (!user) {
        return ctx.text("Invalid email or password", 400);
      }
      // Ensure that user is BasicUser
      if (!user.password) {
        throw new Error("Internal Server Error");
      }
      const validPassword = await new Argon2id().verify(
        user.password,
        password
      );
      if (!validPassword) {
        return ctx.text("Invalid email or password", 400);
      }
      const session = await lucia.createSession(user.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      setCookie(ctx, "lucia_session", sessionCookie.value, {
        domain: sessionCookie.attributes.domain,
        expires: sessionCookie.attributes.expires,
        httpOnly: sessionCookie.attributes.httpOnly,
        path: sessionCookie.attributes.path,
        maxAge: sessionCookie.attributes.maxAge,
      });
      ctx.header("HX-Redirect", "/habits");
      return ctx.text("");
    }
  )
  .route("/google", googleAuthApiController);

const registerApiController = new Hono<{ Variables: AppVariables }>().post(
  "/",
  zValidator(
    "form",
    z.object({
      email: z.string().email(),
      password: z.string(),
      name: z.string(),
    })
  ),
  async (ctx) => {
    const lucia = ctx.get("lucia");
    const { email, password, name } = ctx.req.valid("form");
    const existingUser = await userService.getByEmail(email);
    if (existingUser) {
      return ctx.text("User already exist", 409, {
        "HX-Reswap": "innerHTML",
      });
    }
    const hashedPassword = await Bun.password.hash(password);
    const newUser = await userService.create({
      id: generateId(15),
      name,
      email,
      password: hashedPassword,
      authType: "basic",
    });
    const session = await lucia.createSession(newUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    setCookie(ctx, "lucia_session", sessionCookie.value, {
      domain: sessionCookie.attributes.domain,
      expires: sessionCookie.attributes.expires,
      httpOnly: sessionCookie.attributes.httpOnly,
      path: sessionCookie.attributes.path,
      maxAge: sessionCookie.attributes.maxAge,
    });
    return ctx.html(
      <HomePage isHTMX={Boolean(ctx.req.header("hx-request"))} isAuth />,
      200,
      { "HX-Trigger": "registerSuccessNotification" }
    );
  }
);

const logoutApiController = new Hono<{ Variables: AppVariables }>().post(
  "/",
  async (ctx) => {
    const lucia = ctx.get("lucia");
    const lucia_session = getCookie(ctx, "lucia_session");

    if (!lucia_session) {
      throw new Error("Lucia session doesn't exist");
    }
    await lucia.invalidateSession(lucia_session);
    const sessionCookie = lucia.createBlankSessionCookie();
    setCookie(
      ctx,
      "lucia_session",
      sessionCookie.value
      // sessionCookie.attributes
    );
    return ctx.res.headers.append("HX-Redirect", "/");
  }
);

export const authApiController = new Hono()
  .route("/login", loginApiController)
  .route("/register", registerApiController)
  .route("/logout", logoutApiController);
