<template>
  <div class="app-container">
    <!-- 添加 -->
    <el-button v-waves class="filter-item" style="margin-left: 10px;margin-bottom: 20px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('client.add') }}</el-button>

    <!-- <el-tag style="margin-bottom:20px;">
      <a href="https://github.com/PanJiaChen/vue-element-admin/tree/master/src/components/TreeTable" target="_blank">Documentation</a>
    </el-tag> -->
    <!-- <el-tree
      :data="data5"
      node-key="id"
      default-expand-all
      :expand-on-click-node="false">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            type="text"
            size="mini"
            @click="() => append(data)">
            Append
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => remove(node, data)">
            Delete
          </el-button>
        </span>
      </span>
    </el-tree> -->

    <tree-table :data="data" :eval-func="func" :eval-args="args" :expand-all="expandAll" border>
      <el-table-column :label="$t('category.id')" width = "200">
        <template slot-scope="scope">
          <span style="color:#409EFF">{{ scope.row.id }}</span>
          <!-- <el-tag>{{ scope.row.timeLine+'ms' }}</el-tag> -->
        </template>
      </el-table-column>
      <el-table-column :label="$t('category.cat_name')">
        <template slot-scope="scope">
          <span style="color:sandybrown">{{ scope.row.cat_name }}</span>
          <!-- <el-tag>{{ scope.row.timeLine+'ms' }}</el-tag> -->
        </template>
      </el-table-column>
      <!-- <el-table-column label="时间线">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.timeLine+'ms'" effect="dark" placement="left">
            <div class="processContainer">
              <div
                :style="{ width:scope.row._width * 500+'px',
                          background:scope.row._width>0.5?'rgba(233,0,0,.5)':'rgba(0,0,233,0.5)',
                          marginLeft:scope.row._marginLeft * 500+'px' }"
                class="process">
                <span style="display:inline-block"/>
              </div>
            </div>
          </el-tooltip>
        </template>
      </el-table-column> -->
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('client.edit') }}</el-button>
          <!-- <el-button v-if="scope.row.status!='published'" size="mini" type="success" @click="handleModifyStatus(scope.row,'published')">{{ $t('client.publish') }}
          </el-button> -->
          <!-- <el-button v-if="scope.row.status!='draft'" size="mini" @click="handleModifyStatus(scope.row,'draft')">{{ $t('client.draft') }}
          </el-button> -->
          <el-button v-if="scope.row.status!='deleted'" size="mini" type="danger" @click="handleModifyStatus(scope.row,'deleted')">{{ $t('client.delete') }}
          </el-button>
        </template>
        <!-- <template slot-scope="scope">
          <el-button type="text" @click="message(scope.row.id)">点击</el-button>
        </template> -->
      </el-table-column>
    </tree-table>
  </div>
</template>

<script>
/**
  Auth: Lei.j1ang
  Created: 2018/1/19-14:54
*/
import waves from '@/directive/waves' // 导入vue指令
import treeTable from '@/components/TreeTable'
import treeToArray from './customEval'
import { catsTreeList } from '@/api/emailsend'

export default {
  name: 'CategoryList',
  directives: { waves },
  components: { treeTable },
  data() {
    return {
      func: treeToArray,
      expandAll: false,
      data: {},
      args: [null, null]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      catsTreeList().then(response => {
        this.data = response.data
      })
    },
    message(row) {
      this.$message(row)
    },
    handleUpdate() {
    },
    handleCreate() {
    }
  }
}
</script>

<style scoped>
  .custom-tree-node {
    flex: 0.5;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
