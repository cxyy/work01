<template>
  <div id="pay_analysis">
    <div class="header">
      <div class="header-item">
        <div class="box">
          <div class="title">总缴费</div>
          <div class="data">{{profitAnalysis.total}}元</div>
        </div>
      </div>
      <div class="header-item">
        <div class="box">
          <div class="title">本月缴费</div>
          <div class="data">{{profitAnalysis.month}}元</div>
        </div>
      </div>
      <div class="header-item">
        <div class="box no-border">
          <div class="title">本月增长率</div>
          <div class="data">{{profitAnalysis.addScale}}%</div>
        </div>
      </div>
    </div>
    <div class="pay-content">
      <div class="left">
        <div class="title">缴费趋势</div>
        <div id="echarts_box"></div>
      </div>
      <div class="right">
        <div class="title">本月缴费排行榜</div>
        <div class="data-box">
          <div class="data-item" v-for="(item, index) in rankList" :key="index">
            <div class="item-index" :class="{'sign': (index+1)<=3}">{{index+1}}</div>
            <span class="item-name">{{item.PNAME}}</span>
            <span class="item-num">{{item.MONEY}}元</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Axios from '@/common/Axios/interface'
  let echarts = require('echarts/lib/echarts')
  require('echarts/lib/chart/pie')
  require('echarts/lib/chart/bar')
  require('echarts/lib/component/tooltip')
  require('echarts/lib/component/title')

  export default {
    name: 'payAnalysis',
    data () {
      return {
        profitAnalysis: {
          total: 0,
          month: 0,
          addScale: 0
        },
        rankList: [],
        xAxisData: [],
        seriesData: []
      }
    },
    methods: {
      getRank () {
        Axios.chargedata().then(data => {
          if (data.rtnCode === '1') {
            this.rankList = data.rtnMap.rank
            this.profitAnalysis = {
              total: data.rtnMap.TOTAL,
              month: data.rtnMap.CUNMONEY,
              addScale: data.rtnMap.RISE
            }
          }
        })
      },
      getEcharts () {
        return Axios.charge().then(data => {
          if (data.rtnCode === '1') {
            data.rtnMap.result.forEach(val => {
              this.xAxisData.push(val.TIME)
              this.seriesData.push(val.MONEY)
            })
          }
        })
      }
    },
    async mounted () {
      await this.getEcharts()
      let myChart = echarts.init(document.getElementById('echarts_box'))
      let option = {
        tooltip: {},
        legend: {},
        xAxis: {
          data: this.xAxisData
        },
        yAxis: {
          name: '金额'
        },
        series: [{
          name: '收费情况',
          type: 'bar',
          data: this.seriesData,
          itemStyle: {
            color: '#3BA1FF'
          }
        }]
      }
      myChart.setOption(option)
      this.getRank()
    }
  }
</script>

<style lang="scss">
  #pay_analysis{
    .header{
      display: flex;
      margin-bottom: 20px;
      background: #fff;
      .header-item{
        padding: 30px 0;
        flex-grow: 1;
        .box{
          text-align: center;
          border-right: 1px solid #ccc;
          .title{
            margin-bottom: 10px;
          }
          .data{
            font-size: 24px;
            font-weight: bold;
          }
        }
        .no-border{
          border-right: none;
        }
      }
    }
    .pay-content{
      display: flex;
      .left{
        display: flex;
        flex-direction: column;
        width: 60%;
        background: #fff;
        .title{
          padding-left: 40px;
          height: 50px;
          line-height: 50px;
          border-bottom: 1px solid #ccc;
        }
        #echarts_box{
          flex-grow: 1;
        }
      }
      .right{
        flex-grow: 1;
        min-height: 400px;
        margin-left: 30px;
        background: #fff;
        .title{
          margin-bottom: 20px;
          padding-left: 30px;
          line-height: 50px;
          border-bottom: 1px solid #F0F2F5;
        }
        .data-item{
          margin-bottom: 12px;
          padding: 0 24px 0 24px;
          line-height: 26px;
          color: #666666;
          .item-index{
            display: inline-block;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: #F0F2F5;
            color: #fff;
            text-align: center;
            vertical-align: middle;
            font-size: 20px;
            line-height: 28px;
          }
          &:first-child,&:nth-child(2),&:nth-child(3){
            .sign{
             background: #4084FF;
            }
          }
          .sign{
            background: #314659;
          }
          .item-name{
            margin-left: 25px;
            vertical-align: middle;
          }
          .item-num{
            float: right;
            vertical-align: middle;
          }
        }
      }
    }
  }
</style>
