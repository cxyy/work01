<template>
  <div class="page-404">
    <div class="page-404-main">
      <div class="page-404-tool">{{tool}}</div>
      <div class="go-to-login" @click="goLogin">返回登录</div>
      <img src="/static/image/404.png" alt="">
    </div>
  </div>
</template>

<script>
  export default {
   data () {
     return {
       tool: '这里没有你想要的东西哦'
     }
   },
    methods: {
      goLogin () {
        this.$router.push({name: 'login'})
      }
    },
    mounted () {
//      document.getElementsByTagName('title')[0].innerHTML = this.tool
    }
  }
</script>

<style lang="scss">
  .page-404{
    position: relative;
    height: 100%;
    .page-404-main{
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100%;
      margin: auto;
      transform: translate(-50%, -50%);
      text-align: center;
      .page-404-tool{
        padding: 0 30px 10px;
        font-size: 34px;
        color: #51A3EF;
      }
      .go-to-login{
        padding-bottom: 10px;
        font-size: 28px;
        color: red;
        cursor: pointer;
      }
      img{
        max-width: 100%;
        height: 400px;
      }
    }
  }
</style>
