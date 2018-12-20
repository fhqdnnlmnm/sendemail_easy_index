<template>
  <!-- 带_的变量为内部中间变量 -->
  <div class="app-container">
    <div class="filter-container">
      <!-- 公司名称 -->
      <el-input :placeholder="$t('customer.name')" v-model="listQuery.name" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <!-- 大类 大类不需要作为查询条件，仅仅是作为级联选择-->
      <el-select :placeholder="$t('customer.parent_catogory')" v-model="parent_catogory_id" style="width: 90px" class="filter-item" >
        <el-option v-for="item in parentList" :key="item.id" :label="item.name" :value="item.id"/>
      </el-select>
      <!-- 小类 -->
      <el-select v-model="listQuery.category_id" :placeholder="$t('customer.category')" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in subList(parent_catogory_id)" :key="item.id" :label="item.name" :value="item.id"/>
      </el-select>
      <!-- 排序 -->
      <!-- <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key"/>
      </el-select> -->
      <!-- 搜索 -->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('customer.search') }}</el-button>
      <!-- 添加 -->
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('customer.add') }}</el-button>
      <!-- 导入 -->
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">{{ $t('customer.import') }}</el-button>
      <!-- 导出 -->
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-upload" @click="handleDownload">{{ $t('customer.export') }}</el-button>
      <!-- <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">{{ $t('client.reviewer') }}</el-checkbox> -->
    </div>

    <el-table
      v-loading="customersLoadStatus==2? false:true"
      :data="customers"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange">
      <!-- 公司ID -->
      <el-table-column :label="$t('customer.id')" prop="id" sortable="custom" align="center" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <!-- 公司名称 -->
      <el-table-column :label="$t('customer.name')" width="150px" prop="name" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <!-- 公司所在国家 -->
      <el-table-column :label="$t('customer.country')" prop="country" min-width="150px">
        <template slot-scope="scope">
          <!-- 弹出框修改标题 -->
          <!-- <span class="link-type" @click="handleUpdate(scope.row)">{{ scope.row.title }}</span> -->
          <!-- <el-tag>{{ scope.row.type | typeFilter }}</el-tag> -->
          <span>{{ scope.row.country }}</span>
        </template>
      </el-table-column>
      <!-- 所在类别 -->
      <el-table-column :label="$t('customer.category_info')" prop="country" min-width="150px">
        <template slot-scope="scope">
          <!-- 弹出框修改标题 -->
          <!-- <span class="link-type" @click="handleUpdate(scope.row)">{{ scope.row.title }}</span> -->
          <!-- <el-tag>{{ scope.row.type | typeFilter }}</el-tag> -->
          <span>{{ catetoryInfo(scope.row.category_info) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('customer.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('customer.edit') }}</el-button>
          <el-button v-if="scope.row.status!='deleted'" size="mini" type="danger" @click="handleDelete(scope.row)">{{ $t('customer.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" /> -->

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="customer" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <!-- 公司名字 -->
        <el-form-item :label="$t('client.name')" prop="name">
          <el-input v-model="temp.name"/>
        </el-form-item>
        <!-- 公司所在国家 -->
        <el-form-item :label="$t('client.country')" prop="country">
          <el-select v-model="temp.country" filterable allow-create default-first-option placeholder="请选择国家">
            <el-option v-for="item in countries" :key="item.country" :label="item.country" :value="item.country" />
          </el-select>
        </el-form-item>
        <!-- 公司所在类别 -->
        <el-form-item :label="$t('customer.category')" prop="category">
          <!-- 大类 大类不需要作为查询条件，仅仅是作为级联选择-->
          <el-select :placeholder="$t('client.pCat')" v-model="temp.category_info.parent_id" style="width: 90px" class="filter-item" @change="handlepCat">
            <el-option v-for="item in parentList" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
          <!-- 小类 -->
          <el-select v-model="temp.category_id" :placeholder="$t('client.cat')" clearable class="filter-item" style="width: 130px">
            <el-option v-for="item in subList(temp.category_info.parent_id)" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </el-form-item>
        {{ temp }}
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
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ClientList',
  directives: { waves },
  data() {
    return {
      parent_catogory_id: undefined,
      // 客户筛选条件
      listQuery: {
        page: undefined,
        name: undefined,
        category_id: undefined
      },
      // 新增公司的初始参数
      temp: {
        id: undefined,
        name: undefined,
        country: undefined,
        category_id: undefined,
        category_info: {}
      },
      downloadLoading: false,
      // 当前id的最大值
      total: undefined,

      // 所有类别清单

      catList: undefined,
      // 客户大类,从API获取
      pCats: undefined,
      // 选择框选中的大类
      pcat: undefined,
      // 客户小类
      cats: undefined,
      // 2. 表单的相关数据
      // 2.1 国家列表
      country_list: [],
      // ---  新增公司的相关数据 -----

      addCom: {
        pcat: undefined
      },
      // 弹出窗口的状态
      dialogStatus: '',
      // 弹出窗口表单的可见
      dialogFormVisible: false,
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      // 表单验证
      rules: {
        name: [{ required: true, message: 'type is required', trigger: 'change' }],
        country: [{ required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters('customer', {
      customers: 'customers',
      customersLoadStatus: 'customersLoadStatus',
      countries: 'countries'
    }),
    ...mapGetters('category', {
      parentList: 'parentList',
      categories: 'list',
      subList: 'subList',
      catetoryInfo: 'categoryInfo'
    })
  },
  created() {
    this.$store.dispatch('customer/getCustomers')
    this.$store.dispatch('customer/getCountries')
    this.$store.dispatch('category/getList')
    this.$store.dispatch('category/getParentList')
    // this.getList()
    // this.getCatList()
    // this.getCountryList()
  },
  methods: {
    ...mapActions('customer', {

    }),
    // 搜索
    handleFilter() {
      this.$store.dispatch('customer/getCustomers', this.listQuery)
    },
    // 新增公司
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['customer'].clearValidate()
      })
    },
    createData() {
      this.$refs['customer'].validate((valid) => {
        if (valid) {
          this.$store.dispatch('customer/addCustomer', this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp._method = 'put'
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['customer'].clearValidate()
      })
    },
    handlepCat() {
      this.temp.category_id = null
    },
    updateData() {
      this.$refs['customer'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          this.$store.dispatch('customer/updateCustomer', tempData).then(() => {
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
                title: '失账',
                message: '更新失败'
              })
            })
        }
      })
    },
    handleDelete(row) {
      row._method = 'delete'
      this.$store.dispatch('customer/destroyCustomer', row.id).then(() => {
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

    // 删除公司

    // 导出
    handleDownload() {
    },
    // 编辑

    sortChange() {
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: undefined,
        country: undefined,
        category_id: undefined,
        category_info: { parent_id: undefined, id: undefined }
      }
    }
  }
}
</script>

<style scoped>
.filter-container {
  margin-bottom: 20px
}
</style>
