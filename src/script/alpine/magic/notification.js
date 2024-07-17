import { NotificationItem, notificationListId } from "$components/notifications.component";

/**
 * @typedef NotifyMagic
 * @type {(notificationData: import("$components/notifications.component").Notification) => void}
 */

/**
 * @returns {NotifyMagic}
 */
export function notificationMagic() {
    return (notificationData) => {
        const notificationListElement =
          document.getElementById(notificationListId);
        if (!notificationListElement) {
            console.warn(`Element with id ${notificationListId} not found`);
            return;
        }
        notificationListElement.insertAdjacentHTML(
          "afterbegin",
          <NotificationItem {...notificationData} />
        );
    }
}