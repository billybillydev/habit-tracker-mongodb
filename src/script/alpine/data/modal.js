/**
 * Type for HabitListData function
 * @typedef {Object} ModalData
 * @property {Function} closeModal
 * @property {Object.<string, Function>} removerEscape
 * @property {Object.<string, Function>} removerClick
 */

/**
 *
 * @param {string} ref The modal's alpine reference
 * @returns {import("alpinejs").AlpineComponent<ModalData>} Data object returned by the function
 */
export function modalData(ref) {
  return {
    closeModal() {
      this.$refs[ref].remove();
    },
    removerEscape: {
      ["@keyup.escape.window"]() {
        this.closeModal();
      },
    },
    removerClick: {
      ["@click"]() {
        this.closeModal();
      },
    },
  };
}
