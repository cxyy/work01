<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  import './assets/icon/iconmoon.css';
  export default {
    name: 'App',
    data () {
      return {}
    },
    methods: {},
    mounted () {
    }
  }
</script>

<style>
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body {
    height: 100%;
  }

  #app {
    height: 100%;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
</style>
