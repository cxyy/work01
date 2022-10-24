<template>
  <el-dialog class="mini" title="菜单详情" :visible.sync="model" :before-close="closeDialog">
    <p class="menu-row">菜单名称：{{form.menuName}}</p>
    <p class="menu-row">父级菜单：{{form.parentMenu}}</p>
    <p class="menu-row">类型：{{form.type | menuType}}</p>
    <p class="menu-row">排序号：{{form.order}}</p>
    <p class="menu-row">菜单URL：{{form.url}}</p>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="closeDialog">确 定</el-button>
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
    data() {
      return {
        model: true,
        form: {
          menuName: '',
          parentMenu: '',
          type: '',
          order: '',
          url: ''
        }
      }
    },
    filters: {
      menuType (value) {
        value = value.toString()
        if (value === '0') {
          return '目录'
        } else if (value === '1') {
          return '菜单'
        } else if (value === '2') {
          return '按钮'
        } else {
          return ''
        }
      }
    },
    methods: {
      closeDialog (){
        this.visited.page = null
      }
    },
    mounted() {
      this.form = {
        menuName: this.comData.label,
        parentMenu: this.comData.plabel,
        type: this.comData.menuType,
        order: this.comData.index,
        url: this.comData.url
      }
    }
  }
</script>

<style lang="scss">
  .mini{
    .menu-row{
      margin-bottom: 8px;
    }
  }
</style>
