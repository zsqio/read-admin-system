import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/login'
import Books from '@/views/books'
import Users from '@/views/users'
import Wishes from '@/views/wishes'
import Comment from '@/views/comment'
import Record from '@/views/record'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            redirect: 'login'
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
           path: '/record',
            name: 'Record',
            component: Record, 
        },
        {
            path: '/comment',
            name: 'Comment',
            component: Comment

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
