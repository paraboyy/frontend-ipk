import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import TambahDataView from "../views/TambahDataView.vue";
import WelcomeView from "../views/WelcomeView.vue";
import KrsView from "../views/KrsView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/welcome",
      name: "welcome",
      component: HomeView,
    },
    {
      path: "/tambahdata",
      name: "tambahdata",
      component: TambahDataView,
    },
    {
      path: "/",
      name: "home",
      component: WelcomeView,
    },
    {
      path: "/krs/:nim",
      name: "krs",
      component: KrsView,
      props: true,
    },
  ],
});

export default router;
