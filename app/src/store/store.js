import Vuex from "../../../node_modules/vuex/dist/vuex";
import Vue from "../../../node_modules/vue/dist/vue";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        api: {
            menus: "http://127.0.0.1:8000/api/marknote/menus",
            notes: "http://127.0.0.1:8000/api/marknote/notes",
            labels: "http://127.0.0.1:8000/api/marknote/labels"
        }
    }
});
