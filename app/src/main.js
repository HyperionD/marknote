import Vue from "../../node_modules/vue/dist/vue";
import VueRouter from "../../node_modules/vue-router/dist/vue-router.js";
import index from "./component/index.vue";
import routes from "./route/route.js";
import store from "./store/store";
import axios from "../../node_modules/axios/dist/axios.min";

import hyComponents from "../../node_modules/hy-components/index";

const bus = new Vue();

Object.defineProperty(Vue.prototype, "$axios", { value: axios });
Object.defineProperty(Vue.prototype, "$bus", { value: bus });

Vue.use(VueRouter);
Vue.use(hyComponents.hyFlash);
Vue.use(hyComponents.hyInput);
Vue.use(hyComponents.hyContextMenu);

const router = new VueRouter({
    // mode: "history",
    routes: routes
});

new Vue({
    el: "#app",
    template: "<index />",
    components: {index},
    router,
    store
});
