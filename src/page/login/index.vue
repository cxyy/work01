<template>
  <div id="login">
    <login-com></login-com>
  </div>
</template>

<script>
  import loginCom from './module/login.vue';

  export default {
    name: 'login',
    components: {
      loginCom
    },
    data () {
      return {}
    },
    methods: {}
  }
</script>

<style lang="scss">
  #login {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
</style>
