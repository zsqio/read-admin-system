<template>
    <div class="books-container container">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/record' }">图书录入</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :model="form"
                         :rules="rules"
                         ref="recordForm">
            <el-form-item label="图书名称:" prop="name">
                <el-input v-model="form.name"
                    placeholder="必填">
                </el-input>
            </el-form-item>
            <el-form-item label="图书外文名称:" prop="engName">
                <el-input v-model="form.engName"
                    placeholder="选填">
                </el-input>
            </el-form-item>
            <el-form-item label="ISBN:" prop="isbn">
                <el-input v-model="form.isbn"
                    placeholder="必填">
                </el-input>
            </el-form-item>
            <el-form-item label="封面地址:" prop="cover">
                <el-input v-model="form.cover"
                    placeholder="必填">
                </el-input>
            </el-form-item>
            <el-form-item label="作者:" prop="author">
                <el-input v-model="form.author"
                    placeholder="必填">
                </el-input>
            </el-form-item>
            <el-form-item label="作者简介:" prop="authorIntro">
                    <el-input type="textarea"
                        v-model="form.authorIntro"
                        rows="4"
                        placeholder="必填">
                    </el-input>
                </el-form-item>
            <el-form-item label="出版信息:" prop="publisher">
                <el-input v-model="form.publisher"
                    placeholder="必填">
                </el-input>
            </el-form-item>
            <el-form-item label="评分:" prop="score">
                <el-input v-model="form.score"
                    placeholder="必填">
                </el-input>
            </el-form-item>
                <el-form-item label="标签:" prop="tag">
                    <el-tag
                        :key="tag"
                        v-for="tag in form.tag"
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
                    <el-input type="text"
                        v-model="form.desc"
                        placeholder="必填">
                    </el-input>
                </el-form-item>
                <el-form-item label="内容简介:" prop="bookIntro">
                    <el-input type="textarea"
                        v-model="form.bookIntro"
                        rows="4"
                        placeholder="必填">
                    </el-input>
                </el-form-item>
                
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">录入图书</el-button>
                    <el-button>取消</el-button>
                </el-form-item>
            </el-form>             
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
            form: {
                name: '',
                engName: '',
                isbn: '',
                cover: '',
                author: '',
                authorIntro: '',
                publisher: '',
                score: 0,
                tag: [],
                desc: '',
                bookIntro: ''
            },
            inputVisible: false,
            inputValue: '',
            rules: {
                name: [
                    { required: true, message: '请补充图书名称', trigger: 'blur' }
                ],
                isbn: [
                    { required: true, message: '请补充ISBN', trigger: 'blur' }
                ],
                cover: [
                    { required: true, message: '请补充图书封面地址', trigger: 'blur' }
                ],
                author: [
                    { required: true, message: '请补充作者', trigger: 'blur' },
                ],
                authorIntro: [
                    { required: true, message: '请补充作者简介', trigger: 'blur' },
                ],
                publisher: [
                    { required: true, message: '请补充出版社', trigger: 'blur' }
                ],
                score: [
                    { required: true, message: '请补充评分', trigger: 'blur' }
                ],
                desc: [
                    { required: true, message: '请补充书评', trigger: 'blur' },
                    { min: 2, max: 30, message: '长度在 2 到 30个字符', trigger: 'blur'}
                ],
                bookIntro: [
                    { required: true, message: '请补充内容简介', trigger: 'blur' },
                ]
            }
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
        handleClose(tag) {
            this.form.tag.splice(this.form.tag.indexOf(tag), 1);
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
                this.form.tag.push(inputValue);
            }
            this.inputVisible = false;
            this.inputValue = '';
      }
    },
    created() {
        if (Store.get('isLogin') === 0) {
            this.$router.push('/login')
        }
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