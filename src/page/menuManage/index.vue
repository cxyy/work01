<template>
  <div id="menu_manage" class="com-bgcolor">
    <div class="search-box">
      <div class="search-form-item">
        <label>菜单名称：</label>
        <div class="form-item-content">
          <el-input v-model="form.menuName" placeholder="请输入菜单名称"></el-input>
        </div>
      </div>
      <div class="search-form-btn">
        <el-button type="primary" @click="search">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </div>
    </div>
    <div class="search-content">
      <el-tree :data="treeData" node-key="id" :expand-on-click-node="false" :default-expanded-keys="[0]" highlight-current>
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button type="text" @click="addMenu(data)" v-if="data.menuType!==2">添加</el-button>
          <el-button type="text" @click="delMenu(node, data)" v-if="data.menuType!==-1">删除</el-button>
          <el-button type="text" @click="editMenu(data)" v-if="data.menuType!==-1">编辑</el-button>
          <el-button type="text" @click="detail(data)" v-if="data.menuType!==-1">详情</el-button>
        </span>
      </span>
      </el-tree>
    </div>
    <component :is="visited.page" :visited="visited" :comData="comData" @refresh="getAllMenu"></component>
  </div>
</template>

<script>
  import menuModel from './module/menuModel'
  import detailModel from './module/detailModel'
  import Axios from '@/common/Axios/interface'

  export default {
    name: 'menuManage',
    components: {
      'menuModel': menuModel,
      'detailModel': detailModel
    },
    data () {
      return {
        treeData: [],
        form: {
          menuName: ''
        },
        visited: {
          page: null
        },
        comData: {}
      }
    },
    methods: {
      search (){
        this.$message({
          type: 'info',
          message: '暂不支持菜单查询'
        })
      },
      reset (){
        this.form = {
          menuName: ''
        }
      },
      detail (data) {
        this.comData = data
        this.visited.page = 'detailModel'
      },
      addMenu(data) {
        this.comData = data
        this.comData.type = 'add'
        this.visited.page = 'menuModel'
      },
      editMenu (data) {
        this.comData = data
        this.comData.type = 'edit'
        this.visited.page = 'menuModel'
      },
      delMenu(node, data) {
        this.$confirm('此操作将永久删除该菜单及其子菜单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Axios.delmenu({ids: data.id}).then(res => {
            if (res.rtnCode === '1') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              const parent = node.parent;
              const children = parent.data.children || parent.data;
              const index = children.findIndex(d => d.id === data.id);
              children.splice(index, 1);
            }
          })
        }).catch(() => {})
      },
      getAllMenu () {
        Axios.getmenu().then(data => {
          if (data.rtnCode === '1') {
            this.treeData = [data.rtnMap.result]
          }
        })
      }
    },
    mounted () {
      this.getAllMenu()
    }
  }
</script>

<style lang="scss">
  #menu_manage{
    .search-content{
      width: 44%;
      padding-bottom: 20px;
      padding-right: 0;
      .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
      }
    }
    @media screen and (max-width: 1380px) {
      .search-content{
        width: 58%;
      }
    }
  }
</style>
