<template>
    <div class="content"
         @scroll="onContentScroll"
         :class="[
         bottomState ? 'bottomCont' : '',
         topState ? 'topCont' : '',
         bgColor ? 'bgWhite' : '',
         isScroll ? 'contScroll' : '',
         hiddenState ? 'contHidden' : '']">
        <slot/>
    </div>
</template>
<script>
    export default {
        components: {},
        props: {
            bgColor: false,
            hiddenState: {
                type: Boolean,
                default: false
            },
            scrollEndStep: {
                type: Number,
                default: 0
            },
            scrollTopStep: {
                type: Number,
                default: 0
            },
            isScroll: false,
            bottomState: false,
            topState: false
        },
        data() {
            return {};
        },
        computed: {},
        created() {
        },
        mounted() {
        },
        methods: {
            onContentScroll(e) {
                const t = e.target
                const scrollTop = t.scrollTop
                const clientHeight = t.clientHeight
                const scrollHeight = t.scrollHeight

                if (scrollTop + clientHeight >= scrollHeight - this.scrollEndStep) {
                    this.$emit('scrollEnd')
                }

                if (scrollTop <= this.scrollTopStep) {
                    this.$emit('scrollTop')
                }

                this.$emit('scroll', {
                    scrollTop,
                    clientHeight,
                    scrollHeight
                })
            }
        }
    };
</script>
<style scoped lang="scss">
    .content {
        width: 100%;
        position: absolute;
        top: 0.45rem;
        bottom: 0;
        left: 0;
        background: #f7f7f9;
        padding-top: constant(safe-area-inset-top);
        padding-top: env(safe-area-inset-top);
        padding-bottom: constant(safe-area-inset-bottom);
        padding-bottom: env(safe-area-inset-bottom);
        -webkit-overflow-scrolling: touch;
    }

    .contScroll {
        overflow-y: auto;
        overflow-x: hidden;
    }

    .bgWhite {
        background: #ffffff;
    }

    .contHidden {
        overflow: inherit;
    }

    .bottomCont {
        bottom: 0.56rem;
    }

    .topCont {
        top: 0.88rem;
    }
</style>
