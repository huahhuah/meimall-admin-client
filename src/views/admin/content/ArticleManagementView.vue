<template>
    <div>
        <!-- 頂部的麵包屑導航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 16px;">
            <el-breadcrumb-item :to="{ path: '/' }"><i class="el-icon-s-promotion"></i> 後臺管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/admin/content' }">内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>文章管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-divider content-position="left"></el-divider>

        <!-- 操作區域 -->
        <div style="margin: 0 0 20px 0;">
            <el-button type="primary" size="small" @click="$router.push('/admin/content/article/add-new')">新增文章</el-button>
        </div>

        <!-- 表格 -->
        <el-divider content-position="left">文章列表</el-divider>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="id" label="ID" align="center" width="50"></el-table-column>
            <el-table-column label="類别" align="center" width="100">
                <template slot-scope="scope">
                    <el-tag>{{ scope.row.categoryName }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="authorName" label="作者" width="60" align="center"
                             show-overflow-tooltip></el-table-column>
            <el-table-column prop="title" label="標題" width="100" header-align="center"
                             show-overflow-tooltip></el-table-column>
            <el-table-column prop="brief" label="簡介" header-align="center"
                             show-overflow-tooltip></el-table-column>
            <el-table-column prop="sort" label="排序序號" width="80" align="center"></el-table-column>
            <el-table-column label="審核狀態" width="80" align="center">
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
            <el-table-column label="操作" width="300" align="center">
                <template slot-scope="scope">
                    <el-button class="op_button" :disabled="scope.row.checkState != 0" @click="openCheckDialog(scope.row)">審核</el-button>
                    <el-button class="op_button" @click="showArticleDetail(scope.row)">查看</el-button>
                    <el-button class="op_button danger" @click="openDeleteConfirm(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分頁控件 -->
        <div style="margin: 10px 0; text-align: right;">
            <el-pagination
                    @current-change="changePage"
                    layout="total, prev, pager, next"
                    :hide-on-single-page="true"
                    :page-size="pageSize"
                    :current-page="currentPage"
                    :total="total">
            </el-pagination>
        </div>

        <!-- 預覽文章詳情的彈出框 -->
        <el-dialog class="article-preview-dialog" title="查看文章詳情" :visible.sync="articlePreviewDialogVisible">
            <el-descriptions :column="1" border label-class-name="description-label">
                <el-descriptions-item label="ID">{{ articlePreviewData.id }}</el-descriptions-item>
                <el-descriptions-item label="標題">{{ articlePreviewData.title }}</el-descriptions-item>
                <el-descriptions-item label="封面圖">
                    <el-image class="picture-item"
                              :src="articlePreviewData.coverUrl"
                              fit="cover"></el-image>
                </el-descriptions-item>
                <el-descriptions-item label="作者">{{ articlePreviewData.authorName }}</el-descriptions-item>
                <el-descriptions-item label="發布時間">{{ articlePreviewData.gmtCreate }}</el-descriptions-item>
                <el-descriptions-item label="發布IP">{{ articlePreviewData.ip }}</el-descriptions-item>
                <el-descriptions-item label="最後修改時間">{{ articlePreviewData.gmtModified }}</el-descriptions-item>
                <el-descriptions-item label="摘要">{{ articlePreviewData.brief }}</el-descriptions-item>
                <el-descriptions-item label="文章詳情"><span v-html="articlePreviewData.detail"></span></el-descriptions-item>
                <el-descriptions-item label="瀏覽量">{{ articlePreviewData.clickCount }}</el-descriptions-item>
                <el-descriptions-item label="頂數量">{{ articlePreviewData.upCount }}</el-descriptions-item>
                <el-descriptions-item label="踩數量">{{ articlePreviewData.downCount }}</el-descriptions-item>
                <el-descriptions-item label="評論量">{{ articlePreviewData.commentCount }}</el-descriptions-item>
                <el-descriptions-item label="審核狀態">
                    <el-tag type="success" v-if="articlePreviewData.checkState == 1">通過</el-tag>
                    <el-tag type="info" v-else-if="articlePreviewData.checkState == 0">未審核</el-tag>
                    <el-tag type="danger" v-else>拒絕審核</el-tag>
                </el-descriptions-item>
            </el-descriptions>
        </el-dialog>

        <!-- 顯示審核商品的對話框 -->
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
                // 表格數據
                tableData: [],
                // 分頁相關數據
                currentPage: this.$router.currentRoute.query.page ? parseInt(this.$router.currentRoute.query.page) : 1,
                pageSize: 20,
                total: 0,
                article: {},
                // 預覽文章詳情相關數據
                articlePreviewDialogVisible: false,
                articlePreviewData: {},
                // 編輯對話框相關數據
                editFormDialogVisible: false,
                editForm: {},
                // 編輯表單的label寬度
                formLabelWidth: '120px',
                // 編輯表單規則
                editRules: {
                },
                // 審核表單數據
                checkForm: {
                    id: 0,
                    title: '',
                    checkState: 2,
                    remarks: ''
                },
            };
        },
        methods: {
            // 切換分頁
            changePage(page) {
                this.$router.replace('?page=' + page);
                this.loadArticleList();
            },
            // 打開審核對話框
            openCheckDialog(article) {
                this.checkForm.id =article.id;
                this.checkForm.title = article.title;
                this.checkFormDialogVisible = true;
            },
            // 提交審核
            submitCheck() {
                let checkStateText = ['', '通過', '拒絕'];
                let url = BaseUrl.ADMIN_CONTENT + '/articles/' + this.checkForm.id;
                if (this.checkForm.checkState == 2) {
                    url += '/cancel-check';
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
                        this.loadArticleList()
                    } else if (jsonResult.state == 40400) {
                        this.$alert(jsonResult.message, '錯誤', {
                            confirmButtonText: '確定',
                            callback: action => {
                                this.checkFormDialogVisible = false;
                                this.loadArticleList();
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
            // 切換顯示狀態
            toggleDisplayState(article) {
                let displayText = ['隱藏', '顯示'];
                let url = BaseUrl.ADMIN_CONTENT + '/articles/' + article.id;
                if (article.displayState == 0) {
                    url += '/hidden';
                } else {
                    url += '/display';
                }
                console.log('url = ' + url);

                TokenAxios.post(url).then((response) => {
                    let jsonResult = response.data;
                    if (jsonResult.state == 20000) {
                        this.$message({
                            message: displayText[article.displayState] + '文章成功！',
                            type: 'success'
                        });
                    } else if (jsonResult.state == 40400) {
                        this.$alert(jsonResult.message, '錯誤', {
                            confirmButtonText: '確定',
                            callback: action => {
                                    this.loadArticleList();
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
            // 彈出修改對話框
            // openEditDialog(article) {
            //     let url = BaseUrl.ADMIN_CONTENT + '/articles/' + article.id;
            //     console.log('url = ' + url);
            //
            //     TokenAxios.get(url).then((response) => {
            //         let jsonResult = response.data;
            //         if (jsonResult.state == 20000) {
            //             this.editForm = jsonResult.data;
            //             this.editFormDialogVisible = true;
            //         } else if (jsonResult.state == 40400) {
            //             this.$alert(jsonResult.message, '錯誤', {
            //                 confirmButtonText: '確定',
            //                 callback: action => {
            //                     this.loadArticleList();
            //                 }
            //             });
            //         } else {
            //             this.$alert(jsonResult.message, '錯誤', {
            //                 confirmButtonText: '確定',
            //                 callback: action => {
            //                 }
            //             });
            //         }
            //     });
            // },
            // 執行修改
            // submitEditForm() {
            //     let url = BaseUrl.ADMIN_CONTENT + '/articles/' + this.editForm.id + '/update';
            //     console.log('url = ' + url);
            //
            //     TokenAxios.post(url, this.editForm).then((response) => {
            //         let jsonResult = response.data;
            //         if (jsonResult.state == 20000) {
            //             this.$message({
            //                 message: '修改成功！',
            //                 type: 'success'
            //             });
            //             this.editFormDialogVisible = false;
            //             this.loadArticleList()
            //         } else if (jsonResult.state = 40400) {
            //             this.$alert(jsonResult.message, '錯誤', {
            //                 confirmButtonText: '確定',
            //                 callback: action => {
            //                     this.loadArticleList();
            //                 }
            //             });
            //         } else {
            //             this.$alert(jsonResult.message, '錯誤', {
            //                 confirmButtonText: '確定',
            //                 callback: action => {
            //                     this.dialogFormVisible = false;
            //                 }
            //             });
            //         }
            //     });
            // },
            // // 彈出删除確認框
            // openDeleteConfirm(article) {
            //     let message = '將永久删除【' + article.title + '】文章，是否繼續？';
            //     this.$confirm(message, '提示', {
            //         confirmButtonText: '確定',
            //         cancelButtonText: '取消',
            //         type: 'warning'
            //     }).then(() => {
            //         this.handleDelete(article);
            //     }).catch(() => {
            //     });
            // },
            // 打開删除確認框
            openDeleteConfirm(article) {
                let message = '將永久删除【' + article.title + '】文章，是否繼續？';
                this.$confirm(message, '提示', {
                    confirmButtonText: '確定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.handleDelete(article);
                }).catch(() => {
                });
            },
            // 執行删除
            handleDelete(article) {
                let url = BaseUrl.ADMIN_CONTENT + '/articles/' + article.id + '/delete';
                console.log('url = ' + url);

                TokenAxios.post(url).then((response) => {
                    let jsonResult = response.data;
                    if (jsonResult.state == 20000) {
                        this.$message({
                            message: '删除成功！',
                            type: 'success'
                        });
                        this.loadArticleList()
                    } else if (jsonResult.state == 40400) {
                        this.$alert(jsonResult.message, '錯誤', {
                            confirmButtonText: '確定',
                            callback: action => {
                                this.loadArticleList();
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
            // 顯示文章詳情
            showArticleDetail(article) {
                let url = BaseUrl.ADMIN_CONTENT+ '/articles/' + article.id;
                console.log('url = ' + url);

                TokenAxios.get(url).then((response) => {
                    let jsonResult = response.data;
                    if (jsonResult.state == 20000) {
                        this.articlePreviewData = jsonResult.data;
                        this.articlePreviewDialogVisible = true;
                    } else {
                        this.$alert(jsonResult.message, '警告', {
                            confirmButtonText: '確定',
                            callback: action => {
                                this.loadArticleList();
                            }
                        });
                    }
                });
            },
            // 加載文章列表
            loadArticleList() {
                let page = this.$router.currentRoute.query.page;
                if (!page) {
                    page = 1;
                }

                let url = BaseUrl.ADMIN_CONTENT + '/articles?page=' + page;
                console.log('url = ' + url);

                TokenAxios.get(url).then((response) => {
                    let jsonResult = response.data;
                    if (jsonResult.state == 20000) {
                        this.currentPage = jsonResult.data.pageSize;
                        this.pageSize = jsonResult.data.pageSize;
                        this.total = jsonResult.data.total;
                        this.tableData = jsonResult.data.list;
                    } else {
                        this.$alert(jsonResult.message, '錯誤', {
                            confirmButtonText: '確定',
                            callback: action => {
                            }
                        });
                    }
                });
            }
        },
        mounted() {
            this.loadArticleList();
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
