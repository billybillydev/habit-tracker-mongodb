import {
  NotificationItem,
  NotificationList,
  notificationListId,
} from "$components/notifications.component";

/**
 * @typedef NotifyMagic
 * @type {(notificationData: import("$components/notifications.component").Notification) => void}
 */

/**
 * @returns {NotifyMagic}
 */
export function notificationMagic() {
  return (notificationData) => {
    const notificationListElement = document.getElementById(notificationListId);
    if (!notificationListElement) {
      const bodyElement = document.body;
      if (!notificationListElement) {
        console.error("Body was not found");
        return;
      }
      
      bodyElement.insertAdjacentHTML(
        "afterbegin",
        <NotificationList>
          <NotificationItem {...notificationData} />
        </NotificationList>
      );
      return;
    }
    notificationListElement.insertAdjacentHTML(
      "afterbegin",
      <NotificationItem {...notificationData} />
    );
  };
}
