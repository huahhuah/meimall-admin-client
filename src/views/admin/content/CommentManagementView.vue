<template>
    <div>
        <!-- 頂部的麵包屑導航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 16px;">
            <el-breadcrumb-item :to="{ path: '/' }"><i class="el-icon-s-promotion"></i> 後臺管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/admin/content' }">內容管理</el-breadcrumb-item>
            <el-breadcrumb-item>評論管理</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 操作區域 -->
        <div>
            <el-divider content-position="left">操作區域</el-divider>
            <el-button type="primary" size="small" @click="gotoAddNew()">新增評論</el-button>
        </div>

        <!-- 資料表格 -->
        <el-divider content-position="left">資料表格</el-divider>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="id" label="ID" align="center"  width="50" ></el-table-column>
            <el-table-column prop="authorId" label="作者ID"  align="center"  width="200"
                             show-overflow-tooltip></el-table-column>
            <el-table-column prop="authorName" label="作者名" width="150" align="center"
                             show-overflow-tooltip></el-table-column>
            <el-table-column prop="content" label="評論內容" align="center"
                             show-overflow-tooltip></el-table-column>
            <el-table-column label="審核狀態"  align="center"  width="150">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="如需發佈，請點擊【審核】按钮進行審核，任何修改都會導致發佈狀態修改為【未審核】" placement="top">
                        <span v-if="scope.row.checkState == 1" style="color: #67c23a">{{ checkStateText[scope.row.checkState] }}</span>
                        <span v-else-if="scope.row.checkState == 2" style="color: #F56C6C">{{ checkStateText[scope.row.checkState] }}</span>
                        <span v-else style="color: #aaa">{{ checkStateText[scope.row.checkState] }}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column label="顯示狀態" width="80" align="center">
                <template slot-scope="scope">
                    <el-switch
                            @change="toggleDisplayState(scope.row)"
                            v-model="scope.row.displayState"
                            :active-value="1"
                            :inactive-value="0"
                            active-color="#13ce66"
                            inactive-color="#999">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200" align="center">
                <template slot-scope="scope">
                    <el-button class="op_button" :disabled="scope.row.checkState != 0" @click="openCheckDialog(scope.row)">審核</el-button>
                    <el-button class="op_button danger" @click="openDeleteConfirm(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分頁控件 -->
        <div style="margin: 10px 0; text-align: right;">
            <el-pagination
                    @current-change="changePage"
                    :hide-on-single-page="true"
                    :page-size="pageSize"
                    :current-page="currentPage"
                    layout="total, prev, pager, next"
                    :total="total">
            </el-pagination>
        </div>

        <!-- 顯示審核評論的對話框 -->
        <el-dialog :title="'審核 ' + checkForm.title" :visible.sync="checkFormDialogVisible">
            <el-form :model="checkForm" label-width="120px">
                <el-form-item label="審核狀態">
                    <el-radio-group v-model="checkForm.checkState">
                        <el-radio :label="2">拒絕</el-radio>
                        <el-radio :label="1">通過</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="備註">
                    <el-input v-model="checkForm.remarks"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="checkFormDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitCheck()">確 定</el-button>
            </div>
        </el-dialog>


    </div>
</template>

<script>
    import BaseUrl from "@/http/BaseUrl";
    import TokenAxios from "@/http/TokenAxios";

    export default {
        data() {
            return {
                // 審核狀態文本
                checkStateText: ['未審核', '通過', '拒絕'],
                // 表格資料
                tableData: [],
                // 分頁相關資料
                currentPage: this.$router.currentRoute.query.page ? parseInt(this.$router.currentRoute.query.page) : 1,
                pageSize: 20,
                total: 0,
                // 審核對話框的可見性
                checkFormDialogVisible: false,
                // 審核表單資料
                checkForm: {
                    id: 0,
                    title: '',
                    checkState: 2,
                    remarks: ''
                },
                // 顯示商品詳情的對話框的可見性
                infoDialogVisible: false,
            }
        },
        methods: {
            // 跳轉到新增頁面
            gotoAddNew() {
                this.$router.push('/admin/content/comment/add-new');
            },
            // 打開審核對話框
            openCheckDialog(comment) {
                this.checkForm.id = comment.id;
                this.checkForm.title = comment.title;
                this.checkFormDialogVisible = true;
            },
            // 提交審核
            submitCheck() {
                let checkStateText = ['', '通過', '拒絕'];
                let url = BaseUrl.ADMIN_CONTENT + '/comments/' + this.checkForm.id;
                if (this.checkForm.checkState == 2) {
                    url += '/cnacel-check';
                } else {
                    url += '/pass-check';
                }
                console.log('url = ' + url);

                let data = {
                    id: this.checkForm.id,
                    remarks: this.checkForm.remarks
                };

                TokenAxios.post(url, data).then((response) => {
                    let jsonResult = response.data;
                    if (jsonResult.state == 20000) {
                        this.$message({
                            message: checkStateText[this.checkForm.checkState] + '審核成功！',
                            type: 'success'
                        });
                        this.checkFormDialogVisible = false;
                        this.checkForm.checkState = 2;
                        this.checkForm.remarks = '';
                        this.loadCommentList();
                    } else if (jsonResult.state == 40400) {
                        this.$alert(jsonResult.message, '錯誤', {
                            confirmButtonText: '確定',
                            callback: action => {
                                this.checkFormDialogVisible = false;
                                this.loadCommentList();
                            }
                        });
                    } else {
                        this.$alert(jsonResult.message, '錯誤', {
                            confirmButtonText: '確定',
                            callback: action => {
                                this.checkFormDialogVisible = false;
                            }
                        });
                    }
                });
            },

            // 打開删除確認框
            openDeleteConfirm(comment) {
                let message = '將永久删除【' + comment.title + '】類别，是否繼續？';
                this.$confirm(message, '提示', {
                    confirmButtonText: '確定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.handleDelete(comment);
                }).catch(() => {
                });
            },
            // 執行删除
            handleDelete(comment) {
                let url = BaseUrl.ADMIN_CONTENT + '/comments/' + comment.id + '/delete';
                console.log('url = ' + url);

                TokenAxios.post(url).then((response) => {
                    let jsonResult = response.data;
                    if (jsonResult.state == 20000) {
                        this.$message({
                            message: '删除成功！',
                            type: 'success'
                        });
                        this.loadCommentList();
                    } else if (jsonResult.state == 40400) {
                        this.$alert(jsonResult.message, '錯誤', {
                            confirmButtonText: '確定',
                            callback: action => {
                                this.loadCommentList();
                            }
                        });
                    } else {
                        this.$alert(jsonResult.message, '錯誤', {
                            confirmButtonText: '確定',
                            callback: action => {
                            }
                        });
                    }
                });
            },
            // 切換啟用狀態
            toggleEnable(comment) {
                let enableStateText = ['禁用', '啟用'];
                let url = BaseUrl.ADMIN_CONTENT + '/comments/' + comment.id;
                if (category.enable == 1) {
                    url += '/enable';
                } else {
                    url += '/disable';
                }
                console.log('url = ' + url);

                TokenAxios.post(url).then((response) => {
                    let jsonResult = response.data;
                    if (jsonResult.state == 20000) {
                        this.$message({
                            message: enableStateText[category.enable] + '成功！',
                            type: 'success'
                        });
                    } else if (jsonResult.state == 40400) {
                        this.$alert(jsonResult.message, '錯誤', {
                            confirmButtonText: '確定',
                            callback: action => {
                                this.loadCommentList();
                            }
                        });
                    } else {
                        this.$alert(jsonResult.message, '錯誤', {
                            confirmButtonText: '確定',
                            callback: action => {
                            }
                        });
                    }
                });
            },
            // 切換分頁
            changePage(page) {
                this.$router.replace('?page=' + page);
                this.loadCommentList();
            },
            // 加載評論列表
            loadCommentList() {
                let page = this.$router.currentRoute.query.page;
                if (!page) {
                    page = 1;
                }

                let url = BaseUrl.ADMIN_CONTENT + '/comments/list-by-article?page=' + page;
                console.log('url = ' + url);

                TokenAxios.get(url).then((response) => {
                    let jsonResult = response.data;
                    if (jsonResult.state == 20000) {
                        this.tableData = jsonResult.data.list;
                        this.currentPage = jsonResult.data.currentPage;
                        this.pageSize = jsonResult.data.pageSize;
                        this.total = jsonResult.data.total;
                    }
                });
            }
        },

        mounted()
        {
            this.loadCommentList();
        }
    }
</script>

<style>
    .article-preview-dialog {
    }

    .article-preview-dialog .description-label {
        width: 150px;
    }

    .article-preview-dialog .picture-item {
        width: 160px;
        height: 90px;
        margin-right: 16px;
        margin-bottom: 10px;
        border-radius: 3px;
        float: left;
    }

    .danger {
        background: #F56C6C;
        color: #fff;
    }

    .danger:hover {
        background: #f92d2d;
        color: #fff;
    }
</style>
