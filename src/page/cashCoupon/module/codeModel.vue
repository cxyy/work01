<template>
  <el-dialog class="mini" title="二维码" :visible.sync="model" :before-close="closeDialog" :close-on-click-modal="false">
    <div class="qrcode-box">
      <canvas id="qrcode-canvas"></canvas>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">确 定</el-button>
      <el-button type="primary" @click="download">下 载</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import Axios from '@/common/Axios/interface'
  let QRCode = require('qrcode')

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
    data() {
      return {
        model: true
      }
    },
    methods: {
      download() {
        let myCanvas = document.getElementById('qrcode-canvas')
        let a = document.createElement('a')
        a.href = myCanvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
        a.download = this.comData.NAME.toString() + '.png'
        a.click()
        this.visited.page = null
      },
      closeDialog (){
        this.visited.page = null
      },
      createQrc (data) {
        QRCode.toCanvas(document.getElementById('qrcode-canvas'), data, (error) => {
          if (error) {
            this.$message({
              type: 'error',
              message: '后台服务器出错，创建二维码失败，请稍后重试！'
            })
          }
        })
      }
    },
    mounted() {
      let vm = this
      vm.$nextTick(function () {
        Axios.qcmessage({disid: vm.comData.ID}).then(data => {
          if (data.rtnCode === '1') {
            vm.createQrc(data.rtnMap.msg)
          } else {
            vm.$message({
              type: 'error',
              message: '后台服务器出错，创建二维码失败，请稍后重试！'
            })
          }
        })
      })
    }
  }
</script>

<style lang="scss">
  .qrcode-box {
    text-align: center;
  }
</style>
