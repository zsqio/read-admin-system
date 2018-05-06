<template>
    <div class="books-container container">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/books' }">图书管理</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="header">
            <el-input v-model="keyStore"
                prefix-icon="el-icon-search"
                autofocus
                placeholder="请输入图书名字进行搜索"
                clearable></el-input>
            <el-button type="primary"
                plain
                @click="searchStore">搜索</el-button>
        </div>
        <div class="content">
            <el-table :data="showData"
                 stripe
                style="width: 100%"
                v-loading="loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"
                refs="onshelfTable">
                <el-table-column label="封面"
                    width="120">
                    <template slot-scope="scope">
                        <img :src="scope.row.cover"
                        width="80"
                        alt="图书封面">
                    </template>
                    </el-table-column>
                        <el-table-column prop="name"
                            label="书名">
                        </el-table-column>
                        <el-table-column prop="isbn"
                             label="ISBN">
                        </el-table-column>

                        <el-table-column prop="author"
                            label="作者">
                        </el-table-column>
                        <el-table-column prop="publisher"
                            label="出版社">
                        </el-table-column>
                        <el-table-column prop="score"
                                       label="评分(0-10分)">
                        </el-table-column>
                        <el-table-column prop="desc"
                            label="简介"
                            show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="tag"
                                         label="标签"
                                         show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column width="80"
                            label="操作">
                            <template slot-scope="scope">
                                <el-button
                                    type="primary"
                                    plain
                                    @click="offshelf(scope.row.name)">下架</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="pagination-box">
                    <el-pagination
                      background
                      layout="prev, pager, next"
                      :total="bookData.length"
                      :pageSize="pageSize"
                      :current-page="currentPage"
                      @current-change="handleCurrentChange"
                    >
                    </el-pagination>
                </div>        
    </div>
</template>
<script>
import Store from 'store2'
import { Loading } from '../assets/js/mixins'
import { api } from '@/config'

export default {
    name: 'books',
    mixins: [Loading],
    data() {
        return {
            tabActive: 'store',
            key: '',
            keyStore: '',
            recordList: [],
            bookData: [],
            showData: [],
            pageSize: 5,
            currentPage: 1,
        }
    },
    methods: {
      //录入图书信息
        onSubmit() {
            if(!this.form.name || !this.form.cover || !this.form.author || !this.form.publisher || !this.form.desc) {
                this.$message.error('请填写必要的信息')
                return 
            }
            this.http.post(`${api.bookApi}/record`, this.form)
                .then(res => {
                if (res.data.result) {
                    this.$message.success('录入成功')
                    this.form = {}
                } else {
                    this.$message.error(res.data.msg)
                }
            })
            .catch(error => {
                this.$message.error(error)
            })
        },
        tabChange() {
            if (this.tabActive === 'store') {
                this.$nextTick(() => {
                    this.getBookData()
                })
            }
        },
        filterChange() {
            this.getBookData()
        },

        //搜索图书信息
        searchStore() {
            this.showLoading()
            this.http.get(`${api.bookApi}/search`, {
                params: {
                    name: this.keyStore
                }
            }).then(res => {
                if (res.data.result) {
                    this.bookData = res.data.data
                    this.showData = this.bookData
                } else {
                    this.$message.error()
                }
                this.hideLoading()
            }).catch(err => {
                this.hideLoading()
                this.$message.error(err)
            })
        },
        //获取图书列表
        getBookData() {
            this.showLoading()
            this.http.get(`${api.bookApi}/all`, {
                params: {}
            }).then(res => {
                if (res.data.result) {
                    const data = res.data.data
                    data.forEach((item, index) => {
                        item.tag = item.tag.toString()
                    })
                    this.bookData = res.data.data
                  if(this.bookData.length > this.pageSize) {
                      this.showData = this.bookData.slice(0,this.pageSize)
                  } else {
                      this.showData = this.bookData
                  }
                } else {
                    this.$message.error('查询失败')
                }
                this.hideLoading()
            }).catch(() => {
                this.hideLoading()
                this.$message.error('error')
            })
        },
        refreshList() {
            this.getBookData()
        },

        //图书下架
        offshelf(name) {
            this.$confirm('是否确认下架该图书？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.http.post(`${api.bookApi}/offshelf`, { name })
                    .then(res => {
                        if (res.data.result) {
                            this.$message.success('该图书已经成功下架')
                            this.refreshList()
                        } else {
                            this.$message.success(`操作失败: ${res.data.msg}`)
                        }
                    })
                    .catch(error => {
                        this.$message.error(error)
                    })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消下架该图书'
                })
            })
        },
        //分页
        handleCurrentChange(index) {
            this.showData = this.bookData.slice((index-1)*this.pageSize, index*this.pageSize)
        },
    },
    created() {
        if (Store.get('isLogin') === 0) {
            this.$router.push('/login')
        }
    },
    mounted() {
        this.getBookData()
    }
}
</script>
<style lang="scss" scoped>
  .pagination-box {
      width: 50%;
      margin: 20px auto;
  }
  .el-tab-panel .el-input {
      width: 600px;
      display: block;
  }
</style>
