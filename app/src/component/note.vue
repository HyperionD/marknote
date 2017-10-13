<template>
    <div id="note">
        <hy-flash></hy-flash>
        <hy-contextmenu :el="menuTarget" class="context_menu">
            <p @click="save">保存</p>
            <p @click="newNote">新建</p>
            <p @click="editMode">编辑模式</p>
            <p @click="previewMode">浏览模式</p>
            <p @click="columnMode">分栏模式</p>
            <p @click="deleteNote">删除笔记</p>
        </hy-contextmenu>
        <div id="toolbar">
            <div id="label">
                <div class="label-item" v-for="label in note_labels">{{ label }}</div>
                <hy-input inputType="datalist" :datalist="all_labels" @enter="save"
                          v-model="label_name" v-on:click="getAllLabels" placeholder="输入标签"></hy-input>
            </div>
            <div id="func">
                <p>{{ note_datetime }}</p>
            </div>
        </div>
        <div id="show">
            <textarea id="edit" placeholder="# 输入标题" v-bind:value="note_content" @input="update" v-if="isShowEdit"></textarea>
            <div id="preview" class="markdown-body" v-html="toHTML" v-if="isShowPreview"></div>
        </div>
    </div>
</template>

<script>
    import debonce from "../../../node_modules/lodash/debounce";
    import showdown from "../../../node_modules/showdown/dist/showdown.min";
    import mytime from "../utils/time";

    export default {
        data: function () {
            return {
                note_content: "",
                note_labels: [],
                note_datetime: "",
                all_labels: [],
                isShowEdit: true,
                isShowPreview: false,
                label_name: "",
                menuTarget: null
            };
        },
        watch: {
            $route: function () {
                this.openNote();
            }
        },
        beforeMount: function () {
            this.openNote();
            this.getAllLabels();
        },
        mounted: function () {
            this.menuTarget = document.querySelector("#note");
            this.$bus.$on("refresh_note", () => {
                this.openNote();
            });
        },
        computed: {
            toHTML: function () {
                const converter = new showdown.Converter();
                converter.setOption('tables', true);
                const text = this.note_content;
                const html = converter.makeHtml(text);
                return html;
            },
            getTitle: function () {
                const title_line_reg = /^#[^#].*$/gm;
                const title_reg = /[^#\s]{1}.*/g;
                const match_line = this.note_content.match(title_line_reg);
                let note_title = "";
                if (match_line !== null) {
                    const title_line = match_line[0];
                    const match_title = title_line.match(title_reg);
                    if (match_title !== null) {
                        note_title = match_title[0]
                    }
                }
                return note_title;
            }
        },
        methods: {
            update: debonce(function (e) {
                this.note_content = e.target.value
            }, 300),
            openNote: function () {
                let note_title = this.$route.params.note_title;
                const api = this.$store.state.api.notes;
                if (note_title === undefined) {
                    note_title = ""
                }
                this.$axios.get(api, {params: {note_title: note_title}})
                        .then((response) => {
                            this.note_content = response.data.content;
                            this.note_labels = response.data.labels;
                            this.note_datetime = response.data.datetime;
//                            console.log(response.data);
                        });
            },
            newNote: function () {
                this.$router.push("/");
            },
            editMode: function () {
                this.isShowEdit = true;
                this.isShowPreview = false;
            },
            previewMode: function () {
                this.isShowEdit = false;
                this.isShowPreview = true;
            },
            columnMode: function () {
                this.isShowEdit = true;
                this.isShowPreview = true;
            },
            getAllLabels: function () {
                const api = this.$store.state.api.labels;
                this.$axios.get(api).then( (response) => {
                    this.all_labels = response.data;
                });
            },
            save: function () {
                const note_api = this.$store.state.api.notes;
                const label_api = this.$store.state.api.labels;
                const note_title = this.getTitle;
                const label_name = this.label_name;
                const now = mytime.init();
                const note_datetime = `${now.formatDate()} ${now.formatTime()}`;
                const note_post = {
                    title: note_title,
                    content: this.note_content,
                    datetime: note_datetime
                };
                const label_post = {
                    label_name: label_name,
                    note_title: note_title
                };
                if (note_title !== "") {
                    this.$axios.post(note_api, note_post).then( (note_response) => {
                        if (note_response.data.status !== "笔记内容相同") {
                            this.$flash(note_response.data.status, "success");
                        }
//                        console.log(note_response.data.status);
                        return this.$axios.post(label_api, label_post);
                    }).then( (label_response) => {
                        if (label_response.data.status !== "") {
                            this.$flash(label_response.data.status, "success");
                        }
//                        console.log(label_response.data.status);
                        this.$bus.$emit("refresh_menu");
                        const note_url = `/note/${note_title}`;
                        this.$router.push({"path": note_url});
                        this.openNote();
                        this.label_name = "";
                    }).catch( (error) => {
                        console.log(error);
                    })
                }
            },
            deleteNote: function () {
                const api = this.$store.state.api.notes;
                const note_title = this.getTitle;
                if (note_title !== "") {
                    this.$axios.delete(api, {params: {note_title: note_title}})
                    .then( (response) => {
                        this.$flash(response.data.status, "success");
                        this.$bus.$emit("refresh_menu");
                        this.newNote();
                    })
                }
            }
        }
    };
</script>

<style lang="less">
    #note {
        display: flex;
        width: 100%;
        flex-direction: column;
        align-items: center;

        .context_menu {
            p {
                padding: 5px 0;
            }
        }

        #toolbar {
            display: flex;
            align-items: center;
            width: 100%;
            margin-bottom: 5px;

            #label {
                flex-grow: 1;
                display: flex;
                padding: 5px 10px;
                margin-top: 10px;
                flex-wrap: wrap;

                .label-item {
                    margin-right: 10px;
                    font-size: xx-small;
                    padding: 5px 5px;
                    border-radius: 15px;
                    border: 1px solid #e1e4e5;
                    color: #3091d1;
                }
            }

            #func {
                padding-right: 20px;
                font-size: small;
            }
        }

        #show {
            display: flex;
            height: 100%;
            overflow: hidden;
            width: 100%;
            margin-top: 5px;

            #edit::-webkit-scrollbar {
                width: 5px;
                height: 5px;
                background-color: #e2e1e0;
            }

            #edit::-webkit-scrollbar-thumb {
                background-color: #aaaaaa;
                border-radius: 5px;
            }

            #edit::-webkit-scrollbar-track {
                background-color: #ffeebc;
            }

            #edit {
                flex-grow: 1;
                flex-basis: 50%;
                width: 100%;
                outline: none;
                border: none;
                resize: none;
                border-radius: 1px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
                background-color: #ffeebc;
                margin: 5px 10px;
            }

            #preview::-webkit-scrollbar {
                width: 5px;
                height: 5px;
                background-color: #fff;
            }

            #preview::-webkit-scrollbar-thumb {
                background-color: #aaaaaa;
                border-radius: 5px;
            }

            #preview::-webkit-scrollbar-track {
                background-color: #fff;
            }

            #preview {
                flex-grow: 1;
                flex-basis: 50%;
                width: 100%;
                padding-left: 15px;
                overflow: auto;
                box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
                background-color: #fff;
            }
        }
    }
</style>
