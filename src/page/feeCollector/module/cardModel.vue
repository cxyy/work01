<template>
  <el-dialog class="mini" title="收费员工作证" :visible.sync="model" :before-close="closeDialog"
             :close-on-click-modal="false">
    <div class="card-model">
      <img src="/static/image/qiqixiaoyu3.jpg" alt="">
      <div class="card-info">
        <div>收费员：</div>
        <div>{{form.name}}</div>
      </div>
      <div class="card-info">
        <div>联系方式：</div>
        <div>{{form.phone}}</div>
      </div>
      <div class="card-info">
        <div>所属停车场：</div>
        <div>{{form.parkName}}</div>
      </div>
      <div class="card-info">
        <div>设备：</div>
        <div>{{form.device}}</div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">确 定</el-button>
      <el-button type="primary" @click="download">下载</el-button>
    </div>
  </el-dialog>
</template>

<script>
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
        title: '收费员工作证',
        model: true,
        form: {
          name: '',
          unit: '',
          phone: '',
          parkName: '',
          device: ''
        }
      }
    },
    methods: {
      download () {
        location.href = '/static/file/sss.xlsx'
      },
      closeDialog () {
        this.visited.page = null
      }
    },
    mounted () {
      console.log(this.comData)
      this.form = {
        name: this.comData.NAME,
        unit: this.comData.unit,
        phone: this.comData.TEL,
        parkName: this.comData.PNAME,
        device: this.comData.EQPT
      }
    }
  }
</script>

<style lang="scss">
  .card-model {
    text-align: center;
    img {
      width: 100px;
      height: 100px;
    }
    .card-info {
      display: flex;
      div:first-child {
        width: 160px;
        text-align: right;
      }
      div:last-child {
        flex-grow: 1;
        text-align: left;
      }
    }
  }
</style>
