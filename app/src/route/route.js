import note from "../component/note.vue";
import notfound from "../component/notfound.vue";
import search from "../component/search.vue";

export default [
    {
        path: "/",
        component: note
    },
    {
        path: "/note/:note_title",
        component: note
    },
    {
        path: "/search",
        component: search
    },
    {
        path: "*",
        component: notfound
    }
];
