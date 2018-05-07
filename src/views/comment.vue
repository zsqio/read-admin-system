<template>
    <div class="detail-container container">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/comment' }">评论管理</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="content">
            <el-table :data="commentData"
                      stripe
                      style="width: 100%"
                      refs="onshelfTable">
                <el-table-column prop="name"
                                 label="书名">
                </el-table-column>

                <el-table-column prop="comment"
                                 label="评论内容"
                                 show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="user"
                                 label="评论者">
                </el-table-column>
                <el-table-column prop="commentDate"
                                 label="评论时间">
                </el-table-column>
                <el-table-column width="80"
                                 label="操作">
                    <template slot-scope="scope">
                        <el-button
                                type="primary"
                                plain
                                @click="deleteComment(scope.row._id, scope.row.user)">屏蔽</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        
    </div>
</template>

<script>
    import { api } from '@/config'
    import Store from 'store2'

    export default {
        name: 'detail',
        data() {
            return {
                commentData: []
            }
        },
        methods: {
            getCommentData() {
                this.http.get(`${api.commentApi}/all`, {params:{}})
                .then(res => {
                    if (res.data.result) {
                        const data = res.data.data 
                        this.commentData = data
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
                .catch(error => {
                    this.$message.error(error)
                })
            },
            deleteComment(id, user) {
                this.$confirm(`确定要屏蔽用户${user}发表的这条评论吗？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.http.post(`${api.commentApi}/delete`, { id })
                    .then(res => {
                        if (res.data.result) {
                            this.$message.success('屏蔽成功')
                            this.getCommentData()
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
                    message: '已取消屏蔽该条评论'
                })
            })
        }

    },
    mounted() {
            this.getCommentData()
    }
}
</script>

<style lang="scss" scoped>

</style>
