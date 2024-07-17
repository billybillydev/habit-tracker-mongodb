/**
 * Type for HabitItemData function
 * @typedef {Object} HabitItemData
 * @property {import("$components/notifications.component").Notification} [xNotification]
 * @property {string} tooltipInformation
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
 * @param {Object} props
 * @param {string} props.tooltipInformation
 * @param {string} props.itemId
 * @param {import("$components/notifications.component").Notification} [props.xNotification]
 * @return {import("alpinejs").AlpineComponent<HabitItemData>}
 */
export function habitItemData({itemId, tooltipInformation, xNotification}) {
  return {
    itemId,
    xNotification,
    tooltipInformation,
    init() {
      if (this.xNotification) {
        this.$notify(this.xNotification);
      }
    },
    addItemToSet() {
      this.itemIdsToDelete.add(this.itemId);
    },
    deleteItemFromSet() {
      this.itemIdsToDelete.delete(this.itemId);
    },
    updateTitle(text) {
      this.tooltipInformation = text;
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
