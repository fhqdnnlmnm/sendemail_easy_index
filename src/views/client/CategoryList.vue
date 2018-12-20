<template>
  <div class="app-container">
    <!-- 添加 -->
    <el-button v-waves class="filter-item" style="margin-left: 10px;margin-bottom: 20px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('category.add') }}</el-button>

    <tree-table :data="treeList" :eval-func="func" :eval-args="args" :expand-all="expandAll" border>
      <el-table-column :label="$t('category.id')" width = "200">
        <template slot-scope="scope">
          <span style="color:#409EFF">{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('category.name')">
        <template slot-scope="scope">
          <span style="color:sandybrown">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('category.description')">
        <template slot-scope="scope">
          <span style="color:sandybrown">{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('category.edit') }}</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">{{ $t('client.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </tree-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <!-- 类别名称 -->
        <el-form-item :label="$t('category.name')" prop="name">
          <el-input v-model="temp.name"/>
        </el-form-item>
        <!-- 类别所在的父类 -->
        <el-form-item :label="$t('category.parent_category')" prop="parent_id">
          <el-select v-model="temp.parent_id" filterable allow-create default-first-option placeholder="请选择父类">
            <el-option v-for="item in parentList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <!-- 描述 -->
        <el-form-item :label="$t('category.description')" prop="description">
          <el-input v-model="temp.description"/>
        </el-form-item>
        <!-- 排序 -->
        <el-form-item :label="$t('category.order')" prop="order">
          <el-tooltip class="item" effect="dark" content="1-10，数字越小，排序越靠前" placement="top">
            <el-input-number v-model="temp.order" :min="1" :max="10" label="描述文字"/>
          </el-tooltip>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
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
import { mapGetters } from 'vuex'

export default {
  name: 'CategoryList',
  directives: { waves },
  components: { treeTable },
  data() {
    return {
      func: treeToArray,
      expandAll: false,
      data: {},
      args: [null, null],
      // 添加和编辑弹出窗口
      // 弹出窗口的状态
      dialogStatus: '',
      // 弹出窗口表单的可见
      dialogFormVisible: false,
      textMap: {
        update: this.$t('category.update'),
        create: this.$t('category.create')
      },
      // 表单验证
      rules: {
        name: [{ required: true, message: 'type is required', trigger: 'change' }],
        parent_id: [{ required: true, message: 'timestamp is required', trigger: 'change' }],
        description: [{ required: true, message: 'title is required', trigger: 'blur' }],
        order: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      temp: {
        id: undefined,
        name: undefined,
        parent_id: undefined,
        description: undefined,
        order: undefined
      },
      // 删除弹出窗口
      dialogVisible: false
    }
  },
  computed: {
    ...mapGetters('category', {
      treeList: 'treeList',
      parentList: 'parentList'
    })
  },
  created() {
    this.$store.dispatch('category/getTreeList')
    this.$store.dispatch('category/getParentList')
  },
  methods: {
    message(row) {
      this.$message(row)
    },
    // 添加和编辑弹出窗口
    handleUpdate(row) {
      this.temp = {
        id: row.id,
        name: row.name,
        parent_id: row.parent_id,
        description: row.description,
        order: row.order
      }
      this.temp._method = 'put'
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 添加类别
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 删除类别
    handleDelete(row) {
      this.$confirm('此操作将永久删除该分类，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        const data = {
          id: row.id,
          _method: 'delete'
        }
        this.$store.dispatch('category/destoryCategory', data).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$store.dispatch('category/addCategory', this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'succes',
              duration: 2000
            })
          })
            .catch(function() {
              this.$notify.error({
                title: '失败',
                message: '创建成功'
              })
            })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          this.$store.dispatch('category/updateCategory', tempData).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
            .catch(() => {
              this.$notify.error({
                title: '成功',
                message: '更新成功'
              })
            })
        }
      })
    },
    handleClose(done) {
      this.$confirm('确认删除吗?').then(_ => {
        done()
      }).catch(_ => {})
    },
    resetTemp() {
      this.temp = {
        name: undefined,
        parent_id: undefined,
        description: undefined,
        order: undefined
      }
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
