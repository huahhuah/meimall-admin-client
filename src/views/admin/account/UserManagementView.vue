<template>
    <div>
        <!-- 頂部麵包屑標示與導航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 16px;">
            <el-breadcrumb-item :to="{ path: '/' }"><i class="el-icon-s-promotion"></i> 後臺管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/admin/account' }">帳號管理</el-breadcrumb-item>
            <el-breadcrumb-item>用戶管理</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 操作區域 -->
        <div style="margin: 0 0 20px 0;">
            <el-divider content-position="left">操作區域</el-divider>
            <el-button type="primary" size="small" @click="gotoAddNew()">添加用戶</el-button>
        </div>

        <!-- 數據表格 -->
        <el-divider content-position="left">用戶列表</el-divider>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="id" label="ID" width="60" align="center"></el-table-column>
            <el-table-column label="頭像" width="60" align="center">
                <template slot-scope="scope">
                    <el-avatar :size="30" :src="scope.row.avatar"></el-avatar>
                </template>
            </el-table-column>
            <el-table-column prop="username" label="用戶名" width="120" header-align="center"
                             :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="phone" label="手機號碼" width="120" align="center"
                             :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="email" label="電子信箱" width="150" header-align="center"
                             :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="description" label="簡介" header-align="center"
                             :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="是否啟用" width="120" align="center">
                <template slot-scope="scope">
                    <el-switch
                            @change="toggleEnable(scope.row)"
                            v-model="scope.row.enable"
                            :active-value="1"
                            :inactive-value="0"
                            active-color="#13ce66"
                            inactive-color="#999">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="100" align="center">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" circle size="mini"
                               @click="openEditDialog(scope.row)"></el-button>
                    <el-button type="danger" icon="el-icon-delete" circle size="mini"
                               @click="openDeleteConfirm(scope.row)"></el-button>
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

        <!-- 修改資料的彈出表單Dialog -->
        <el-dialog title="编辑個人資料" :visible.sync="dialogFormVisible">
            <el-form :model="editForm">
                <el-form-item label="用户名" :label-width="formLabelWidth">
                    <el-input v-model="editForm.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="手機號碼" :label-width="formLabelWidth">
                    <el-input v-model="editForm.phone" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="電子郵箱" :label-width="formLabelWidth">
                    <el-input v-model="editForm.email" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="簡介" :label-width="formLabelWidth">
                    <el-input v-model="editForm.description" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitEditForm()">确 定</el-button>
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
                // 表格數據
                tableData: [],
                // 分頁相關數據
                currentPage: this.$router.currentRoute.query.page ? parseInt(this.$router.currentRoute.query.page) : 1,
                pageSize: 20,
                pageCount: 1,
                total: 0,
                // 編輯對話框的可見性
                dialogFormVisible: false,
                // 編輯表單
                editForm: {
                    id: '',
                    username: '',
                    nickname: '',
                    phone: '',
                    email: '',
                    description: ''
                },
                // 編輯表單的label寬度
                formLabelWidth: '120px'
            }
        },
        methods: {
            // 跳轉到新增頁面
            gotoAddNew() {
                this.$router.push('/admin/account/user/add-new');
            },
            // 打開編輯對話框
            openEditDialog(user) {
                let url = BaseUrl.ADMIN_ACCOUNT + '/users/' + user.id;
                console.log('url = ' + url);

                TokenAxios.get(url).then((response) => {
                    let jsonResult = response.data;
                    if (jsonResult.state == 20000) {
                        this.editForm = jsonResult.data;
                        this.dialogFormVisible = true;
                    } else if (jsonResult.state == 40400) {
                        this.$alert(jsonResult.message, '錯誤', {
                            confirmButtonText: '確定',
                            callback: action => {
                                this.loadUserList();
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

            // 提交編輯表單
            submitEditForm() {
                let url = BaseUrl.ADMIN_ACCOUNT + '/users/' + this.editForm.id + '/info/update';
                console.log('url = ' + url);

                TokenAxios.post(url, this.editForm).then((response) => {
                    let jsonResult = response.data;
                    if (jsonResult.state == 20000) {
                        this.$message({
                            message: '修改基本資料成功！',
                            type: 'success'
                        });
                        this.dialogFormVisible = false;
                        this.loadUserList();
                    } else if (jsonResult.state = 40400) {
                        this.$alert(jsonResult.message, '錯誤', {
                            confirmButtonText: '確定',
                            callback: action => {
                                this.loadUserList();
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
            // 切换啟用狀態
            toggleEnable(user) {
                let enableText = ['禁用', '啟用'];
                let url = BaseUrl.ADMIN_ACCOUNT + '/users/' + user.id;
                let enable = user.enable;
                if (enable == 1) {
                    url += '/enable';
                } else {
                    url += '/disable';
                }
                console.log('url = ' + url);

                TokenAxios.post(url).then((response) => {
                    let jsonResult = response.data;
                    if (jsonResult.state == 20000) {
                        this.$message({
                            message: '將【' + user.username + '】的啟用狀態修改为【' + enableText[enable] + '】成功！',
                            type: 'success'
                        });
                        this.loadUserList();
                    } else if (jsonResult.state == 40400) {
                        this.$alert(jsonResult.message, '操作失敗', {
                            confirmButtonText: '確定',
                            callback: action => {
                                this.loadUserList();
                            }
                        });
                    } else {
                        this.$alert(jsonResult.message, '操作失敗', {
                            confirmButtonText: '確定',
                            callback: action => {
                            }
                        });
                    }
                }).catch(error => {
                    let title = '錯誤';
                    let message = '程序執行過程中出現錯誤，請打開瀏覽器的控制台查看詳細錯誤信息！';
                    this.$alert(message, title, {
                        confirmButtonText: '確定',
                        callback: action => {
                        }
                    });
                    console.log(error);
                });
            },
            // 打開删除確認框
            openDeleteConfirm(user) {
                let message = '此操作將永久删除【' + user.username + '】用戶，是否繼續？';
                this.$confirm(message, '提示', {
                    confirmButtonText: '確定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.handleDelete(user);
                }).catch(() => {
                });
            },
            // 處理删除
            handleDelete(user) {
                let url = BaseUrl.ADMIN_ACCOUNT + '/users/' + user.id + '/delete';
                console.log('url = ' + url);

                TokenAxios.post(url).then((response) => {
                    let jsonResult = response.data;
                    if (jsonResult.state == 20000) {
                        this.$message({
                            message: '删除【' + user.username + '】用戶成功！',
                            type: 'success'
                        });
                        this.loadUserList();
                    } else if (jsonResult.state == 40400) {
                        this.$alert(jsonResult.message, '操作失敗', {
                            confirmButtonText: '確定',
                            callback: action => {
                                this.loadUserList();
                            }
                        });
                    } else {
                        this.$alert(jsonResult.message, '操作失敗', {
                            confirmButtonText: '確定',
                            callback: action => {
                            }
                        });
                    }
                }).catch(error => {
                    let title = '錯誤';
                    let message = '程序執行過程中出現錯誤，請打開瀏覽器的控制台查看詳細錯誤信息！';
                    this.$alert(message, title, {
                        confirmButtonText: '確定',
                        callback: action => {
                        }
                    });
                    console.log(error);
                });
            },
            // 切換分頁
            changePage(page) {
                this.$router.replace('?page=' + page);
                this.loadUserList();
            },
            // 加載用戶列表
            loadUserList() {
                let page = this.$router.currentRoute.query.page;
                if (!page) {
                    page = 1;
                }

                let url = BaseUrl.ADMIN_ACCOUNT + '/users?page=' + page;
                console.log('url = ' + url);

                TokenAxios.get(url).then((response) => {
                    let jsonResult = response.data;
                    if (jsonResult.state == 20000) {
                        this.tableData = jsonResult.data.list;
                        this.currentPage = jsonResult.data.currentPage;
                        this.pageSize = jsonResult.data.pageSize;
                        this.total = jsonResult.data.total;
                    } else {
                        let title = '操作失敗';
                        this.$alert(jsonResult.message, title, {
                            confirmButtonText: '確定',
                            callback: action => {
                            }
                        });
                    }
                }).catch(error => {
                    let title = '錯誤';
                    let message = '程序執行過程中出現錯誤，請打開瀏覽器的控制台查看詳細錯誤信息！';
                    this.$alert(message, title, {
                        confirmButtonText: '確定',
                        callback: action => {
                        }
                    });
                    console.log(error);
                });
            }
        },
        mounted() {
            this.loadUserList();
        }
    }
</script>

<style>

</style>
