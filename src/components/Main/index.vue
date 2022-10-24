<template>
  <div id="main">
    <div class="main-left" :class="{'menu-open': state, 'menu-close': !state}">
      <nav-com ref="nav"></nav-com>
    </div>
    <div class="main-right">
      <header-com @menuClose="foldMenu"></header-com>
      <div class="main-right-content">
        <div>
          <q-title :title="title" class="margin-bottom-30"></q-title>
          <router-view/>
        </div>
        <footer-com></footer-com>
      </div>
    </div>
  </div>
</template>

<script>
  import QTitle from '@/components/QTitle/'
  import headerCom from '@/components/Header/'
  import footerCom from '@/components/Footer/'
  import navCom from './model/nav.vue'

  export default {
    components: {
      QTitle,
      headerCom,
      footerCom,
      navCom
    },
    data () {
      return {
        title: '首页',
        state: true
      }
    },
    methods: {
      getNav (target) {
        let nav = [
          {key: 'home', label: '首页'},
          {key: 'personalCenter', label: '个人中心'},
          {key: 'passwordMod', label: '密码修改'},
          {key: 'units', label: '单位管理'},
          {key: 'carYard', label: '停车场管理/车场管理'},
          {key: 'parking', label: '停车场管理/车位管理'},
          {key: 'rules', label: '停车场管理/规则管理'},
          {key: 'device', label: '停车场管理/设备管理'},
          {key: 'ticket', label: '停车场管理/小票管理'},
          {key: 'feeCollector', label: '停车场管理/收费员管理'},
          {key: 'carOwner', label: '运营管理/车主管理'},
          {key: 'cashCoupon', label: '运营管理/代金券管理'},
          {key: 'monthCard', label: '运营管理/月卡管理'},
          {key: 'whiteList', label: '运营管理/白名单'},
          {key: 'blackList', label: '运营管理/黑名单'},
          {key: 'receiptsRecord', label: '财务管理/收款记录'},
          {key: 'feeCollectorRecord', label: '财务管理/收费员记录'},
          {key: 'account', label: '财务管理/账户管理'},
          {key: 'realTimePark', label: '统计管理/实时车位'},
          {key: 'parkingRecord', label: '统计管理/停车记录'},
          {key: 'payAnalysis', label: '统计管理/缴费分析'},
          {key: 'userManage', label: '系统管理/用户管理'},
          {key: 'roleManage', label: '系统管理/角色管理'},
          {key: 'menuManage', label: '系统管理/菜单管理'},
          {key: 'messageCenter', label: '系统管理/消息中心'},
          {key: 'dictionary', label: '系统管理/字典管理'},
          {key: 'operationLog', label: '系统管理/操作日志'}
        ]
        for (let i = 0; i < nav.length; i++) {
          if (nav[i].key === target) {
            this.title = nav[i].label
            break
          }
        }
      },
      foldMenu (state) {
        this.$refs.nav.changeMenuState(state)
        this.state = !state
      }
    },
    watch: {
      $route: {
        handler: function (val, oldVal) {
          this.getNav(val.name)
        },
        deep: true
      }
    },
    mounted () {
      let urlArr = location.href.split('/')
      this.getNav(urlArr[urlArr.length - 1])
    }
  }
</script>

<style lang="scss">
  #main {
    display: flex;
    height: 100%;
    .main-right {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      min-width: 1000px;
      overflow-x: hidden;
      .main-right-content {
        position: relative;
        flex-grow: 1;
        height: 100%;
        padding: 30px 30px 0;
        background: rgba(245, 245, 245, 1);
        overflow-x: hidden;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
    }
    .menu-open {
      width: 240px;
      min-width: 240px;
    }
    .menu-close {
      width: 64px;
    }
    .main-left {
      height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
    }
    .main-left::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 6px rgba(190, 190, 190, 1);
      background-color: #F5F5F5;
      border-radius: 10px;
    }
    .main-left::-webkit-scrollbar {
      //width: 7px;
      width: 0 !important;
      background-color: #F5F5F5;
    }
    .main-left::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background-image: -webkit-gradient(linear,
        left bottom,
        left top,
        color-stop(0.44, rgb(190, 190, 190)),
        color-stop(0.72, rgb(190, 190, 190)),
        color-stop(0.86, rgb(190, 190, 190)));
    }
  }
</style>
