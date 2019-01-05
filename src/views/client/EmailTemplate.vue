<template>
  <div class="app-container">
    <el-button v-waves class="filter-item" style="margin-left: 10px;margin-bottom: 20px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('emailtemplate.add') }}</el-button>

    <el-table
      v-loading="templateListLoadStatus ===2 ? false:true"
      :data="templateList"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange">
      <!-- 邮件模板ID -->
      <el-table-column :label="$t('emailtemplate.id')" prop="id" sortable="custom" align="center" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <!-- 邮件模板名称 -->
      <el-table-column :label="$t('emailtemplate.name')" width="150px" prop="name" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <!-- 邮件模板描述-->
      <el-table-column :label="$t('emailtemplate.description')" prop="des" min-width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <!-- 邮件模板主题 -->
      <el-table-column :label="$t('emailtemplate.subject')" prop="des" min-width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.subject }}</span>
        </template>
      </el-table-column>
      <!-- 邮件模板内容 -->
      <el-table-column :label="$t('emailtemplate.content')" prop="des" min-width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.content }}</span>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column :label="$t('client.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('emailtemplate.edit') }}</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">{{ $t('emailtemplate.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- <div style = "margin-top:20px">
      <tinymce :height= "300" v-model="content"/>
    </div> -->
    <div class="editor-content" v-html="content"/>
    <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" /> -->

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <!-- 类别名称 -->
        <el-form-item :label="$t('emailtemplate.name')" prop="name">
          <el-input v-model="temp.name"/>
        </el-form-item>
        <el-form-item :label="$t('emailtemplate.description')" prop="description">
          <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model="temp.description" type="textarea" placeholder="Please input"/>
        </el-form-item>
        <el-form-item :label="$t('emailtemplate.subject')" prop="subject">
          <el-input v-model="temp.subject"/>
        </el-form-item>
        <el-form-item :label="$t('emailtemplate.content')" prop="content" style="width:80%">
          <tinymce v-model="temp.content"/>
          <!-- <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model="temp.content" type="textarea" placeholder="Please input"/> -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

    <!-- <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel"/>
        <el-table-column prop="pv" label="Pv"/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog> -->

  </div>
</template>

<script>
import waves from '@/directive/waves' // 导入vue指令
import Tinymce from '@/components/Tinymce'
import { mapGetters } from 'vuex'

export default {
  name: 'SenderList',
  directives: { waves },
  components: { Tinymce },
  data() {
    return {
      // 添加和编辑弹出窗口
      // 弹出窗口的状态
      dialogStatus: '',
      // 弹出窗口表单的可见
      dialogFormVisible: false,
      temp: {
        id: undefined,
        name: undefined,
        description: undefined,
        subject: undefined,
        content: undefined
      },
      textMap: {
        update: this.$t('category.update'),
        create: this.$t('category.create')
      },
      // 表单验证
      rules: {
        name: [{ required: true, message: 'type is required', trigger: 'change' }],
        subject: [{ required: true, message: 'timestamp is required', trigger: 'change' }],
        description: [{ required: true, message: 'title is required', trigger: 'blur' }],
        content: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      content: undefined,
      listLoading: true,
      downloadLoading: false,
      list: undefined,
      sortChange: false
    }
  },
  computed: {
    ...mapGetters('emailTemplate', {
      templateList: 'templateList',
      templateListLoadStatus: 'templateListLoadStatus'
    })
  },
  created() {
    this.$store.dispatch('emailTemplate/getTemplateList')
  },
  methods: {
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$store.dispatch('emailTemplate/addTemplate', this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'succes',
              duration: 2000
            })
          })
            .catch(() => {
              this.$notify.error({
                title: '失败',
                message: '创建成功'
              })
            })
        }
      })
    },
    handleUpdate(row) {
      this.temp = {
        id: row.id,
        name: row.name,
        description: row.description,
        subject: row.subject,
        content: row.content,
        _method: 'put'
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          this.$store.dispatch('emailTemplate/updateTemplate', tempData).then(() => {
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
    handleDelete(row) {
      row._method = 'delete'
      this.$store.dispatch('emailTemplate/destroyTemplate', row).then(() => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      }).catch(() => {
        this.$notify.error({
          title: '失账',
          message: '更新失败'
        })
      })
    },
    resetTemp() {
      this.temp = {

      }
    }
  }
}
</script>
