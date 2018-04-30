<template>
    <div class="books-container container">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/books' }">图书管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-tabs v-model="tabActive"
            @tab-click="tabChange">
            <el-tab-pane label="馆存"
                name="store">
                <div class="header">
                    <el-select v-model="status"
                        placeholder="筛选"
                        @change="filterChange">
                        <el-option v-for="item in bookStatus"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
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
                    <el-table :data="bookData"
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
                        <el-table-column prop="author"
                            label="作者">
                        </el-table-column>
                        <el-table-column prop="publisher"
                            label="出版社">
                        </el-table-column>
                        <el-table-column prop="score"
                                       label="评分">
                        </el-table-column>
                        <el-table-column prop="desc"
                            label="简介"
                            show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column width="80"
                            label="操作">
                            <template slot-scope="scope">
                                <el-button v-show="scope.row.status === 1"
                                    type="text"
                                    @click="offshelf(scope.row.title)">下架</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-tab-pane>
            <el-tab-pane label="录入"
                name="recording">
                <el-form :model="form">
                  <el-form-item label="图书名称:">
                    <el-input v-model="form.name"></el-input>
                  </el-form-item>
                  <el-form-item label="图书英文名称:">
                    <el-input v-model="form.engName"></el-input>
                  </el-form-item>
                  <el-form-item label="封面地址:">
                    <el-input v-model="form.cover"></el-input>
                  </el-form-item>
                  <el-form-item label="作者:">
                    <el-input v-model="form.author"></el-input>
                  </el-form-item>
                  <el-form-item label="出版信息:">
                    <el-input v-model="form.publisher"></el-input>
                  </el-form-item>
                  <el-form-item label="评分:">
                    <el-input v-model="form.score"></el-input>
                  </el-form-item>
                  <el-form-item label="图书简介:">
                    <el-input type="textarea" v-model="form.desc"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="onSubmit">录入图书</el-button>
                    <el-button>取消</el-button>
                  </el-form-item>
                </el-form>

            </el-tab-pane>
        </el-tabs>
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
            keyStore: [],
            recordList: [],
            form: {
              name: '',
              engName: '',
              cover: '',
              author: '',
              publisher: '',
              score: 0,
              desc: '',
            }

        }
    },
    methods: {
      //录入图书信息
        onSubmit() {
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
        searchStore() {
            this.showLoading()
            this.http.get(`${api.bookApi}/list`, {
                params: {
                    name: this.keyStore
                }
            }).then(res => {
                if (res.data.result) {
                    this.bookData = res.data.data
                } else {
                    this.$message.error()
                }
                this.hideLoading()
            }).catch(err => {
                this.hideLoading()
                this.$message.error(err)
            })
        },
        getBookData() {
            this.showLoading()
            this.http.get(`${api.bookApi}/list`, {
                params: {
                    name: this.keyStore
                }
            }).then(res => {
                if (res.data.result) {
                    this.bookData = res.data.data
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
            this.getBookData(this.status)
        },
        offshelf(title) {
            this.$confirm('是否确认下架该图书？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.http.post(`${api.bookApi}/offshelf`, { title })
                    .then(res => {
                        if (res.data.result) {
                            this.$message.success('操作成功')
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
                    message: '已取消删除'
                })
            })
        }
    },
    created() {
        if (Store.get('isLogin') === 0) {
            this.$router.push('/login')
        }
    },
    mounted() {
        this.getBookData(0)
    }
}
</script>
<style lang="scss" scoped>

</style>
