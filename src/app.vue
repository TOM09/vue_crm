<template>
  <div id="main" class="app-main">
    <router-view ></router-view>
  </div>
</template>

<script>

let a = 1;
new Promise(function(resolve, reject){
    if (a == 1) {
        resolve('成功');
    } else{
        reject('失败');
    }
}).then(res => {
    console.log(res);   // 成功
}).catch(err => {
    console.log(err);   // 失败
});
















  export default {
    data () {
      return {
      };
    },
    mounted () {

    },
    beforeDestroy () {

    },
    methods: {
    }
  };
</script>

<style>
  .app-main{
    width: 100%;
    height: 100%;
  }
</style>
