/**
 * Type for HabitListData function
 * @typedef {Object} HabitListData
 * @property {Set<number>} itemIdsToDelete
 * @property {Function} handleEvent
 * @property {Record<string, Function>} selectAllEvent
 */

/**
 * Alpine Data Function for HabitList Component
 * @return {import("alpinejs").AlpineComponent<HabitListData>}
 */
export function habitListData() {
  return {
    init() {
      this.$watch("itemIdsToDelete", (value) => {
        console.log(value.size);
      });
    },
    itemIdsToDelete: new Set([]),
    /**
     * Handles custom event from $dispatch
     * @param {CustomEvent} event
     * @return {void}
     */
    handleEvent(event) {
      const items = document.querySelectorAll("#habit-list>li");
      if (event.detail?.selectedAll) {
        this.itemIdsToDelete = new Set(
          Array.from(items).map((item) => Number(item.id.split("-")[1]))
        );
      } else {
        this.itemIdsToDelete.clear();
      }
    },
    selectAllEvent: {
      /**
       * Handles select-all event
       * @param {CustomEvent} event
       * @return {void}
       */
      ["@select-all.window"](event) {
        this.handleEvent(event);
      },
    },
  };
}