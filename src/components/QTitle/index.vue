<template>
  <nav class="q-title">
    <span v-text="firstNav" :class="{'add-weight': !secondNav}"></span>
    <span v-if="secondNav"> / </span>
    <span v-if="secondNav" v-text="secondNav" class="add-weight"></span>
  </nav>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        default: '首页'
      }
    },
    data () {
      return {
      }
    },
    computed: {
      firstNav () {
        return this.title.split('/')[0]
      },
      secondNav () {
        return this.title.split('/')[1]
      }
    },
    mounted () {
    }
  }
</script>

<style lang="scss">
  .q-title{
    .add-weight{
      font-weight: 900;
      font-size: 18px;
      color: #333;
    }
  }
</style>
