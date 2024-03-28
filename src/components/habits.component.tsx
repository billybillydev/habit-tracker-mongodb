import { type Habit } from "../db/schema";
import { generateDatesByNumberOfDays } from "../lib";
import {
  DangerButton,
  InfoButton,
  PrimaryButton,
  SecondaryButton,
} from "./buttons.component";
import { FormField } from "./fields.component";
import { type Notification } from "./notifications.component";

export type HabitsProps = { habits: Habit[] };

export function CreateHabitForm() {
  const targetId = "habit-list";
  const createHabitErrorMessageId = "create-habit-error";
  const createHabitFormRef = "create-habit-form";
  return (
    <form
      hx-post="/api/habits"
      hx-swap={`afterbegin`}
      hx-target={`#${targetId}`}
      hx-target-5xx={`#${createHabitErrorMessageId}`}
      x-ref={createHabitFormRef}
      x-init={`
        $el.addEventListener('htmx:afterRequest', (event) => {
          if(event.detail.xhr.status === 200){
            $el.reset();
            showForm = false;
          }
        });
      `}
      class={"flex flex-col gap-y-4 border p-8 rounded-xl max-w-3xl mx-auto"}
    >
      <div class={"flex items-center gap-x-8 w-full"}>
        <FormField class="w-2/3" fieldName="title" />
        <FormField class="w-1/3" fieldName="color" type="color" />
      </div>
      <FormField fieldName="description" />
      <p
        id={createHabitErrorMessageId}
        class={"text-center text-red-500 p-2"}
      />
      <div class={"flex items-center justify-center gap-x-8"}>
        <SecondaryButton
          x-on:click={`
            $refs["${createHabitFormRef}"].reset();
            document.getElementById("${createHabitErrorMessageId}").textContent = "";
            showForm = false;
          `}
          text="Cancel"
          type="button"
        />
        <PrimaryButton text="Submit" class="hover:text-sky-700" type="submit" />
      </div>
    </form>
  );
}

export function EditHabitForm({
  title,
  description,
  id,
  modalRef,
}: Omit<Habit, "color"> & { modalRef: string }) {
  const editHabitErrorMessageId = "edit-habit-error";
  const targetItem = "habit-item-" + id;
  return (
    <form
      hx-put={"/api/habits/" + id}
      hx-target={`#${targetItem}`}
      hx-swap="outerHTML"
      hx-target-4xx={`#${editHabitErrorMessageId}`}
      hx-target-5xx={`#${editHabitErrorMessageId}`}
      x-init={`
        $el.addEventListener('htmx:afterRequest', (event) => {
          if(event.detail.xhr.status === 200){
            $refs["${modalRef}"].remove();
          }
        });
      `}
      class={"flex flex-col gap-y-4 border p-8 rounded-xl w-full mx-auto"}
    >
      <FormField fieldName="title" value={title} />
      <FormField fieldName="description" value={description} />
      <p class="text-red-500 p-2 text-center" id={editHabitErrorMessageId} />
      <div class={"flex items-center justify-center gap-x-8"}>
        <SecondaryButton
          text="Cancel"
          x-on:click={`$refs["${modalRef}"].remove();`}
          type="button"
        />
        <PrimaryButton class="hover:text-sky-700" type="submit" text="Submit" />
      </div>
    </form>
  );
}

export function CreateHabitButton() {
  return (
    <PrimaryButton
      class={
        "p-4 text-center border rounded-xl hover:bg-slate-300 hover:text-slate-700 w-full md:w-3/4 mx-auto text-3xl flex gap-x-4 items-center justify-center"
      }
      x-on:click="showForm = true"
    >
      <span>Add Habit</span>
      <span
        class={
          "p-2 h-12 w-12 flex items-center justify-center rounded-full border"
        }
      >
        +
      </span>
    </PrimaryButton>
  );
}

export function CreateHabitComponent() {
  return (
    <div x-data="{ showForm: false }">
      <div x-show="!showForm">
        <CreateHabitButton />
      </div>
      <div x-show="showForm">
        <CreateHabitForm />
      </div>
    </div>
  );
}

export function HabitComponent({ item }: { item: Habit }) {
  const habitHistories = "habit-histories-" + item.id;
  return (
    <section
      class={
        "rounded-md border border-slate-300 p-5 flex flex-col gap-y-4 max-w-xl"
      }
      // hx-get={`/api/habits/${item.id}/histories`}
      // hx-trigger="load"
      // hx-target={`#${habitHistories}`}
      // hx-swap="outerHTML"
    >
      <h2 class={"text-xl font-medium"} safe>
        {item.title}
      </h2>
      <p class={"text-md text-slate-400"} safe>
        {item.description}
      </p>
      {/* <div id={habitHistories} /> */}
      <HabitHistoryList habit={item} />
      <div class={"flex gap-x-4"}>
        <InfoButton
          class={
            "px-3 py-2 rounded border text-sky-600 hover:bg-sky-600 hover:text-white"
          }
          text="Edit"
          variant="solid"
          hx-get={`/api/habits/${item.id}/edit`}
          hx-target="body"
          hx-swap="afterbegin"
          hx-vals={JSON.stringify({
            title: item.title,
            description: item.description,
            color: item.color,
          })}
        />
        <DangerButton
          class={
            "px-3 py-2 rounded border text-red-600 hover:bg-red-600 hover:text-white"
          }
          text="Delete"
          variant="solid"
          hx-delete={`/api/habits/${item.id}`}
          hx-swap="afterbegin"
          hx-target="#notification-list"
          hx-confirm="Are you sure ?"
          x-init={`
            $el.addEventListener("htmx:afterRequest", ({ detail }) => {
              if (detail.xhr.status === 200) {
                document.querySelector("#habit-item-${item.id}").remove();
              }
            })
          `}
        />
      </div>
    </section>
  );
}

export function HabitItem({
  item,
  triggerNotification,
}: {
  item: Habit;
  triggerNotification?: Notification;
}) {
  return (
    <li
      id={`habit-item-${item.id}`}
      x-data={`
        {
          triggerNotification: ${
            triggerNotification ? JSON.stringify(triggerNotification) : null
          },
          init() {
            if (this.triggerNotification) {
              htmx.ajax('POST', '/api/notifications', { target: '#notification-list', swap: 'afterbegin', values: this.triggerNotification });
            }
          }
        }
      `}
    >
      <HabitComponent item={item} />
    </li>
  );
}

export function Habits({ habits }: HabitsProps) {
  const className = habits?.length
    ? "grid grid-cols-1 md:grid-cols-2 gap-5 p-4 mx-auto border"
    : "";
  return (
    <ul
      id={"habit-list"}
      class={className}
      hx-get="/api/habits"
      hx-trigger="load-habits from:body"
      hx-target="this"
      hx-swap="outerHTML"
    >
      {habits?.length ? (
        habits.map((habit) => <HabitItem item={habit} />)
      ) : (
        <li class={"p-2 w-full md:w-2/3 xl:w-1/2 mx-auto"}>
          <p class={"py-4 text-xl"}>
            You don't have any habits yet. Click to "Add Habit" button above to
            create one
          </p>
          <p class={"text-lg"}>
            <span>Do you want some samples ?</span>
            <SecondaryButton
              hx-post="/api/habits/samples"
              hx-target="#habit-list"
              hx-swap="outerHTML"
              text="Click here"
            />
          </p>
        </li>
      )}
    </ul>
  );
}

export function HabitHistoryItem({
  habit,
  date,
  completed,
}: {
  habit: Habit;
  date: string;
  completed: boolean;
}) {
  return (
    <li
      class={`w-5 h-5 rounded cursor-pointer ${
        completed ? `bg-[${habit.color}]` : "bg-black"
      }`}
      title={date}
      hx-post={`/api/habits/${habit.id}/toggle/${date}`}
      hx-target="this"
      hx-swap="outerHTML"
    />
  );
}

export function HabitHistoryList({
  habit,
}: {
  habit: Habit;
}) {
  const dates = generateDatesByNumberOfDays(90);
  return (
    <ul class={"flex gap-1 flex-wrap"}>
      {dates.map((date) => {
        const formatedDate = date.toISOString().slice(0, 10);
        return (
          <HabitHistoryItem
            habit={habit}
            date={formatedDate}
            completed={!!habit.histories?.some(
              (history) => history.date === formatedDate
            )}
          />
        );
      })}
    </ul>
  );
}
