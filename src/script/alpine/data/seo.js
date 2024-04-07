/**
 * @typedef {Object} SeoData
 * @property {string} title The page title
 */

/**
 * 
 * @param {string} title The page title
 * @returns {import("alpinejs").AlpineComponent<SeoData>} Data object returned by the function
 */
export function seoData(title) {
    return {
        init() {
            if (document.title !== title) {
              document.title = title;
            }
            console.log(htmx);
        },
        title,
    }
}