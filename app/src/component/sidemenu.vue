<template>
    <div id="sidemenu">
        <div id="side-top">
            <p>MarkNote</p>
            <hy-input id="search-input" v-model="search_str" class="none" placeholder="Search Note" @enter="searchNote"></hy-input>
        </div>
        <div id="menus">
            <div class="menu_item" v-for="(label, index) in menus">
                <div class="menu_label" @click="clickLabel(index)" v-bind:class="{label_opened: label.open}" >
                    <div>
                       <p v-if="label.open">-</p>
                        <p v-else >+</p>
                        <p>{{ label.name }}</p>
                    </div>
                    <img class="delete" src="../../static/delete.svg" @click.stop="deleteLabel(label.name)" />
                </div>
                <div class="menu_note" v-if="label.open">
                    <p v-for="note_title in label.notes" @click="clickNote(note_title)">{{ note_title }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data: function () {
            return {
                menus: [],
                search_str: ""
            };
        },
        beforeMount: function () {
            this.getMenus();
        },
        mounted: function () {
            this.$bus.$on("refresh_menu", () => {
                this.getMenus();
            })
        },
        methods: {
            getMenus: function () {
                const api = this.$store.state.api.menus;
                this.$axios.get(api).then( (response) => {
                    this.menus = response.data;
                })
            },
            clickLabel: function (index) {
                this.menus[index].open = !this.menus[index].open;
            },
            clickNote: function (note_title) {
                const note_url = `/note/${note_title}`;
                this.$router.push({"path": note_url});
            },
            searchNote: function () {
                this.$router.push({path: "/search", query: {search_str: this.search_str}});
            },
            deleteLabel: function (label_name) {
                const api = this.$store.state.api.labels;
                this.$axios.delete(api, {params: {label_name: label_name}})
                    .then( (response) => {
                        this.$flash(response.data.status, "success");
                        this.$bus.$emit("refresh_menu");
                        this.$bus.$emit("refresh_note");
                    })
            }
        }
    };
</script>

<style lang="less">
    #sidemenu {
        flex-basis: 20%;
        display: flex;
        flex-direction: column;
        height: 100%;

        #side-top {
            flex-basis: 20%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-around;
            background-color: #2980B9;
            color: #fff;
        }

        #menus::-webkit-scrollbar {
            display: none;
        }

        #menus {
            height: 100%;
            background-color: #343131;
            color: #B3B3B3;
            overflow: auto;

            .menu_item {
                margin: 5px auto;
            }

            .menu_label {
                display: flex;
                cursor: pointer;
                padding-left: 20px;
                align-items: center;

                div {
                    flex-grow: 1;
                    display: flex;

                    p {
                        padding: 5px 0 5px 5px;
                    }
                }

                .delete {
                    margin-right: 20px;
                    width: 18px;
                    height: 18px;
                }
            }

            .label_opened {
                background-color: #fff;
                color: #000;
                border-bottom: 1px solid #C3C3C3;
            }

            .menu_note {
                cursor: pointer;
                padding-left: 40px;
                background-color: #E3E3E3;

                 p {
                     padding: 5px 0;
                     color: #808083;
                     border-bottom: 1px solid #fff;
                 }
            }
        }
    }
</style>
