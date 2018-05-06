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
                        <el-table-column prop="author"
                            label="作者">
                        </el-table-column>
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
                        <el-table-column width="200"
                            label="操作">
                            <template slot-scope="scope">
                                <el-button
                                    type="primary"
                                    plain
                                   @click="editBook(scope.row.name)">编辑</el-button>
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

        <el-dialog title="编辑详情"
            :visible.sync="showModal"
            width="50%">
        <el-form :model="detailInfo"
            ref="detailForm">
            <el-form-item label="图书名称:" prop="name">
                <el-input v-model="detailInfo.name"
                    placeholder="必填">
                </el-input>
            </el-form-item>
            <el-form-item label="图书外文名称:" prop="engName">
                <el-input v-model="detailInfo.engName"
                    placeholder="选填">
                </el-input>
            </el-form-item>
            <el-form-item label="ISBN:" prop="isbn">
                <el-input v-model="detailInfo.isbn"
                    placeholder="必填">
                </el-input>
            </el-form-item>
            <el-form-item label="封面地址:" prop="cover">
                <el-input v-model="detailInfo.cover"
                    placeholder="必填">
                </el-input>
            </el-form-item>
            <el-form-item label="作者:" prop="author">
                <el-input v-model="detailInfo.author"
                    placeholder="必填">
                </el-input>
            </el-form-item>
            <el-form-item label="作者简介:" prop="authorIntro">
                    <el-input type="textarea"
                        v-model="detailInfo.authorIntro"
                        placeholder="必填">
                    </el-input>
                </el-form-item>
            <el-form-item label="出版信息:" prop="publisher">
                <el-input v-model="detailInfo.publisher"
                    placeholder="必填">
                </el-input>
            </el-form-item>
            <el-form-item label="评分:" prop="score">
                <el-input v-model="detailInfo.score"
                    placeholder="必填">
                </el-input>
            </el-form-item>
                <el-form-item label="标签:" prop="tag">
                    <el-tag
                        :key="tag"
                        v-for="tag in detailInfo.tag"
                        closable
                        :disable-transitions="false"
                        @close="handleClose(tag)">
                        {{tag}}
                    </el-tag>
                    <el-input
                        class="input-new-tag"
                        v-if="inputVisible"
                        v-model="inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm"
                        @blur="handleInputConfirm">
                    </el-input>
                    <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                </el-form-item>
                <el-form-item label="书评:" prop="desc">
                    <el-input type="textarea"
                        v-model="detailInfo.desc"
                        placeholder="必填">
                    </el-input>
                </el-form-item>
                <el-form-item prop="bookIntro" label="内容简介:">
                    <el-input v-model="detailInfo.bookIntro"
                              type="textarea"
                              placeholder="请输入内容简介"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">确认修改</el-button>
                    <el-button @click="cancel">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>      
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
            detailInfo: {},
            showModal: false,
            inputVisible: false,
            inputValue: '',
        }
    },
    methods: {
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
                    const data = res.data.data
                    this.bookData = data
                    this.showData = data
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
                        item.score = `${item.score}分`
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
            this.$confirm(`确定要下架图书《${name}》吗？`, '提示', {
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
        editBook(name) {
            this.detailInfo.name = name
            this.showModal = true
            this.http.get(`${api.bookApi}/search`, {
                params: {
                    name: name
                }
            }).then(res => {
                if (res.data.result) {
                    const data = res.data.data
                    this.detailInfo = data[0]
                } else {
                    this.$message.error()
                }
                this.hideLoading()
            }).catch(err => {
                this.hideLoading()
                this.$message.error(err)
            })
        },
        cancel() {
            this.showModal = false
        },
        onSubmit() {
            if(!this.detailInfo.authorIntro || !this.detailInfo.bookIntro) {
                this.$message.error('请填写必要的信息')
                return
            }
            this.http.post(`${api.bookApi}/update`, this.detailInfo)
                .then(res => {
                    if (res.data.result) {
                        this.$message.success('编辑成功')
                        this.detailInfo= {}
                        this.showModal = false
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
                .catch(error => {
                    this.$message.error(error)
                })
        },
        handleClose(tag) {
            this.detailInfo.tag.splice(this.detailInfo.tag.indexOf(tag), 1);
        },
        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
       },
       handleInputConfirm() {
            let inputValue = this.inputValue;
            if (inputValue) {
                this.detailInfo.tag.push(inputValue);
            }
            this.inputVisible = false;
            this.inputValue = '';
      }
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
