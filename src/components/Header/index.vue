<template>
  <header>
    <div class="left">
      <i class="w-icon-pack" @click="closeMenu" v-if="state==='open'"></i>
      <i class="w-icon-pack" @click="openMenu" v-if="state==='close'"></i>
    </div>
    <div class="right">
      <div class="vertical-center">
        <el-popover placement="bottom" popper-class="head-message" trigger="click">
          <div class="message-list-box" v-if="messageData.length">
            <div class="message-list-row" v-for="(item, index) in messageData" :key="index" @click="checkMessage(item)">
              <div class="left">
                <div class="icon">
                  <i class="w-icon-read"></i>
                  <i class="sign" v-if="item.READFLAG === 0"></i>
                </div>
                <div class="title" :title="item.TITLE">{{item.TITLE}}</div>
              </div>
              <div class="right">
                <div class="time">{{item.TIME}}</div>
              </div>
            </div>
          </div>
          <div class="tui-song-box" slot="reference">
            <i class="hasNotRead" v-show="hasNotRead"></i>
            <i class="w-icon-news message-center"></i>
          </div>
        </el-popover>
        <img class="head-img" src="/static/image/user_head.jpg"/>
        <el-dropdown @command="handleCommand" class="user-name" trigger="click">
          <span class="el-dropdown-link">{{username}}</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="personalCenter">个人中心</el-dropdown-item>
            <el-dropdown-item command="passwordMod">密码修改</el-dropdown-item>
            <el-dropdown-item command="login">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <el-dialog class="bigger message-detail-dialog" title="公告详情" :visible.sync="model" :before-close="closeDialog" :close-on-click-modal="true" :append-to-body="true">
      <div id="notice"></div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeDialog">关 闭</el-button>
      </div>
    </el-dialog>
  </header>
</template>

<script>
  import cookie from '@/common/cookie/cookie'
  import Axios from '@/common/Axios/interface'
  const http = require('../../../application/httpConfig/index.json');

  export default {
    data () {
      return {
        state: 'open',
        username: '',
        userid: '',
        messageData: [],
        model: false,
        webSocket: null,
        hasNotRead: false
      }
    },
    methods: {
      closeMenu () {
        this.state = 'close'
        this.$emit('menuClose', true)
      },
      openMenu () {
        this.state = 'open'
        this.$emit('menuClose', false)
      },
      handleCommand(command) {
        if (command === 'login') {
          this.$confirm('确定退出登录?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            cookie.delCookie('token')
            sessionStorage.clear()
            this.$router.push({name: command})
          }).catch(() => {})
          return
        }
        this.$router.push({name: command})
      },
      checkMessage (data) {
        let vm = this
        Axios.readmsg({id: data.ID}).then(res => {
          if (res.rtnCode === '1') {
            data.READFLAG = 1
            vm.model = true
            vm.$nextTick(function () {
              document.getElementById('notice').innerHTML = data.CONTENT
            })
            let num = 0
            for (let i = 0; i < this.messageData.length; i++) {
              if (this.messageData[i].READFLAG === 0) {
                num++
              }
            }
            if (num > 0) {
              this.hasNotRead = true
            } else {
              this.hasNotRead = false
            }
          } else {
            this.$message({
              type: 'error',
              message: '连接服务器超时，该消息暂时无法查看，请稍后重试'
            })
          }
        })
      },
      closeDialog () {
        this.model = false
      },
      personMsg () {
        Axios.personMsg().then(data => {
          if (data.rtnCode === '1') {
            this.messageData = data.rtnMap.result
            for (let i = 0; i < this.messageData.length; i++) {
              if (this.messageData[i].READFLAG === 0) {
                this.hasNotRead = true
                break
              }
            }
          }
        })
      }
    },
    mounted () {
      let vm = this
      this.personMsg()
//      this.username = JSON.parse(this.$store.state.username)
      this.username = JSON.parse(sessionStorage.getItem('username'))
      if ('WebSocket' in window) {
        this.webSocket = new WebSocket(http.socketHttp + '?connectid=' + sessionStorage.getItem('userid'));
      }
      this.webSocket.onerror = function() {
        console.log('WebSocket连接发生错误')
      }
      this.webSocket.onopen = function() {
        console.log('WebSocket连接成功')
      }
      this.webSocket.onmessage = function(event) {
        if (event.data) {
          console.log(event.data)
          let date = new Date()
          let year = date.getFullYear()
          let month = date.getMonth() + 1
          let day = date.getDate()
          let hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
          let minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
          let second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
          let currentTime = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
          let messageObj = JSON.parse(event.data)
          vm.messageData.unshift({
            TIME: currentTime,
            TITLE: messageObj.TITLE,
            CONTENT: messageObj.MESSAGE,
            READFLAG: 0,
            ID: messageObj.msgid
          })
          vm.hasNotRead = true
        }
      }
      this.webSocket.onclose = function() {
        console.log('WebSocket连接关闭')
      }
      window.onbeforeunload = function() {
        this.webSocket.close()
        this.webSocket = null
      }
    }
  }
</script>

<style lang="scss">
  $greyColor:#b3b3b3;
  header{
    display: flex;
    height: 90px;
    line-height: 90px;
    background: #fff;
    border-bottom: 1px solid #e5e5e5;
    .left{
      i{
        margin-left: 20px;
        font-size: 30px;
        cursor: pointer;
        color:  $greyColor;
      }
    }
    .right{
      position: relative;
      flex-grow: 1;
      text-align: right;
      .message-center{
        font-size: 36px;
        color:  $greyColor;
        vertical-align: middle;
        cursor: pointer;
      }
      .head-img{
        margin-left: 30px;
        margin-right: 10px;
        width: 48px;
        height: 48px;
        border-radius: 100px;
        vertical-align: middle;
      }
      .user-name{
        margin-right: 35px;
        cursor: pointer;
      }
    }
    .tui-song-box{
      position: relative;
      display: inline-block;
      height: 100%;
      .hasNotRead{
        position: absolute;
        top: 25px;
        right: -5px;
        width: 9px;
        height: 9px;
        border-radius: 50%;
        background: red;
      }
    }
  }
  .head-message{
    width: 400px;
    max-height: 170px;
    padding: 0 20px !important;
    overflow-x: hidden;
    overflow-y: auto;
    .message-list-box{
      .message-list-row{
        display: flex;
        padding: 12px 0;
        border-bottom: 1px solid #ccc;
        cursor: pointer;
        .left{
          flex-grow: 1;
          display: flex;
          .icon{
            position: relative;
            width: 25px;
            .w-icon-read{
              font-size: 18px;
            }
            .sign{
              position: absolute;
              left: 14px;
              width: 6px;
              height: 6px;
              border-radius: 50%;
              background: red;
            }
          }
          .title{
            font-size: 12px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }
        }
        .right{
          width: 165px;
          text-align: right;
          color: #808080;
          font-size: 12px;
        }
      }
      .message-list-row:last-child {
        border-bottom: none;
      }
    }
  }
  .message-detail-dialog{
    #notice{
      width: 100%;
      min-height: 200px;
      overflow-x: auto;
    }
  }
</style>
