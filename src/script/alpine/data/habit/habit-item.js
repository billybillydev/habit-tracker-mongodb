/**
 * Type for HabitItemData function
 * @typedef {Object} HabitItemData
 * @property {import("$components/notifications.component").Notification} [triggerNotification]
 * @property {string} title
 * @property {string} itemId
 * @property {Function} addItemToSet
 * @property {Function} deleteItemFromSet
 * @property {(text: string) => void} updateTitle
 * @property {Function} manageItemInSet
 * @property {Function} handleDoubleClick
 * @property {Function} toggleBulkElement
 * @property {Record<string, Function>} doubleClick
 */

/**
 * @param {string} title
 * @param {string} itemId
 * @param {import("$components/notifications.component").Notification} [triggerNotification]
 * @return {import("alpinejs").AlpineComponent<HabitItemData>}
 */
export function habitItemData(itemId, title, triggerNotification) {
  return {
    itemId,
    triggerNotification,
    title,
    init() {
      if (this.triggerNotification) {
        htmx.ajax("POST", "/api/notifications", {
          target: "#notification-list",
          swap: "afterbegin",
          values: this.triggerNotification,
        });
      }
    },
    addItemToSet() {
      this.itemIdsToDelete.add(this.itemId);
    },
    deleteItemFromSet() {
      this.itemIdsToDelete.delete(this.itemId);
    },
    updateTitle(text) {
      this.title = text;
    },
    manageItemInSet() {
      if (this.itemIdsToDelete.has(this.itemId)) {
        this.updateTitle("double click on this block to switch on normal mode");
        this.deleteItemFromSet(this.itemId);
      } else {
        this.updateTitle(
          "double click on this block to switch on deletion mode"
        );
        this.addItemToSet(this.itemId);
      }
    },
    toggleBulkElement() {
      const bulkElement = document.querySelector("#bulk");
      if (bulkElement) {
        if (this.itemIdsToDelete.size === 1) {
          bulkElement.remove();
        }
      } else {
        htmx.ajax("GET", "/api/habits/bulk", {
          target: "#habit-list",
          swap: "beforebegin",
        });
      }
    },
    handleDoubleClick() {
      this.manageItemInSet();
      this.toggleBulkElement();
    },
    doubleClick: {
      ["@dblclick"]() {
        this.handleDoubleClick();
      },
    },
  };
}
