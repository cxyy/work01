<template>
  <div class="real_time_park_map">
    <div class="change-list">
      <div class="opt" @click="changeList">
        <i class="el-icon-refresh"></i>
        <span>切换为卡片</span>
      </div>
    </div>
    <div id="map"></div>
  </div>
</template>

<script>
import BMap from 'BMap';
import BMAP_ANIMATION_BOUNCE from 'BMAP_ANIMATION_BOUNCE';

export default {
  props: {
    isList: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {};
  },
  methods: {
    buildMap(data) {
      let map = new BMap.Map('map');
      map.centerAndZoom(new BMap.Point(120.222355, 31.551568), 13);
      map.addControl(new BMap.NavigationControl());
      map.enableScrollWheelZoom(true);
      if (!data.length) {
        return;
      }
      function addMarker(point, parkInfo) {
        var sContent = `<div class="map-tooltip">
                          <div class="title">${parkInfo.PNAME}</div>
                          <div class="data-row">
                            <div class="label">总停车数：</div>
                            <div class="info">${parkInfo.TOTALNUM}</div>
                          </div>
                          <div class="data-row">
                            <div class="label">已用车位数：</div>
                            <div class="info">${parkInfo.USEDNUM}</div>
                           </div>
                          <div class="data-row">
                            <div class="label">使用率：</div>
                            <div class="info">${(parkInfo.USED * 100).toFixed(
                              0
                            )}%</div>
                          </div>
                          <div class="data-row">
                            <div class="label">停车场地址：</div>
                            <div class="info">${parkInfo.PADDR}</div>
                          </div>
                         </div>`;
        var infoWindow = new BMap.InfoWindow(sContent);
        let marker = new BMap.Marker(point);
        map.addOverlay(marker);
        marker.setAnimation(BMAP_ANIMATION_BOUNCE);
        marker.addEventListener('click', function() {
          this.openInfoWindow(infoWindow);
          infoWindow.redraw();
        });
      }
      for (let i = 0; i < data.length; i++) {
        let pointArr = data[i].PLOCATION.split(',');
        let point = new BMap.Point(pointArr[0], pointArr[1]);
        addMarker(point, data[i]);
      }
    },
    changeList() {
      this.$emit('changeList');
    }
  },
  mounted() {}
};
</script>

<style lang="scss">
.real_time_park_map {
  position: relative;
  .change-list {
    margin-bottom: 5px;
    text-align: right;
    color: #87cefa;
    position: absolute;
    right: 5px;
    z-index: 99;
    top: 32px;
    .opt {
      background-color: #ffffff;
      display: inline-block;
      cursor: pointer;
      height: 40px;
      line-height: 40px;
      padding: 0 10px;
      border-radius: 4px;
      i {
        color: #4084ff;
        font-size: 22px;
        vertical-align: middle;
      }
      span {
        margin-left: 5px;
        color: #4084ff;
      }
    }
  }
  #map {
    width: 100%;
    height: 500px;
    .map-tooltip {
      .title {
        margin-bottom: 15px;
        font-size: 18px;
        font-weight: 900;
      }
      .data-row {
        display: flex;
        margin-bottom: 5px;
        .label {
          width: 100px;
        }
        .info {
          padding-left: 30px;
          flex-grow: 1;
        }
      }
      .data-row:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
