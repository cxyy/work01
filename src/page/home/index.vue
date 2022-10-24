<template>
  <div id="home">
    <div class="header">
      <div class="header-item">
        <div class="box">
          <div class="title">停车场总数</div>
          <div class="data">{{baseInfo.parkingTotal}}</div>
        </div>
      </div>
      <div class="header-item">
        <div class="box">
          <div class="title">车位总数</div>
          <div class="data">{{baseInfo.parkNum}}</div>
        </div>
      </div>
      <div class="header-item">
        <div class="box">
          <div class="title">使用率</div>
          <div class="data">{{baseInfo.used}}%</div>
        </div>
      </div>
      <div class="header-item">
        <div class="box no-border">
          <div class="title">总缴费</div>
          <div class="data">{{baseInfo.feeTotal}}元</div>
        </div>
      </div>
    </div>
    <div class="pay-content">
      <div class="left">
        <div id="map"></div>
      </div>
      <div class="right">
        <div class="title">本月停车场使用率TOP10</div>
        <div class="data-box">
          <div class="data-item" v-for="(item, index) in rankList" :key="index">
            <div class="item-index" :class="{'sign': (index+1)<=3}">{{index+1}}</div>
            <span class="item-name">{{item.PNAME}}</span>
            <span class="item-num">{{(item.NUM * 100).toFixed(0)}}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Axios from '@/common/Axios/interface'
  import BMap from 'BMap'
  import BMAP_ANIMATION_BOUNCE from 'BMAP_ANIMATION_BOUNCE'

  export default {
    name: 'home',
    data () {
      return {
        baseInfo: {
          parkingTotal: 0,
          parkNum: 0,
          used: 0,
          feeTotal: 0
        },
        rankList: []
      }
    },
    methods: {
      createScript () {
//        let mapScript = document.createElement('script');
//        let headNode = document.getElementsByTagName('head');
//        mapScript.type = 'text/javascript';
//        mapScript.charset = 'utf-8';
//        mapScript.id = 'mapScript';
//        mapScript.src = 'http://api.map.baidu.com/api?v=2.0&ak=1GP1NXFZ7uOlVwHMwZGCS4SGM3awjR98';
//        headNode[0].appendChild(mapScript);
      },
      buildMap (data) {
        let map = new BMap.Map('map');
        map.centerAndZoom(new BMap.Point(120.312617, 31.498379), 13);
        map.addControl(new BMap.NavigationControl());
        map.enableScrollWheelZoom(true);
        function addMarker(point, parkInfo){
          var sContent = `<div class="map-tooltip">
                          <div class="title">${parkInfo.pname}</div>
                          <div class="data-row">
                            <div class="label">总停车数：</div>
                            <div class="info">${parkInfo.totalnum}</div>
                          </div>
                          <div class="data-row">
                            <div class="label">已用车位数：</div>
                            <div class="info">${parkInfo.uesdnum}</div>
                           </div>
                          <div class="data-row">
                            <div class="label">使用率：</div>
                            <div class="info">${((parkInfo.uesdnum / parkInfo.totalnum) * 100).toFixed(0)}%</div>
                          </div>
                          <div class="data-row">
                            <div class="label">停车场地址：</div>
                            <div class="info">${parkInfo.paddr}</div>
                          </div>
                         </div>`
          var infoWindow = new BMap.InfoWindow(sContent)
          let marker = new BMap.Marker(point)
          map.addOverlay(marker)
          marker.setAnimation(BMAP_ANIMATION_BOUNCE)
          marker.addEventListener('click', function(){
            this.openInfoWindow(infoWindow)
            infoWindow.redraw()
          })
        }
        for (let i = 0; i < data.length; i++) {
          let pointArr = data[i].plocation.split(',')
          let point = new BMap.Point(pointArr[0], pointArr[1])
          addMarker(point, data[i])
        }
      },
      getParkinfo () {
        return Axios.parkinfo().then(data => {
          if (data.rtnCode === '1') {
            this.rankList = data.rtnMap.rank
            this.baseInfo = {
              parkingTotal: data.rtnMap.park.TOTALPARK,
              parkNum: data.rtnMap.park.TOTALSTALL,
              used: (data.rtnMap.park.USERD * 100).toFixed(0),
              feeTotal: data.rtnMap.park.MONEY
            }
          }
        })
      },
      getMapinfo () {
        let vm = this
        return Axios.map().then(data => {
          if (data.rtnCode === '1') {
            vm.buildMap(data.rtnMap.park)
          }
        })
      }
    },
    async mounted () {
      await this.getMapinfo()
      await this.getParkinfo()
    }
  }
</script>

<style lang="scss">
  #home{
    .header{
      display: flex;
      margin-bottom: 20px;
      background: #fff;
      .header-item{
        padding: 30px 0;
        flex-grow: 1;
        .box{
          text-align: center;
          border-right: 1px solid rgb(214,214,214);
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
        width: 60%;
        background: #fff;
        #map{
          width: 100%;
          height: 100%;
          .map-tooltip{
            .title{
              margin-bottom: 15px;
              font-size: 18px;
              font-weight: 900;
            }
            .data-row{
              display: flex;
              margin-bottom: 5px;
              .label{
                width: 100px;
              }
              .info{
                padding-left: 30px;
                flex-grow: 1;
              }
            }
            .data-row:last-child{
              margin-bottom: 0;
            }
          }
        }
      }
      .right{
        flex-grow: 1;
        min-height: 530px;
        margin-left: 30px;
        background: #fff;
        .title{
          margin-bottom: 20px;
          padding-left: 24px;
          line-height: 50px;
          border-bottom: 1px solid #F0F2F5;
          font-size: 18px;
          font-weight: bold;
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
            background: #979799;
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
            background: #979799;
          }
          .item-name{
            margin-left: 14px;
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
