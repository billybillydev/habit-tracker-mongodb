import { seoData, modalData, notificationData, habitItemData, habitListData } from "$alpine/data";
import { notificationMagic } from "$alpine/magic";
import Alpine from "alpinejs";
import manage from 'alpinejs-manage';

/* Data */
Alpine.data("seo", seoData);
Alpine.data("modal", modalData);
Alpine.data("notification", notificationData);
Alpine.data("habitItem", habitItemData);
Alpine.data("habitList", habitListData);

/* Magic */
Alpine.magic("notify", notificationMagic);

Alpine.plugin(manage);

export default Alpine;