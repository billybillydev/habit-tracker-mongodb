import {
  SecondaryButton,
  PrimaryButton,
  InfoButton,
  DangerButton,
} from "$components/buttons.component";
import { FormField } from "$components/fields.component";
import { Notification } from "$components/notifications.component";
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
            x-init={`
            $el.addEventListener("htmx:afterRequest", ({ detail }) => {
              console.log(detail.xhr.status);
              if (detail.xhr.status === 200) {
                document.querySelector("#habit-item-${item.id}").remove();
              }
            })
          `}
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
}: {
  item: Habit;
  triggerNotification?: Notification;
  class?: string;
}) {
  return (
    <li
      id={String(item.id)}
      x-bind:title={"title"}
      x-data={`
        {
          triggerNotification: ${
            triggerNotification ? JSON.stringify(triggerNotification) : null
          },
          title: "double click on this block to switch on deletion mode",
          init() {
            if (this.triggerNotification) {
              htmx.ajax('POST', '/api/notifications', { target: '#notification-list', swap: 'afterbegin', values: this.triggerNotification });
            }
          }
        }
      `}
      x-on:dblclick={`
        if (itemIdsToDelete.has(${item.id})) {
          title = "double click on this block to switch on deletion mode";
          itemIdsToDelete.delete(${item.id});
        } else {
          title = "double click on this block to switch on normal mode";
          itemIdsToDelete.add(${item.id});
        }
        if (document.querySelector("#bulk") && itemIdsToDelete.size === 1) {
          document.querySelector("#bulk").remove();
        } else if (!document.querySelector("#bulk")) {
          htmx.ajax('GET', '/api/habits/bulk', { target: '#habit-list', swap: 'beforebegin' })
        }
      `}
    >
      <HabitComponent item={item} class={className} />
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
      x-data={`{
        itemIdsToDelete: new Set([])
      }`}
      x-init={`
        window.addEventListener("select-all", ({ detail }) => {
          items = document.querySelectorAll("#habit-list>li");
          if (detail?.selectedAll) {
            itemIdsToDelete = new Set(Array.from(items).map(item => Number(item.id)));
          } else {
            itemIdsToDelete.clear();
          }
        });
      `}
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
  offset,
  limit,
  count,
  search = "",
}: {
  habitLength: number;
  limit: number;
  offset: number;
  count: number;
  search?: string;
}) {
  const newOffset = offset + limit;
  const hxQuery: { offset: number; search?: string } = { offset: newOffset };
  if (search) {
    hxQuery.search = search;
  }
  return (
    <form
      name="more-habits"
      class="mx-auto pb-4"
      id="more-habits"
      hx-get="/api/habits/more"
      hx-vals={JSON.stringify(hxQuery)}
      hx-target="#habit-list"
      hx-swap="beforeend show:bottom"
      hx-select-oob="#more-habits"
      x-data={`{ disableButton: false }`}
      x-init={`
        window.addEventListener("bulk-mode", ({ detail }) => {
          disableButton = detail?.nbItemsToDelete > 0;
        })
      `}
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
      <DangerButton variant="solid" class="flex items-center gap-x-2">
        <span>Delete</span>
        <span
          class="px-3 py-1 rounded-full border border-current"
          x-text="nbItemsToDelete"
        />
      </DangerButton>
    </div>
  );
}
