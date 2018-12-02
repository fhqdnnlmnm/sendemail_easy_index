<template>
  <!-- 带_的变量为内部中间变量 -->
  <div class="app-container">
    <div class="filter-container">
      <!-- 公司名称 -->
      <el-input :placeholder="$t('client.companyName')" v-model="listQuery.companyName" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <!-- 大类 大类不需要作为查询条件，仅仅是作为级联选择-->
      <el-select :placeholder="$t('client.pCat')" v-model="pcat" style="width: 90px" class="filter-item" @change="handlepCat">
        <el-option v-for="item in pCats" :key="item.id" :label="item.cat_name" :value="item.id"/>
      </el-select>
      <!-- 小类 -->
      <el-select v-model="listQuery.cat" :placeholder="$t('client.cat')" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in cats" :key="item.id" :label="item.cat_name" :value="item.id"/>
      </el-select>
      <!-- 排序 -->
      <!-- <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key"/>
      </el-select> -->
      <!-- 搜索 -->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('client.search') }}</el-button>
      <!-- 添加 -->
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('client.add') }}</el-button>
      <!-- 导出 -->
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">{{ $t('client.export') }}</el-button>
      <!-- 审核人 -->
      <!-- <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">{{ $t('client.reviewer') }}</el-checkbox> -->
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange">
      <!-- 公司ID -->
      <el-table-column :label="$t('client.id')" prop="id" sortable="custom" align="center" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <!-- 公司名称 -->
      <el-table-column :label="$t('client.name')" width="150px" prop="name" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <!-- 公司所在国家 -->
      <el-table-column :label="$t('client.country')" prop="country" min-width="150px">
        <template slot-scope="scope">
          <!-- 弹出框修改标题 -->
          <!-- <span class="link-type" @click="handleUpdate(scope.row)">{{ scope.row.title }}</span> -->
          <!-- <el-tag>{{ scope.row.type | typeFilter }}</el-tag> -->
          <span>{{ scope.row.country }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column :label="$t('client.author')" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showReviewer" :label="$t('client.reviewer')" width="110px" align="center">
        <template slot-scope="scope">
          <span style="color:red;">{{ scope.row.reviewer }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('client.importance')" width="80px">
        <template slot-scope="scope">
          <svg-icon v-for="n in +scope.row.importance" :key="n" icon-class="star" class="meta-item__icon"/>
        </template>
      </el-table-column>
      <el-table-column :label="$t('client.readings')" align="center" width="95">
        <template slot-scope="scope">
          <span v-if="scope.row.pageviews" class="link-type" @click="handleFetchPv(scope.row.pageviews)">{{ scope.row.pageviews }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('client.status')" class-name="status-col" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column :label="$t('client.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('client.edit') }}</el-button>
          <!-- <el-button v-if="scope.row.status!='published'" size="mini" type="success" @click="handleModifyStatus(scope.row,'published')">{{ $t('client.publish') }}
          </el-button> -->
          <!-- <el-button v-if="scope.row.status!='draft'" size="mini" @click="handleModifyStatus(scope.row,'draft')">{{ $t('client.draft') }}
          </el-button> -->
          <el-button v-if="scope.row.status!='deleted'" size="mini" type="danger" @click="handleDelete(scope.row)">{{ $t('client.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" /> -->

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <!-- 公司名字 -->
        <el-form-item :label="$t('client.name')" prop="name">
          <el-input v-model="temp.name"/>
        </el-form-item>
        <!-- 公司所在国家 -->
        <el-form-item :label="$t('client.country')" prop="country">
          <el-select v-model="temp.country" filterable allow-create default-first-option placeholder="请选择国家">
            <el-option v-for="item in country_list" :key="item.country" :label="item.country" :value="item.country" />
          </el-select>
        </el-form-item>
        <!-- 公司所在类别 -->
        <el-form-item :label="$t('category.category')" prop="category">
          <!-- 大类 大类不需要作为查询条件，仅仅是作为级联选择-->
          <el-select :placeholder="$t('client.pCat')" v-model="temp.catid.par_id" style="width: 90px" class="filter-item" @change="handlepCat">
            <el-option v-for="item in pCats" :key="item.id" :label="item.cat_name" :value="item.id"/>
          </el-select>
          <!-- 小类 -->
          <el-select v-model="temp.cat_id" :placeholder="$t('client.cat')" clearable class="filter-item" style="width: 130px">
            <el-option v-for="item in cats" :key="item.id" :label="item.cat_name" :value="item.id"/>
          </el-select>
        </el-form-item>
        {{ temp }}
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
import { companies, cats, countryList, createCompany, updataCompany, deleteCompany } from '@/api/emailsend'
import waves from '@/directive/waves' // 导入vue指令

export default {
  name: 'ClientList',
  directives: { waves },
  data() {
    return {
      listLoading: true,
      downloadLoading: false,
      list: undefined,
      // 当前id的最大值
      total: undefined,
      // 客户筛选条件
      listQuery: {
        page: undefined,
        companyName: undefined,
        // limit: 20,
        // importance: undefined,
        // title: undefined,
        // type: undefined,
        // sort: '+id',
        cat: undefined
      },
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
      // 新增公司的初始参数
      temp: {
        id: undefined,
        name: undefined,
        country: undefined,
        cat_id: undefined,
        catid: {}
      },
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
  },
  created() {
    this.getList()
    this.getCatList()
    this.getCountryList()
  },
  methods: {
    // 获取公司的清单
    getList() {
      companies(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.meta.total
        // console.log(this.total)
        // Just to simulate the time of the request
        this.listLoading = false
      })
    },
    // 获取大类别的清单
    getCatList() {
      cats().then(response => {
        this.catList = response.data.data
        this.pCats = this.catList.filter(v => v.par_id === 0)
      })
    },
    // 获取国家列表
    getCountryList() {
      countryList().then(response => {
        this.country_list = response.data
      })
    },
    // 根据大类别获取小类别的清单
    handlepCat(data) {
      this.cats = this.catList.filter(v => v.par_id === data)
    },
    // 搜索
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 新增公司
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 删除公司
    handleDelete(row) {
      row._method = 'delete'
      deleteCompany(row).then(() => {
        for (const v of this.list) {
          if (v.id === row.id) {
            const index = this.list.indexOf(v)
            this.list.splice(index, 1)
            break
          }
        }
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    // 导出
    handleDownload() {
    },
    // 编辑
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp._method = 'put'
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    sortChange() {
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createCompany(this.temp).then(() => {
            this.total += 1
            this.temp.id = this.total
            this.list.unshift(this.temp)
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
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updataCompany(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
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
    resetTemp() {
      this.temp = {
        id: undefined,
        name: undefined,
        country: undefined,
        cat_id: undefined,
        catid: {}
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
