/**
 * @typedef {Object} NotificationData
 * @property {number} duration Duration of the showed notification
 * @property {Timer | number} timeout
 * @property {Function} resetTimeout
 * @property {Function} close
 * @property {Object.<string, Function>} closerClick
 * @property {Object.<string, Function>} hover
 */

/**
 *
 * @param {number} duration Duration of the showed notification
 * @returns {import("alpinejs").AlpineComponent<NotificationData>} Data object returned by the function
 */
export function notificationData(duration = 10000) {
  return {
    duration,
    timeout: 0,
    resetTimeout() {
      clearTimeout(this.timeout);
      this.timeout = 0;
    },
    close() {
      this.resetTimeout();
      this.$refs.notificationItem.remove();
    },
    closerClick: {
      ["@click"]() {
        this.close();
      },
    },
    hover: {
      ["@mouseenter"]() {
        if (this.timeout) {
          this.resetTimeout();
        }
      },
    },
    init() {
      this.timeout = setTimeout(() => this.close(), this.duration);
    },
  };
}
