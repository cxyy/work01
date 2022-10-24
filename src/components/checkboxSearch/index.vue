<template>
  <div class="checkbox-search">
    <div class="label">{{label}}</div>
    <div class="form">
      <span v-for="(item, idx) in copyFormArr" :key="idx" :class="{selectd: item.ID===selectd}" @click="itemClick(item)">{{item.VALUE}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      label: {
        type: String,
        default: '区/县：'
      },
      formArr: {
        type: Array
      }
    },
    data() {
      return {
        copyFormArr: [],
        selectd: ''
      }
    },
    methods: {
      itemClick (item) {
        if (this.selectd === item.ID) {
          return
        }
        this.selectd = item.ID
        this.$emit('click', item.ID, item.TYPE)
      }
    },
    mounted() {},
    watch: {
      'formArr': function (newVal, oldVal) {
        if (newVal.length) {
          this.copyFormArr = newVal
        }
      }
    }
  }
</script>

<style lang="scss">
  .checkbox-search{
    display: flex;
    .label{
      min-width: 70px;
      padding: 6px 0;
      white-space: nowrap;
    }
    .form{
      flex-grow: 1;
      margin-left: 10px;
      span{
        display: inline-block;
        margin-right: 20px;
        margin-bottom: 10px;
        padding: 6px 8px;
        cursor: pointer;
      }
      .selectd{
        background: rgba(24, 144, 255, 1);
        color: #fff;
      }
    }
  }
</style>
