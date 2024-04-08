import { seoData, modalData, notificationData, habitItemData, habitListData } from "./data";
import Alpine from "alpinejs";
import manage from 'alpinejs-manage';

Alpine.data("seo", seoData);
Alpine.data("modal", modalData);
Alpine.data("notification", notificationData);
Alpine.data("habitItem", habitItemData);
Alpine.data("habitList", habitListData);

Alpine.plugin(manage);

export default Alpine;