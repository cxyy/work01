<template>
  <el-dialog class="mini" :title="title" :visible.sync="model" :before-close="closeDialog" :close-on-click-modal="false">
    <ul class="lists">
      <li>序号：{{lists.id}}</li>
      <li>订单时间：{{lists.orderTime}}</li>
      <li>订单金额：{{lists.price}}</li>
      <li>收款人：{{lists.payee}}</li>
      <li>停车场名称：{{lists.parking}}</li>
      <li>车牌信息：{{lists.license}}</li>
      <li>入场时间：{{lists.startTime}}</li>
      <li>出场时间：{{lists.endTime}}</li>
      <li>支付状态：<span v-if="comData.STATUS===0">支付失败</span><span v-if="comData.STATUS===1">支付成功</span></li>
    </ul>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="closeDialog()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import Axios from '@/common/Axios/interface'

  export default {
    props: {
      visited: {
        type: Object,
        required: true
      },
      comData: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        title: '收款记录',
        model: true,
        lists: {
          id: '',
          orderTime: '',
          price: '',
          payee: '',
          parking: '',
          license: '',
          startTime: '',
          endTime: ''
        }
      }
    },
    methods: {
      closeDialog () {
        this.visited.page = null
      }
    },
    mounted () {
      Axios.getOrderDetail({orderid: this.comData.ORDERID}).then(data => {
        if (data.rtnCode === '1') {
          this.lists = {
            id: this.comData.sortIndex,
            orderTime: data.rtnMap.TIME,
            price: data.rtnMap.MONEY,
            payee: data.rtnMap.NAME,
            parking: data.rtnMap.PNAME,
            license: data.rtnMap.CARID,
            startTime: data.rtnMap.ENTRYTIME,
            endTime: data.rtnMap.DEPARTURETIME
          }
        }
      })
    }
  }
</script>

<style lang="scss">
  .mini {
    .lists {
      list-style: none !important; padding-bottom: 16px;
      li {
        list-style: none !important;
        margin-left: 14px;
        margin-top: 10px;
        font-size: 16px;
      }
    }
  }
</style>
