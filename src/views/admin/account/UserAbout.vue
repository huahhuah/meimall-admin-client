<template>
    <div>

        <!-- 頁面主體 -->
        <div class="main-container">
            <div class="user-about-main">
                <div class="user-about-main-inner">
                    <el-menu :default-active="nowUserAboutId" class="el-menu-demo" mode="horizontal" @select="handleSelect">
                        <el-menu-item index="1">個人資料</el-menu-item>
                        <el-menu-item index="2">修改密碼</el-menu-item>
                    </el-menu>
                    <el-form v-if="nowUserAboutId==='2'" :model="passwordForm" status-icon :rules="passwordRules"
                             label-width="100px" class="now-from">
                        <el-form-item label="舊密碼" prop="oldPassword">
                            <el-input prefix-icon="el-icon-key" v-model="passwordForm.oldPassword" autocomplete="off" width="150px">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="新密碼" prop="password">
                            <el-input prefix-icon="el-icon-key" type="password" v-model="passwordForm.password" autocomplete="off"
                                      width="150px">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="確認密碼" prop="confirmPassword">
                            <el-input prefix-icon="el-icon-key" type="password" v-model="passwordForm.confirmPassword"
                                      autocomplete="off" width="150px">
                            </el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button class="from-bnt" type="primary" @click="submitForm('passwordForm')">提交</el-button>
                        </el-form-item>
                    </el-form>

                    <el-form v-if="nowUserAboutId==='1'" :model="userInfoForm" status-icon :rules="userInfoForm"
                             label-width="80px" style="padding-right: 20px" class="now-from">
                        <el-card>
                            <div style="margin: 15px; text-align: center" >
                                    <el-upload
                                            class="avatar-uploader"
                                            action="http://localhost:19082/resources/upload/image/user-avatar"
                                            :show-file-list="false"
                                            :on-success="handleAvatarSuccess"
                                    >
                                        <img v-if="userInfoForm.avatar" :src="userInfoForm.avatar" class="avatar">
                                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                    </el-upload>
                            </div>
                            <el-form-item label="用戶名" prop="username">
                                <el-input v-model="userInfoForm.username" placeholder="用戶名" disabled></el-input>
                            </el-form-item>

                            <el-form-item label="手機號碼" prop="phone">
                                <el-input v-model="userInfoForm.phone" placeholder="手機號碼"></el-input>
                            </el-form-item>
                            <el-form-item label="電子信箱" prop="email">
                                <el-input v-model="userInfoForm.email" placeholder="電子信箱"></el-input>
                            </el-form-item>
                            <div style="text-align: center;margin-bottom: 20px">
                                <el-button type="primary" @click="submitForm">保 存</el-button>
                            </div>

                        </el-card>
                    </el-form>


                </div>
            </div>
        </div>
    </div>

</template>

<script>



    import BaseUrl from "@/http/BaseUrl";
    import TokenAxios from "@/http/TokenAxios";

    export default {

        data() {

            const validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('請輸入密碼'));
                } else {
                    if (this.passwordForm.confirmPassword !== '') {
                        this.$refs.passwordForm.validateField('confirmPassword');
                    }
                    callback();
                }
            };
            const validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('請再次輸入密碼'));
                } else if (value !== this.passwordForm.password) {
                    callback(new Error('兩次輸入密碼不一致!'));
                } else {
                    callback();
                }
            };
            return {
                nowUserAboutId: 1,
                userInfoForm: JSON.parse(localStorage.getItem('loginInfo') || '{}'),

                // 修改密碼
                passwordForm: {
                    oldPassword: '',
                    password: '',
                    confirmPassword: '',
                },
                // 表單規則
                passwordRules: {
                    oldPassword: [
                        {required: true, message: '請輸入舊密碼', trigger: 'blur'},
                        {min: 4, max: 15, message: '長度在 4 到 15 個字符', trigger: 'blur'},
                    ],
                    password: [
                        {required: true, message: '請輸入新密碼', trigger: 'blur'},
                        {min: 4, max: 15, message: '長度在 4 到 15 個字符', trigger: 'blur'},
                        {validator: validatePass, trigger: 'blur'}
                    ],
                    confirmPassword: [
                        {required: true, message: '請輸入確認密碼', trigger: 'blur'},
                        {min: 4, max: 15, message: '長度在 4 到 15 個字符', trigger: 'blur'},
                        {validator: validatePass2, trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            loadPageTitle() {
                this.pageTitle = '廚房一隻咩';
                document.title = this.pageTitle;
            },
            changeUserAboutId() {
                console.log(this.$router.currentRoute.query.id)
                this.nowUserAboutId = this.$router.currentRoute.query.id;
            },
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
                this.nowUserAboutId = key;
            },
            // 上傳成功後的回調
            handleAvatarSuccess(response) {
                //console.log(response)
                if (response.state == 20000) {
                    this.userInfoForm.avatar = response.data;
                } else {
                    let title = '操作失敗';
                    this.$alert(response.message, title, {
                        confirmButtonText: '確定',
                        callback: action => {
                        }
                    });
                }
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (formName === 'passwordForm') {

                        }
                        if (formName === 'userInfoForm') {

                        }
                        if (formName === 'userImgForm') {

                        }
                    } else {
                        console.log('error submit!!');
                        return false;
                    }

                });
            },

            mounted() {
                this.loadPageTitle();
            },
            created() {
                this.changeUserAboutId();
            }
        }
    }

</script>

<style>
    /*通用的去ul默認格式*/
    ul, li {
        margin: 0;
        padding: 0;
        list-style: none;
    }

    a {
        color: #4caf50;;
    }

    body {
        font-family: "微軟雅黑", "黑體";
    }


    .main-container {
        text-align: left !important;
        width: 1200px;
        margin: 0 auto;
    }

    .user-about-main {
        margin-top: 24px;
        min-height: 400px;
        background-color: #fff;
        -webkit-border-radius: 24px;
        -moz-border-radius: 24px;
        -ms-border-radius: 24px;
        border-radius: 24px;
        overflow: hidden;
    }

    .user-about-main-inner {
        padding: 40px;
    }

    .now-from {
        padding: 20px 50px 20px 0px;
    }
    /deep/.el-upload{
        border-radius: 50%;
    }

    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
        border-radius: 50%;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
        border-radius: 50%;
    }

</style>
