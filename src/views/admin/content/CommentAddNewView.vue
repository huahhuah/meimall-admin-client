<template>
    <div>
        <!-- 頂部的麵包屑導航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 16px;">
            <el-breadcrumb-item :to="{ path: '/' }"><i class="el-icon-s-promotion"></i> 後臺管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/admin/content' }">內容管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/admin/content/comment' }">評論管理</el-breadcrumb-item>
            <el-breadcrumb-item>新增評論</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 表單 -->
        <el-divider content-position="left"></el-divider>
        <div class="rule-form">
            <el-form :model="ruleForm"  ref="ruleForm" label-width="130px" class="demo-ruleForm">
                <el-form-item label="作者ID" prop="authorId">
                    <el-input v-model="ruleForm.authorId"></el-input>
                </el-form-item>
                <el-form-item label="作者名" prop="authorName">
                    <el-input v-model="ruleForm.authorName"></el-input>
                </el-form-item>
                <el-form-item label="資源類型" prop="resourceType">
                    <el-input v-model="ruleForm.resourceType"></el-input>
                </el-form-item>
<!--                <el-form-item label="資源ID" prop="resourceId">-->
<!--                    <el-input v-model="ruleForm.resourceId"></el-input>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="資源摘要" prop="resourceBrief">-->
<!--                    <el-input v-model="ruleForm.resourceBrief"></el-input>-->
<!--                </el-form-item>-->
                <el-form-item label="內容" prop="content">
                    <el-input v-model="ruleForm.content"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                    <el-button type="warning" @click="gotoList()">返回列表</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import BaseUrl from "@/http/BaseUrl";
    import TokenAxios from "@/http/TokenAxios";

    export default {
        data(){
            return{
                ruleForm:{
                    authorId:'',
                    authorName:'',
                    goodsId:'',
                    type:'',
                    content:''
                }
            }
        },
        methods:{
            // 返回列表
            gotoList() {
                this.$router.push('./');
            },
            // 提交表單
            submitForm(formName) {
                if (Array.isArray(this.ruleForm.authorId)) {
                    this.ruleForm.authorId = this.ruleForm.authorId.pop();
                }
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let url = BaseUrl.ADMIN_CONTENT + '/comments/add-new';
                        console.log('url = ' + url);

                        TokenAxios.post(url, this.ruleForm).then((response) => {
                            let jsonResult = response.data;
                            if (jsonResult.state == 20000) {
                                this.$message({
                                    message: '新增評論成功！',
                                    type: 'success'
                                });
                                this.resetForm(formName);
                            } else {
                                this.$alert(jsonResult.message, '錯誤', {
                                    confirmButtonText: '確定',
                                    callback: action => {
                                    }
                                });
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            // 重置表單
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        }
    }
</script>

<style scoped>

</style>
