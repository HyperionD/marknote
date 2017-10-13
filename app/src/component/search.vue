<template>
    <div id="search">
        <p>{{ result }}</p>
    </div>
</template>

<script>
    export default {
        data: function () {
            return {
                result: ""
            };
        },
        beforeMount: function () {
            this.getSearch();
        },
        watch: {
            $route: function () {
                this.getSearch();
            }
        },
        methods: {
            getSearch: function () {
                const search_str = this.$route.query.search_str;
                this.result = search_str;
            }
        }
    };
</script>

<style lang="less">
    #search {
        flex-grow: 1;
    }
</style>
