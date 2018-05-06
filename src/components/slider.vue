<template>
    <div class="slider-container">
        <el-menu
            default-active="books"
            class="el-menu-vertical-demo"
            :router = true
            text-color="#333">
            <el-submenu index="1">
                <template slot="title">
                <i class="el-icon-menu"></i>
                <span>图书管理</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="books">所有图书</el-menu-item>
                    <el-menu-item index="record">图书录入</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <el-menu-item index="detail">
                <i class="el-icon-edit"></i>
                <span slot="title">详情管理</span>
            </el-menu-item>
            <el-menu-item index="users">
                <i class="el-icon-view"></i>
                <span slot="title">用户管理</span>
            </el-menu-item>
            <el-menu-item index="wishes">
                <i class="el-icon-document"></i>
                <span slot="title">心愿单</span>
            </el-menu-item>
        </el-menu>
    </div>
</template>
<script>
export default {
    name: 'slider',
    data() {
        return {
            activeIndex: 'books',
            pathMap: {
                Books: 'books',
                Detail: 'detail',
                Record: 'record',
                Users: 'users',
                Records: 'records',
                Wishes: 'wishes'
            }
        }
    },
    watch: {
        '$route.path'() {
            this.reset()
        }
    },
    computed: {
        path() {
            return this.$route.matched[0] && this.$route.matched[0].name
        }
    },
    methods: {
        reset() {
            const path = this.$route.path
            if (path) {
                this.activeIndex = this.pathMap[this.path]
            }
        }
    },
    created() {
        this.reset()
    }
}
</script>
<style lang="scss" scoped>
.slider-container {
  width: 200px;
  height: 100%;
  display: inline-block;
}
</style>
<style lang="scss">
.slider-container {
  .el-menu {
    height: 100%;
  }
}
</style>
