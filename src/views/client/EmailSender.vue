<template>
  <div class="app-container">
    <el-button v-waves class="filter-item" style="margin-left: 10px;margin-bottom: 20px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('emailsender.add') }}</el-button>

    <el-table
      v-loading="emailSenderListLoadStatus ==2 ? false:true"
      :data="emailSenderList"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange">
      <!-- 发件人ID -->
      <el-table-column :label="$t('emailsender.id')" prop="id" sortable="custom" align="center" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <!-- 发件人邮箱 -->
      <el-table-column :label="$t('emailsender.email')" width="150px" prop="email" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <!-- 描述-->
      <el-table-column :label="$t('emailsender.description')" prop="des" min-width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column :label="$t('emailsender.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('emailsender.edit') }}</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">{{ $t('client.delete') }}
        </el-button></template>
      </el-table-column>
    </el-table>

    <!-- 弹出窗口 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <!-- 发件人邮箱 -->
        <el-form-item :label="$t('emailsender.email')" prop="email">
          <el-input v-model="temp.email"/>
        </el-form-item>
        <!-- 描述 -->
        <el-form-item :label="$t('emailsender.description')" prop="description">
          <el-input v-model="temp.description"/>
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
import waves from '@/directive/waves' // 导入vue指令
import { mapGetters } from 'vuex'
export default {
  name: 'EmailSender',
  directives: { waves },
  data() {
    return {
      downloadLoading: false,
      sortChange: false,
      // 弹出窗口的状态
      dialogStatus: '',
      // 弹出窗口表单的可见
      dialogFormVisible: false,
      textMap: {
        update: this.$t('category.update'),
        create: this.$t('category.create')
      },
      rules: {
        email: [{ required: true, message: 'email is required', trigger: 'blur' }],
        description: [{ required: true, message: 'description is required', trigger: 'blur' }]
      },
      temp: {
        id: undefined,
        email: undefined,
        description: undefined
      }
    }
  },
  computed: {
    ...mapGetters('emailSender', {
      emailSenderList: 'emailSenderList',
      emailSenderListLoadStatus: 'emailSenderListLoadStatus'
    })
  },
  created() {
    this.$store.dispatch('emailSender/getEmailSenderList')
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
          this.$store.dispatch('emailSender/addEmailSender', this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success'
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = {
        id: row.id,
        email: row.email,
        description: row.description,
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
          this.$store.dispatch('emailSender/updateEmailSender', tempData).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      const data = {
        id: row.id,
        _method: 'delete'
      }
      this.$store.dispatch('emailSender/destroyEmailSender', data).then(() => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success'
        })
      })
    },
    resetTemp() {
      this.temp = {
        email: undefined,
        description: undefined
      }
    }
  }
}
</script>
