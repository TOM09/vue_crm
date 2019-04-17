<!--图片放大-->
<template>
    <div class="m-img-view" @click="eClick">
        <div class="u-mask"></div>
        <div class="u-img">
            <img :src="src" />
        </div>
    </div>
</template>

<script>
    export default {
        name: "imgview",
        props:['src'],
        methods:{
            eClick(){
                this.$emit('click')
            }
        }
    }
</script>

<style scoped>
    .m-img-view{
       -position: fixed;
        width: 100%;
        height: auto;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 9999;
        text-align: center;

    }
    .u-mask{
        position: fixed;
        width: 100%;
        height: auto;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,0.5);
        z-index: 9999;
        text-align: center;
    }
    .u-img{
        transition: all .2s ease;
        display: inline-block;
        position: absolute;
        left:calc((100% - 700px)/2);
        top: 20%;
        z-index: 9999;
        height: auto;
    }
    .u-img img{
        width:700px;
        height: auto;
        max-width: 100%;
        max-height: 100%;
    }
</style>