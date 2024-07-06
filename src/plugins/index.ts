import vuetify from './vuetify'
import type { App } from 'vue'
import Toast, { PluginOptions } from "vue-toastification";
import "vue-toastification/dist/index.css";
import { store } from '@/lib/vuex/store';

const toastOptions: PluginOptions = {
  draggable: true,
  closeOnClick: true,
  maxToasts: 10,
  newestOnTop: true,
  pauseOnHover: true
};

export function registerPlugins (app: App) {
  app
    .use(vuetify)
    .use(Toast, toastOptions)
    .use(store)
}
