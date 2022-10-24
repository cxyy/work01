<template>
  <div class="checkbox-search">
    <div class="label">{{label}}</div>
    <div class="form">
      <span v-for="(item, idx) in copyFormArr" :key="idx" :class="{selectd: selectdArr.includes(item.ID)}" @click="itemClick(item)">{{item.VALUE}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: '',
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
        selectdArr: []
      }
    },
    methods: {
      itemClick (item) {
        if (this.selectdArr.includes(item.key)) {
          // 取消全选
          if (item.key === 'all') {
            this.selectdArr = []
            return
          }
          this.selectdArr = this.selectdArr.filter(x => (x !== item.key))
          this.selectdArr = this.selectdArr.filter(x => (x !== 'all'))
        } else {
          // 点击全选
          if (item.key === 'all') {
            this.selectdArr = []
            this.copyFormArr.forEach((val, idx, arr) => {
              this.selectdArr.push(val.key)
            })
            return
          }
          this.selectdArr.push(item.key)
          if (this.selectdArr.length === this.copyFormArr.length - 1) {
            this.selectdArr.push('all')
          }
        }
      }
    },
    mounted() {
//      this.copyFormArr = [
//        {key: 'all', label: this.all},
//        {key: 'binhu', label: '滨湖区'},
//        {key: 'liangxi', label: '梁溪区'},
//        {key: 'xinwu', label: '新吴区'},
//        {key: 'huishan', label: '惠山区'},
//        {key: 'jiangyin', label: '江阴'},
//        {key: 'yixing', label: '宜兴'},
//        {key: 'baixia', label: '白下'},
//        {key: 'tianlan', label: '天蓝区'}
//      ]
//      console.log(this.formArr, '1111')
    },
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
