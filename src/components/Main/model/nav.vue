<template>
  <div class="nav">
    <div class="logo" v-if="!closed">
      <img class="mini-img el-ver-middle" src="/static/image/logo_mini.png"/>
      <span class="el-ver-middle">风凛科技智慧停车</span>
    </div>
    <div class="logo" v-if="closed">
      <el-tooltip class="item" effect="dark" content="风凛科技智慧停车" placement="right">
        <img class="mini-img el-ver-middle" src="/static/image/logo_mini.png"/>
      </el-tooltip>
    </div>
    <el-menu class="el-menu-vertical-demo" :unique-opened="true" :default-active="defaultActive" @select="select"
             background-color="#313742" text-color="#fff" active-text-color="#fff" :collapse="closed">
      <el-menu-item index="home">
        <i class="w-icon-home"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <el-submenu v-for="(item, index) in auth" :key="index" :index="index.toString()">
        <template slot="title">
          <i :class="{'w-icon-price': item.mkey==='unitManage', 'w-icon-part': item.mkey==='parkingManage', 'w-icon-operate': item.mkey==='businessManage',
              'w-icon-money': item.mkey==='financeManage', 'w-icon-statistical': item.mkey==='countManage', 'w-icon-set': item.mkey==='systemManage'}"></i>
          <span>{{item.label}}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item v-for="childItem in item.children" :key="childItem.mkey" :index="childItem.mkey">
            <i class="point"></i>
            <span class="menu-label">{{childItem.label}}</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        closed: false,
        auth: [],
        defaultActive: 'home'
      }
    },
    methods: {
      select (index, path) {
        this.$router.push({name: index})
      },
      changeMenuState (state) {
        this.closed = state
      }
    },
    mounted () {
//      this.auth = JSON.parse(this.$store.state.auth)
      this.auth = JSON.parse(sessionStorage.getItem('auth'))
      let urlArr = location.href.split('/')
      this.defaultActive = urlArr[urlArr.length - 1]
    }
  }
</script>

<style lang="scss">
  .nav{
    height: 100%;
    background: #313742;
    .logo{
      height: 92px;
      line-height: 92px;
      text-align: center;
      background: #22262f;
      color: #fff;
      font-size: 0;
      .mini-img{
        width: 28px;
        height: 28px;
      }
      span{
        font-size: 20px;
        padding-left: 12px
      }
    }
    .el-menu{
      border-right: none;
      .el-menu-item.is-active{
        background: #4084ff !important;
      }
    }
    .point{
      display: inline-block;
      width: 3px;
      height: 3px;
      border-radius: 50%;
      background: #fff;
    }
    .menu-label{
      margin-left: 10px;
    }
  }
</style>
