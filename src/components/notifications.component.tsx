import { PropsWithChildren } from "hono/jsx";

export type Notification = {
  type: "success" | "error" | "info" | "warning";
  message: string;
  duration?: number;
};

export function NotificationItem({
  type,
  message,
  duration = 10000,
}: Notification) {
  let colorTypeClasses = "";

  switch (type) {
    case "error":
      colorTypeClasses = "border-2 border-red-400 text-red-400";
      break;
    case "success":
      colorTypeClasses = "border-2 border-green-400 text-green-400";
      break;
    case "warning":
      colorTypeClasses = "border-2 border-yellow-400 text-yellow-400";
      break;
    case "info":
    default:
      colorTypeClasses = "border-2 border-sky-400 text-sky-400";
      break;
  }
  return (
    <li
      x-data={`notification(${duration})`}
      x-ref="notificationItem"
      x-bind="hover"
      class={[
        `bg-zinc-800 rounded p-2 min-w-xl flex first:mt-2 last:mb-2 mx-2`,
        ,
        colorTypeClasses,
      ].join(" ")}
    >
      <p class={"grow"}>{message}</p>
      <div class={"flex px-2 justify-end items-start"}>
        <button x-bind="closerClick" class={"p-1 rounded-full"}>
          x
        </button>
      </div>
    </li>
  );
}

export const notificationListId = "notification-list";

export function NotificationList({ children }: PropsWithChildren) {
  return (
    <ul
      id={notificationListId}
      class={
        "fixed overflow-auto grid grid-cols-1 gap-y-4 top-0 left-0 max-h-screen w-1/2 md:w-1/3 xl:w-1/4"
      }
      x-init={`
        const mutationObserverConfig = { childList: true };
        const mutationObserverCallback = (mutationList) => {
          for (mutation of mutationList) {
            switch(mutation.type) {
              case "childList":
                if ($el.children.length === 0) {
                  $el.remove();
                }
                break;
              default:
                console.warn("mutation doesn't have a key 'type'");
                break;
            }
          }
        }
        const observer = new MutationObserver(mutationObserverCallback);
        observer.observe($el, mutationObserverConfig);
      `}
    >
      {children}
    </ul>
  );
}
