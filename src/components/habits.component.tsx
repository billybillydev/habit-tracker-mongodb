import {
  SecondaryButton,
  PrimaryButton,
  InfoButton,
  DangerButton,
} from "$components/buttons.component";
import { FormField } from "$components/fields.component";
import { Notification } from "$components/notifications.component";
import { LimitPaginationRadio } from "$components/pagination.component";
import { Habit } from "$db/schema";
import { generateDatesByNumberOfDays } from "$lib";
import classNames from "classnames";

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
      hx-target-4xx={`#${createHabitErrorMessageId}`}
      hx-target-5xx={`#${createHabitErrorMessageId}`}
      x-ref={createHabitFormRef}
      x-init={`
        $el.addEventListener('htmx:afterRequest', (event) => {
          if(event.detail.xhr.status === 201){
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

export type EditHabitProps = {
  id: Habit["id"];
  title: Habit["title"];
  description: Habit["description"];
  modalRef: string;
};
export function EditHabitForm({
  title,
  description,
  id,
  modalRef,
}: EditHabitProps) {
  const editHabitErrorMessageId = "edit-habit-error";
  return (
    <form
      hx-put={"/api/habits/" + id}
      hx-target={`#habit-${id}`}
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

export function HabitComponent({
  item,
  class: className,
}: {
  item: Habit;
  class?: string;
}) {
  return (
    <section
      class={classNames(
        "h-full rounded-md border border-slate-300 p-5 flex flex-col gap-y-4 max-w-xl &>p:text-slate-400",
        className
      )}
      x-bind:class={`{ "bg-red-700": itemIdsToDelete.has(${item.id}) }`}
    >
      <h2 class={"text-xl font-medium"}>{item.title}</h2>
      <p class={"text-md"}>{item.description}</p>
      <HabitHistoryList habit={item} />
      <template x-if={`!itemIdsToDelete.has(${item.id})`}>
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
          />
        </div>
      </template>
    </section>
  );
}

export function HabitItem({
  item,
  triggerNotification,
  class: className,
  ...restProps
}: {
  item: Habit;
  triggerNotification?: Notification;
  class?: string;
}) {
  return (
    <li
      id={`habit-${item.id}`}
      x-bind:title={"title"}
      x-data={`
        habitItem(
          ${item.id},
          "double click on this block to switch on deletion mode",
          ${
            triggerNotification
              ? JSON.stringify(triggerNotification)
              : undefined
          }
        )
      `}
      x-bind="doubleClick"
      {...restProps}
    >
      <HabitComponent item={item} class={className} />
    </li>
  );
}

export function HabitList({ habits }: HabitsProps) {
  const className = habits?.length
    ? "grid grid-cols-1 md:grid-cols-2 gap-5 p-4 border"
    : "";
  return (
    <ul
      id="habit-list"
      x-ref="habit-list"
      x-model="itemIdsToDelete"
      class={className}
      x-data="habitList()"
      x-bind="selectAllEvent"
    >
      {habits.length ? (
        habits.map((habit) => <HabitItem item={habit} />)
      ) : (
        <li>
          <p class="text-center">No habits found</p>
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
      class={`w-5 h-5 rounded cursor-pointer`}
      style={`background-color: ${completed ? habit.color : "black"}`}
      title={date}
      hx-post={`/api/habits/${habit.id}/toggle/${date}`}
      hx-target="this"
      hx-swap="outerHTML"
    />
  );
}

export function HabitHistoryList({ habit }: { habit: Habit }) {
  const dates = generateDatesByNumberOfDays(90);
  return (
    <ul class={"flex gap-1 flex-wrap"}>
      {dates.map((date) => {
        const formatedDate = date.toISOString().slice(0, 10);
        return (
          <HabitHistoryItem
            habit={habit}
            date={formatedDate}
            completed={
              !!habit.histories?.some(
                (history) => history.date === formatedDate
              )
            }
          />
        );
      })}
    </ul>
  );
}

export function HabitsMoreButton({
  habitLength,
  count,
}: {
  habitLength: number;
  count: number;
}) {
  return (
    <form
      name="more-habits"
      class="mx-auto pb-4"
      id="more-habits"
      hx-get="/api/habits/more"
      hx-target="#habit-list"
      hx-swap="beforeend show:bottom"
      hx-select-oob="#more-habits"
      x-data={`{ disableButton: false }`}
      {...{
        "@bulk-mode": "disableButton = $event.detail?.nbItemsToDelete > 0;",
      }}
    >
      <p>
        Viewing {habitLength} of {count}
      </p>
      {habitLength < count && (
        <SecondaryButton x-bind:disabled={`disableButton`} text="See more" />
      )}
    </form>
  );
}

export function HabitsBulkDeletion() {
  return (
    <div
      x-data={`{ nbItemsToDelete: 0 }`}
      id="bulk"
      class="w-full flex items-center justify-center gap-x-12"
      x-init={`
        $watch("nbItemsToDelete", async (value) => {
          if (value === 0) {
            document.querySelector("#bulk").remove();
            $manage("#habit-list").itemIdsToDelete.clear();
          }
        })
      `}
      x-effect={`
        nbItemsToDelete = $manage("#habit-list").itemIdsToDelete.size;
        $dispatch("bulk-mode", { nbItemsToDelete })
      `}
    >
      <PrimaryButton
        x-data={`{ text: "Select All" }`}
        x-text="text"
        x-on:click={`
          items = document.querySelectorAll("#habit-list>li");
          if (nbItemsToDelete === items.length) {
            text = "Select All";
            nbItemsToDelete = 0;
            $dispatch("select-all", { selectedAll: false });
          } else {
            text = "Deselect All";
            nbItemsToDelete = items.length;
            $dispatch("select-all", { selectedAll: true });
          }
        `}
      />
      <DangerButton
        variant="solid"
        class="flex items-center gap-x-2"
        x-init={`
          items = Array.from($manage("#habit-list").itemIdsToDelete);
        `}
        x-on:click={`
          items = Array.from($manage("#habit-list").itemIdsToDelete);
          if (window.confirm("Are you sure to delete these " + nbItemsToDelete + " items ?")) {
            htmx.ajax("DELETE", "/api/habits/bulk?" + items.map((item) => "items=" + item).join("&"), { target: "#notification-list", swap: "afterbegin" });
          }
        `}
      >
        <span>Delete</span>
        <span
          class="px-3 py-1 rounded-full border border-current"
          x-text="nbItemsToDelete"
        />
      </DangerButton>
    </div>
  );
}

export function HabitContainer({
  count,
  limit,
  searchValue,
  habits,
}: {
  limit: number;
  count: number;
  searchValue?: string;
  habits: Habit[];
}) {
  return (
    <div
      id="habit-container"
      class="flex flex-col items-center justify-center gap-y-3"
      hx-get="/api/habits"
      hx-trigger="load-habits from:body"
      hx-target="this"
      hx-swap="outerHTML"
    >
      <div
        class={"mx-auto flex gap-x-3 items-center w-full px-2 md:px-6 xl:px-12"}
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
            hx-select-oob="#more-habits, #limit-radio"
            value={searchValue}
          />
        </div>
        <div class="px-3">
          <a title="for not found purpose" href="/settings">
            Settings
          </a>
        </div>
      </div>
      <LimitPaginationRadio limit={limit} count={count} />
      <HabitList habits={habits} />
      <HabitsMoreButton habitLength={habits.length} count={count} />
    </div>
  );
}

export function NoHabits() {
  return (
    <div id="no-habit" class={"p-2 w-full md:w-2/3 xl:w-1/2 mx-auto"}>
      <p class={"py-4 text-xl"}>
        You don't have any habits yet. Click to "Add Habit" button above to
        create one
      </p>
      <p class={"text-lg"}>
        <span>Do you want some samples ?</span>
        <SecondaryButton
          hx-post="/api/habits/samples"
          hx-target="#no-habit"
          hx-swap="outerHTML"
          text="Click here"
        />
      </p>
    </div>
  );
}
