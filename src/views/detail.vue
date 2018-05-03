<template>
    <div class="detail-container container">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/detail' }">详情管理</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="header">
            <el-input v-model="keyWords"
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
                <el-table-column width="80"
                                 label="操作">
                    <template slot-scope="scope">
                        <el-button
                                type="primary"
                                plain
                                @click="editBook(scope.row.name)">编辑详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog title="编辑详情"
                   :visible.sync="showModal"
                   width="35%">
            <el-form :model="detailInfo"
                     ref="detailForm">
                <el-form-item prop="name" label="书名:">
                    <el-input v-model="detailInfo.name"
                              type="text"
                              ></el-input>
                </el-form-item>
                <el-form-item prop="authorIntro" label="作者简介:">
                    <el-input v-model="detailInfo.authorIntro"
                              type="textarea"
                              placeholder="请输入作者简介"></el-input>
                </el-form-item>
                <el-form-item prop="bookIntro" label="图书简介:">
                    <el-input v-model="detailInfo.bookIntro"
                              type="textarea"
                              placeholder="请输入图书简介"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">录入图书详情</el-button>
                    <el-button @click="cancel">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import { api } from '@/config'
    import Store from 'store2'

    export default {
        name: 'detail',
        data() {
            return {
                bookData:[],
                keyWords: '',
                detailInfo: {
                    name:'',
                    authorIntro: '',
                    bookIntro: ''
                },
                showModal: false,
            }
        },
        methods: {
            searchStore() {
                this.http.get(`${api.bookApi}/list`, {
                    params: {
                        name: this.keyWords
                    }
                }).then(res => {
                    if (res.data.result) {
                        this.bookData = res.data.data
                    } else {
                        this.$message.error()
                    }
                }).catch(err => {
                    this.$message.error(err)
                })
            },
            editBook(name) {
                this.detailInfo.name = name
                this.showModal = true
            },
            cancel() {
                this.showModal = false
            },
            onSubmit() {
                if(!this.detailInfo.authorIntro || !this.detailInfo.bookIntro) {
                    this.$message.error('请填写必要的信息')
                    return
                }
                this.http.post(`${api.detailApi}/add`, this.detailInfo)
                    .then(res => {
                        if (res.data.result) {
                            this.$message.success('录入成功')
                            this.detailInfo= {}
                        } else {
                            this.$message.error(res.data.msg)
                        }
                    })
                    .catch(error => {
                        this.$message.error(error)
                    })
            },
            getBookData() {
                this.http.get(`${api.bookApi}/list`, {
                    params: {
                        name: this.keyWords
                    }
                }).then(res => {
                    if (res.data.result) {
                        let data = res.data.data
                        this.bookData = data
                    } else {
                        this.$message.error('查询失败,请稍后重试~')
                    }
                }).catch(() => {
                    this.$message.error('error')
                })
            },
        },
        mounted() {
            this.getBookData()
        }
    }
</script>

<style lang="scss" scoped>

</style>
