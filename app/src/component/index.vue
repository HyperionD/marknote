<template>
    <div id="index">
        <sidemenu></sidemenu>
        <router-view></router-view>
    </div>
</template>

<script>
    import sidemenu from "./sidemenu.vue";

    export default {
        data: function () {
            return {};
        },
        components: { sidemenu }
    };
</script>

<style lang="less">
    html, body {
        height: 100%;
        margin: 0;
        padding: 0;
    }

    ul, li, p {
        margin: 0;
        padding: 0;
    }

    #index {
        display: flex;
        height: 100%;
    }
</style>
