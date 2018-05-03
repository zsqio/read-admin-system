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
                        <el-table-column prop="tag[1]"
                                         label="标签">
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
            </el-tab-pane>
            <el-tab-pane label="录入"
                name="recording">
                <el-form :model="form"
                         :rules="rules"
                         ref="recordForm"
                >
                  <el-form-item label="图书名称:" prop="name">
                    <el-input v-model="form.name"
                              placeholder="必填"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="图书外文名称:" prop="engName">
                    <el-input v-model="form.engName"
                              placeholder="选填"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="ISBN:" prop="isbn">
                    <el-input v-model="form.isbn"
                                  placeholder="必填">
                    </el-input>
                  </el-form-item>
                  <el-form-item label="封面地址:" prop="cover">
                    <el-input v-model="form.cover"
                              placeholder="必填"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="作者:" prop="author">
                    <el-input v-model="form.author"
                              placeholder="必填"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="出版信息:" prop="publisher">
                    <el-input v-model="form.publisher"
                              placeholder="必填"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="评分:" prop="score">
                    <el-input v-model="form.score"
                              placeholder="必填"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="分类:" prop="tag">
                    <el-cascader
                      :options="tagOptions"
                      v-model="form.tag">
                    </el-cascader>
                  </el-form-item>
                  <el-form-item label="图书简介:" prop="desc">
                    <el-input type="textarea"
                              v-model="form.desc"
                              placeholder="必填"
                    ></el-input>
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
            keyStore: '',
            recordList: [],
            bookData: [],
            showData: [],
            pageSize: 5,
            currentPage: 1,
            form: {
                name: '',
                engName: '',
                isbn: '',
                cover: '',
                author: '',
                publisher: '',
                score: 0,
                tag: [],
                desc: '',
            },
            rules: {
                name: [
                    { required: true, message: '请填写图书名称', trigger: 'blur' }
                ],
                isbn: [
                    { required: true, message: '请填写ISBN', trigger: 'blur' }
                ],
                cover: [
                    { required: true, message: '请填写图书封面地址', trigger: 'blur' }
                ],
                author: [
                    { required: true, message: '请填写作者', trigger: 'blur' },
                ],
                publisher: [
                    { required: true, message: '请填写出版社', trigger: 'blur' }
                ],
                score: [
                    { required: true, message: '请填写评分', trigger: 'blur' }
                ],
                desc: [
                    { required: true, message: '请填写图书简介', trigger: 'blur' },
                    { min: 2, max: 30, message: '长度在 2 到 30个字符', trigger: 'blur'}
                ]
            },
            tagOptions: [
                {
                    value: '文学',
                    label: '文学',
                    children: [
                        {
                          value: '小说',
                          label: '小说'
                        },
                        {
                          value: '外国文学',
                          label: '外国文学'
                        },
                        {
                          value: '文学',
                          label: '文学'
                        },
                        {
                          value: '随笔',
                          label: '随笔'
                        },
                        {
                          value: '诗歌',
                          label: '诗歌'
                        },
                        {
                          value: '童话',
                          label: '童话'
                        },
                    ]
                },
                {
                    value: '流行',
                    label: '流行',
                    children: [
                        {
                            value: '漫画',
                            label: '漫画'
                        },
                        {
                            value: '绘本',
                            label: '绘本'
                        },
                        {
                            value: '青春',
                            label: '青春'
                        },
                        {
                            value: '科幻',
                            label: '科幻'
                        },
                        {
                            value: '悬疑',
                            label: '悬疑'
                        },
                        {
                            value: '言情',
                            label: '言情'
                        },
                        {
                            value: '武侠',
                            label: '武侠'
                        },
                  ]
                },
                {
                    value: '历史文化',
                    label: '历史文化',
                    children: [
                        {
                            value: '历史',
                            label: '历史'
                        },
                        {
                            value: '心理学',
                            label: '心理学'
                        },
                        {
                            value: '哲学',
                            label: '哲学'
                        },
                        {
                            value: '文化',
                            label: '文化'
                        },
                        {
                            value: '建筑',
                            label: '建筑'
                        },
                        {
                            value: '宗教',
                            label: '宗教'
                        },
                        {
                            value: '国学',
                            label: '国学'
                        },
                    ]
                },
                {
                    value: '生活',
                    label: '生活',
                    children: [
                        {
                            value: '爱情',
                            label: '爱情'
                        },
                        {
                            value: '旅行',
                            label: '旅行'
                        },
                        {
                            value: '养生',
                            label: '养生'
                        },
                        {
                            value: '摄影',
                            label: '摄影'
                        },
                        {
                            value: '女性',
                            label: '女性'
                        },
                        {
                            value: '家居',
                            label: '家居'
                        },
                    ]
                },

            ]

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
            this.http.get(`${api.bookApi}/list`, {
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
            this.http.get(`${api.bookApi}/list`, {
                params: {
                    name: this.keyStore
                }
            }).then(res => {
                if (res.data.result) {
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
