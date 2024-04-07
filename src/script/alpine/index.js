import { notificationData } from "./data/notification.js";
import { modalData } from "./data/modal.js";
import { seoData } from "./data/seo.js";
import Alpine from "alpinejs";
import manage from 'alpinejs-manage';

Alpine.data("seo", seoData);
Alpine.data("modal", modalData);
Alpine.data("notification", notificationData);

Alpine.plugin(manage);

export default Alpine;