/**
 * Type for SeoData function
 * @typedef {Object} SeoData
 * @property {string} title The page title
 */

/**
 * Alpine Data Function for Seo Component
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