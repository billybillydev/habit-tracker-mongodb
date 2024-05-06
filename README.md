# Habit Tracker

## The Project

This project is an experimental app made with Bun.

Initially from [Andrey Fadeev's video "Building app (Bun, HTMX, Sqlite, ElysiaJS and Tailwindcss) with Gemini AI Help](https://www.youtube.com/watch?v=zOOd9Dde_vM), I wanted to make the same project but with Hono.

Things leading to another things, I finally drove this project on my own way, wanted to better understand two librairies I think will be great to know: HTMX and Alpine JS. I also decided to explore many IT concepts/patterns such as Clean Code. It's the best way for me to understand all stuff surrounding developper's life and share it with you.

The tools I used in this project are:
- [Bun](https://bun.sh/docs) as runtime ;
- [Hono](https://hono.dev/getting-started/basic) ;
- The not so newbie [HTMX](https://htmx.org/docs) ;
- [Turso](https://docs.turso.tech/introduction) as sqlite database ;
- [Lucia]() for handling authentication and session ;
- [Drizzle](https://orm.drizzle.team/kit-docs/overview) as ORM ;
- [TailwindCSS](https://tailwindcss.com/docs/installation) for styling ;
- [AlpineJS](https://alpinejs.dev/essentials/installation) for managing interactivity ;
- [Docker](https://docs.docker.com/guides).

Of course if you can or if you want, clone the repo and install everything locally.

## The application

Habit Tracker is a straightforward web application that enables you to monitor the progress of your habits from 90 days ago.
The application provides a sample data you can use to manipulate a large number of habits.

Here are the available features:

- Create a habit;
- Modify a habit;
- Delete a habit;
- Bulk delete habits;
- Mark a habit as done/undone.

To use all of these features, you need to first log in, either with your Google account or with your email and password. And of course, you can create an account if you don't already have one.

## About Installation

To properly run this project, it bests to firstly provide an .env file with this environment variables:

- NODE_ENV
- DATABASE_CONNECTION_TYPE
- LOG_LEVEL
- HOST_URL
- PORT?
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- GOOGLE_REDIRECT_URI_PATH
- DATABASE_URL
- DATABASE_AUTH_TOKEN

_PS: PORT variable is optional (default value is 3000)_

To install dependencies:
```sh
bun install
```

To run:
```sh
bun run dev
```

open http://localhost:3000

Using docker, running ```docker compose build``` followed by ```docker compose up``` will do the job.

## HTMX

HTMX enables you an easy way to write ajax call by using attributes in your html (or jsx) file.
This project covers many functionalities such as CRUD oprations, ajax request after confirm.
Combined with Alpine.js, we have something truly powerful.

An intersting htmx's extension has been used in this application: **[response-targets](https://htmx.org/extensions/response-targets)**.
It's a very useful and so powerful extension which provide a way to handle multiple targets based on http status. We mainly use it to deal with 4xx and 5xx status.

_PS: Just know that in server side, you can modify the response target with **HX-Target** header's attribute._

## Alpine.js

This small library will add reactivity to your website, allowing you to write much of your code directly in your HTML/JSX files.
In this project, I've chosen to extend its functionality primarily in a separate TS file. This represents an advanced usage.

As we can develop "plugins" from it, I'm using a wonderful plugin which gives me the ability to manage another x-data values by using the dom element id !
The plugin is **[alpine-manage](https://github.com/markmead/alpinejs-manage)**
