import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/login'
import Books from '@/views/books'
import Users from '@/views/users'
import Wishes from '@/views/wishes'
import Detail from '@/views/detail'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            redirect: 'books'
        },
        {
            path: '/login',
            name: 'Login',
            component: Login
        },
        {
            path: '/books',
            name: 'Books',
            component: Books,
        },
        {
            path: '/detail',
            name: 'Detail',
            component: Detail

        },
        {
            path: '/users',
            name: 'Users',
            component: Users
        },
        {
            path: '/wishes',
            name: 'Wishes',
            component: Wishes
        }
    ]
})
