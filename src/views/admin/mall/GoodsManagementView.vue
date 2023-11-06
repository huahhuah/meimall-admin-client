<template>
    <div>
        <!-- 頂部麵包屑標示與導航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 16px;">
            <el-breadcrumb-item :to="{ path: '/' }"><i class="el-icon-s-promotion"></i> 後臺管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/admin/mall' }">商城管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-divider></el-divider>

        <!-- 操作區域 -->
        <div style="margin: 0 0 20px 0;">
            <el-divider content-position="left">操作區域</el-divider>
            <el-button type="primary" size="small" @click="gotoAddNew()">添加商品</el-button>
        </div>

        <!-- 資料表格 -->
        <el-divider content-position="left">資料表格</el-divider>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="id" label="ID" width="80" align="center"
                             :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="封面圖片" width="100" align="center">
                <template slot-scope="scope">
                    <el-image
                            style="width: 80px; height: 80px"
                            :src="scope.row.coverUrl"
                            fit="fit"></el-image>
                </template>
            </el-table-column>
            <el-table-column prop="categoryName" label="類别" width="80" align="center"
                             :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="barCode" label="商品條碼" width="150" align="center"
                             :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="title" label="商品標題" align="center"
                             :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="salePrice" label="售價" width="80" align="center"></el-table-column>
            <el-table-column prop="salesCount" label="銷量" width="80" align="center"></el-table-column>
            <el-table-column label="好評/評論" width="100" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.positiveCommentCount }} / {{ scope.row.commentCount }}</div>
                </template>
            </el-table-column>
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
            <el-table-column label="推薦" width="60" align="center">
                <template slot-scope="scope">
                    <el-switch
                            @change="toggleRecommend(scope.row)"
                            v-model="scope.row.isRecommend"
                            :active-value="1"
                            :inactive-value="0"
                            active-color="#13ce66"
                            inactive-color="#cccccc">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="上架" width="60" align="center">
                <template slot-scope="scope">
                    <el-switch
                            @change="togglePutOn(scope.row)"
                            v-model="scope.row.isPutOn"
                            :active-value="1"
                            :inactive-value="0"
                            active-color="#13ce66"
                            inactive-color="#cccccc">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="160" align="center">
                <template slot-scope="scope">
                    <el-button class="op_button" :disabled="scope.row.checkState != 0" @click="openCheckDialog(scope.row)">審核</el-button>
                    <el-button class="op_button" @click="openShowInfoDialog(scope.row)">查看</el-button>
                    <el-button class="op_button" @click="openEditDialog(scope.row)">編輯</el-button>
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

        <!-- 顯示商品詳情的對話框 -->
        <el-dialog class="goods-info" :title="goods.title" :visible.sync="infoDialogVisible">
            <el-descriptions :column="1" border label-class-name="spu-info-label">
                <el-descriptions-item label="資料ID">
                    {{ goods.id }}
                    <el-tooltip class="item" effect="dark" content="此資料不會顯示在普通用戶界面" placement="right">
                        <sup><i class="el-icon-info"></i></sup>
                    </el-tooltip>
                </el-descriptions-item>
                <el-descriptions-item label="類别">{{ goods.categoryName }}</el-descriptions-item>
                <el-descriptions-item label="商品條碼">{{ goods.barCode }}</el-descriptions-item>
                <el-descriptions-item label="標題">{{ goods.title }}</el-descriptions-item>
                <el-descriptions-item label="簡介">{{ goods.brief }}</el-descriptions-item>
                <el-descriptions-item label="關鍵詞">{{ goods.keywords }}</el-descriptions-item>
                <el-descriptions-item label="售價">{{ goods.salePrice }} 元</el-descriptions-item>
                <el-descriptions-item label="銷量">{{ goods.salesCount }}</el-descriptions-item>
                <el-descriptions-item label="排序序號">{{ goods.sort }}</el-descriptions-item>
                <el-descriptions-item label="是否推薦">{{ goods.isRecommend == 0 ? '否' : '是' }}</el-descriptions-item>
                <el-descriptions-item label="是否推薦">{{ goods.isPutOn == 0 ? '否' : '是' }}</el-descriptions-item>
                <el-descriptions-item label="審核狀態">{{ checkStateText[goods.checkState] }}</el-descriptions-item>
                <el-descriptions-item label="好評數量">{{ goods.positiveCommentCount }}</el-descriptions-item>
                <el-descriptions-item label="差評數量">{{ goods.negativeCommentCount }}</el-descriptions-item>
                <el-descriptions-item label="評論總量">{{ goods.commentCount }}</el-descriptions-item>
                <el-descriptions-item label="商品圖片">
                    <el-image class="picture-item"
                              :src="goods.coverUrl"
                              fit="fit"></el-image>
                </el-descriptions-item>
                <el-descriptions-item label="商品詳情"><span v-html="goods.detail"></span></el-descriptions-item>
            </el-descriptions>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="infoDialogVisible = false">關  閉</el-button>
            </div>
        </el-dialog>

        <!-- 修改商品詳情的彈出表單Dialog -->
        <el-dialog title="修改商品詳情" :visible.sync="editFormDialogVisible">
            <el-form :model="editForm"  :label-width="formLabelWidth">
                <el-form-item label="商品條碼" prop="barCode">
                    <el-input v-model="editForm.barCode"></el-input>
                </el-form-item>
                <el-form-item label="商品標題" prop="title">
                    <el-input v-model="editForm.title"></el-input>
                </el-form-item>
                <el-form-item label="簡介" prop="brief">
                    <el-input v-model="editForm.brief"></el-input>
                </el-form-item>
                <el-form-item label="關鍵詞" prop="keywords">
                    <el-input v-model="editForm.keywords"></el-input>
                </el-form-item>
                <el-form-item label="售價" prop="salePrice">
                    <el-input v-model="editForm.salePrice"></el-input>
                </el-form-item>
                <el-form-item label="排序序號" prop="sort">
                    <el-input v-model="editForm.sort"></el-input>
                </el-form-item>
                <el-form-item label="商品詳情" prop="detail"  >
                    <el-input id="input1"
                              type="textarea"
                              v-model="editForm.detail"
                              :rows="10"
                              maxlength="300"
                              show-word-limit
                              style="width: 100%">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editFormDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitEditForm()">確 定</el-button>
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
                // 商品詳情
                goods: {
                },
                // 審核對話框的可見性
                checkFormDialogVisible: false,
                // 審核表單資料
                checkForm: {
                    id: 0,
                    title: '',
                    checkState: 2,
                    remarks: ''
                },
                // 顯示商品詳情的對話框的可性
                infoDialogVisible: false,
                // 修改類别信息的彈出窗口的相關變量
                editFormDialogVisible: false,

                //編輯表單
                editForm:{
                    categoryName: '',
                    barCode: '',
                    title: '',
                    brief: '',
                    keywords: '',
                    salePrice: '',
                    sort: '',
                    detail: ''
                },
                // 編輯表單的label寬度
                formLabelWidth: '120px'
            }
        },
        methods: {
            // 跳轉到新增頁面
            gotoAddNew() {
                this.$router.push('/admin/mall/goods/add-new');
            },
            // 切換【是否上架】狀態
            togglePutOn(goods) {
                let putOnStateText = ['下架', '上架'];
                let url = BaseUrl.ADMIN_MALL + '/goods/' + goods.id;
                if (goods.isPutOn == 1) {
                    url += '/put-on';
                } else {
                    url += '/pull-off';
                }
                console.log('url = ' + url);

                TokenAxios.post(url).then((response) => {
                    let jsonResult = response.data;
                    if (jsonResult.state == 20000) {
                        this.$message({
                            message: putOnStateText[goods.isPutOn] + '成功！',
                            type: 'success'
                        });
                    } else if (jsonResult.state == 40400) {
                        this.$alert(jsonResult.message, '錯誤', {
                            confirmButtonText: '確定',
                            callback: action => {
                                this.loadGoodsList();
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
            // 切換【是否推薦】狀態
            toggleRecommend(goods) {
                let recommendStateText = ['不推薦', '推薦'];
                let url = BaseUrl.ADMIN_MALL + '/goods/' + goods.id;
                if (goods.isRecommend == 1) {
                    url += '/set-recommend';
                } else {
                    url += '/cancle-recommend';
                }
                console.log('url = ' + url);

                TokenAxios.post(url).then((response) => {
                    let jsonResult = response.data;
                    if (jsonResult.state == 20000) {
                        this.$message({
                            message: recommendStateText[goods.isRecommend] + '成功！',
                            type: 'success'
                        });
                    } else if (jsonResult.state == 40400) {
                        this.$alert(jsonResult.message, '錯誤', {
                            confirmButtonText: '確定',
                            callback: action => {
                                this.loadGoodsList();
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
            // 打開審核對話框
            openCheckDialog(goods) {
                this.checkForm.id = goods.id;
                this.checkForm.title = goods.title;
                this.checkFormDialogVisible = true;
            },
            // 提交審核
            submitCheck() {
                let checkStateText = ['', '通過', '拒絕'];
                let url = BaseUrl.ADMIN_MALL + '/goods/' + this.checkForm.id;
                if (this.checkForm.checkState == 2) {
                    url += '/check-state/reject';
                } else {
                    url += '/check-state/pass';
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
                        this.loadGoodsList();
                    } else if (jsonResult.state == 40400) {
                        this.$alert(jsonResult.message, '錯誤', {
                            confirmButtonText: '確定',
                            callback: action => {
                                this.checkFormDialogVisible = false;
                                this.loadGoodsList();
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
            // 打開詳情對話框
            openShowInfoDialog(goods) {
                let url = BaseUrl.ADMIN_MALL + '/goods/' + goods.id;
                console.log('url = ' + url);

                TokenAxios.get(url).then((response) => {
                    let jsonResult = response.data;
                    if (jsonResult.state == 20000) {
                        this.goods = jsonResult.data;
                        this.infoDialogVisible = true;
                    } else {
                        this.$alert(jsonResult.message, '警告', {
                            confirmButtonText: '確定',
                            callback: action => {
                                this.loadGoodsList();
                            }
                        });
                    }
                });
            },
            // 打開編輯對話框
            openEditDialog(goods) {
                let url = BaseUrl.ADMIN_MALL + '/goods/' + goods.id;
                console.log('url = ' + url);

                TokenAxios.get(url).then((response) => {
                    let jsonResult = response.data;
                    if (jsonResult.state == 20000) {
                        this.editForm = jsonResult.data;
                        this.editFormDialogVisible = true;
                    } else if (jsonResult.state == 40400) {
                        this.$alert(jsonResult.message, '錯誤', {
                            confirmButtonText: '確定',
                            callback: action => {
                                this.loadGoodsList();
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
            // 提交編輯
            submitEditForm() {
                let url = BaseUrl.ADMIN_MALL + '/goods/' + this.editForm.id + '/update';
                console.log('url = ' + url);

                let formData = this.qs.stringify(this.editForm);
                console.log('formData = ' + formData);

                TokenAxios.post(url, this.editForm).then((response) => {
                    let jsonResult = response.data;
                    if (jsonResult.state == 20000) {
                        this.$message({
                            message: '修改商品詳情成功！',
                            type: 'success'
                        });
                        this.editFormDialogVisible = false;
                        this.loadGoodsList()
                    } else if (jsonResult.state = 40400) {
                        this.$alert(jsonResult.message, '錯誤', {
                            confirmButtonText: '確定',
                            callback: action => {
                                this.loadGoodsList();
                            }
                        });
                    } else {
                        this.$alert(jsonResult.message, '錯誤', {
                            confirmButtonText: '確定',
                            callback: action => {
                                this.dialogFormVisible = false;
                            }
                        });
                    }
                });
            },
            // 打開删除確認框
            openDeleteConfirm(goods) {
                let message = '將永久删除【' + goods.title + '】類别，是否繼續？';
                this.$confirm(message, '提示', {
                    confirmButtonText: '確定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.handleDelete(goods);
                }).catch(() => {
                });
            },
            // 執行删除
            handleDelete(goods) {
                let url = BaseUrl.ADMIN_MALL + '/goods/' + goods.id + '/delete';
                console.log('url = ' + url);

                TokenAxios.post(url).then((response) => {
                    let jsonResult = response.data;
                    if (jsonResult.state == 20000) {
                        this.$message({
                            message: '删除成功！',
                            type: 'success'
                        });
                        this.loadGoodsList();
                    } else if (jsonResult.state == 40400) {
                        this.$alert(jsonResult.message, '錯誤', {
                            confirmButtonText: '確定',
                            callback: action => {
                                this.loadGoodsList();
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
                this.loadGoodsList();
            },
            // 加載商品列表
            loadGoodsList() {
                let page = this.$router.currentRoute.query.page;
                if (!page) {
                    page = 1;
                }

                let url = BaseUrl.ADMIN_MALL + '/goods?page=' + page;
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
        mounted() {
            this.loadGoodsList();
        }
    }
</script>

<style>
    .op_button {
        width: 50px;
        margin: 5px 6px;
        padding: 5px 10px;
        font-size: 12px;
        border-radius: 3px;
    }

    .danger {
        background: #F56C6C;
        color: #fff;
    }

    .danger:hover {
        background: #f92d2d;
        color: #fff;
    }

    .goods-info {
    }

    .goods-info .spu-info-label {
        width: 120px;
    }

    .goods-info .picture-item {
        width: 80px;
        height: 80px;
        margin-right: 16px;
        margin-bottom: 10px;
        border-radius: 3px;
        float: left;
    }
</style>
