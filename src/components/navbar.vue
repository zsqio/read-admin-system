<template>
    <div class="nav-container">
        <header>
            <ul>
                <li class="title fl"
                    @click="toIndex">甄选书屋管理后台</li>
                <li class="user-name fs-16">
                    <span style="font-size: 14px;">欢迎您! </span>{{username}}</li>
                <li class="log-out fs-14"
                    @click="logOut">登出</li>
            </ul>
        </header>
    </div>
</template>
<script>
import Store from 'store2'

export default {
    name: 'navbar',
    data() {
        return {
            username: ''
        }
    },
    methods: {
        toIndex() {
            this.$router.push('/')
        },
        logOut() {
            this.$confirm('确认登出？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                Store.remove('username')
                Store.set('isLogin', 0)
                this.$router.push('/login')
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消登出'
                })
            })
        }
    },
    mounted() {
        this.username = Store.get('username')
    }
}
</script>
<style lang="scss" scoped>
@import "../assets/css/variable.scss";

.nav-container {
  header {
    ul {
      padding: 0 20px;
      text-align: right;
      li {
        display: inline-block;
      }
      .title {
        font-weight: bold;
        font-size: 18px;
        cursor: pointer;
        color: #fff;
      }
      .user-name {
        color: #fff;
        font-size: 16px;
        font-weight: 500;
      }
      .log-out {
        color: #fff;
        font-size: 14px;
        margin-left: 20px;
        cursor: pointer;
      }
    }
  }
}
</style>
