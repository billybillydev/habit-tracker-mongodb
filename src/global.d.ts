import { Alpine as AlpineType } from "alpinejs";
import * as Htmx from 'htmx.org'

declare global {
  var Alpine: AlpineType;
  var htmx: typeof Htmx;

  interface Window {
    Alpine: AlpineType;
    htmx: typeof Htmx;
  }
}
