<template>
    <div class="home">
222
    </div>
</template>
<script>
    export default {
        data() {
            return {};
        },
        created() {
            this.erp()
        },
        methods: {
            erp(){
                this.$api.erpCheck({}).then(res=>{

                })
            }
        },
        computed: {},
        components: {},
        mounted() {
        }
    };
</script>
<style scoped lang="scss">
    .home{
        width: 300px;
        height: 200px;
        font-size: 14px;
    }
</style>