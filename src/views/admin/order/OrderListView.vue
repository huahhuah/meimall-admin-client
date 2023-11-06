<template>
    <div>
        <!-- 頂部的麵包屑導航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 16px;">
            <el-breadcrumb-item :to="{ path: '/' }"><i class="el-icon-s-promotion"></i> 後臺管理</el-breadcrumb-item>
            <el-breadcrumb-item>訂單管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-divider content-position="left"></el-divider>

        <!-- 資料表格 -->
        <el-divider content-position="left">訂單列表</el-divider>


        <!--卡片視圖區-->
        <el-card>
            <el-row>
                <el-col :span="8">
                    <el-input placeholder="請輸入内容" >
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <br>
        <!--訂單列表資料 -->

                <el-table :data="tableData" border stripe style="width: 100%">
                    <el-table-column prop="id" label="訂單ID" align="center"></el-table-column>
                    <el-table-column prop="orderNo" label="訂單編號" align="center">
                    </el-table-column>
                    <el-table-column prop="totalPrice" label="訂單價格" align="center"
                                     show-overflow-tooltip></el-table-column>
                    <el-table-column prop="payMethod" label="支付方式" align="center">
                        <template slot-scope="scope">
                            <el-tag type = "primary"
                                     v-if="scope.row.payMethod =='0'">匯款</el-tag>
                            <el-tag type = "danger" v-else>貨到付款</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="orderState" label="訂單狀態" align="center">
                        <template slot-scope="scope">
                            <el-tag type = "danger"
                                    v-if="scope.row.orderState =='0'">待支付</el-tag>
                            <el-tag type = "danger"
                                    v-if="scope.row.orderState =='1'">已支付，待出貨</el-tag>
                            <el-tag type = "danger"
                                    v-if="scope.row.orderState =='2'">已出貨/待收貨</el-tag>
                            <el-tag type = "danger" v-if="scope.row.orderState =='3'">確認收貨/已完成</el-tag>

                        </template>
                    </el-table-column>

                    <el-table-column label="操作" align="center" width="200">
                        <template slot-scope="scope">
                            <el-button class="op_button" @click="openShowInfoDialog(scope.row)">查看</el-button>
                            <el-button type="primary" icon="el-icon-edit" size="mini" circle
                                       @click="openEditDialog(scope.row)"></el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini" circle
                                       @click="openDeleteConfirm(scope.row)"
                                       :disabled="scope.row.isParent == 1"></el-button>
                        </template>
                    </el-table-column>
                </el-table>


        </el-card>





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


        <!-- 修改資料的表單 -->
        <el-dialog title="修改商品詳情" :visible.sync="editFormDialogVisible">
            <el-form :model="editForm"  :label-width="formLabelWidth">
                <el-form-item label="收貨人" prop="receiverName">
                    <el-input v-model="editForm.receiverName"></el-input>
                </el-form-item>
                <el-form-item label="收貨人電話" prop="receiverPhone">
                    <el-input v-model="editForm.receiverPhone"></el-input>
                </el-form-item>
                <el-form-item label="總金額" prop="totalPrice">
                    <el-input v-model="editForm.totalPrice"></el-input>
                </el-form-item>
                <el-form-item label="支付方式" prop="payMethod">
                    <el-input v-model="editForm.payMethod"></el-input>
                </el-form-item>
                <el-form-item label="訂單狀態" prop="orderState">
                    <el-input v-model="editForm.orderState"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editFormDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleEdit()">確 定</el-button>
            </div>
        </el-dialog>

        <!-- 展示訂單詳情的彈出框 -->
        <el-dialog class="order-preview-dialog" title="查看訂單詳情" :visible.sync="infoDialogVisible">
            <el-descriptions :column="1" border label-class-name="description-label">
                <el-descriptions-item label="訂單ID">{{ order.id }}</el-descriptions-item>
                <el-descriptions-item label="訂單編號">{{ order.orderNo }}</el-descriptions-item>
                <el-descriptions-item label="收貨人">{{order.receiverName }}</el-descriptions-item>
                <el-descriptions-item label="收貨人電話">{{order.receiverPhone }}</el-descriptions-item>
                <el-descriptions-item label="收貨人地址">{{ order.receiverAddress }}</el-descriptions-item>
                <el-descriptions-item label="商品詳情" >{{ order.orderItemList }}</el-descriptions-item>

            </el-descriptions>

        </el-dialog>



    </div>
</template>

<script>
    import BaseUrl from "@/http/BaseUrl";
    import TokenAxios from "@/http/TokenAxios";


    export default {
        data() {
            return {
                // 表格資料
                tableData: [],
                // 分頁相關資料
                currentPage: this.$router.currentRoute.query.page ? parseInt(this.$router.currentRoute.query.page) : 1,
                pageSize: 20,
                total: 0,
                // 編輯對話框相關資料
                editFormDialogVisible: false,
                editForm: {
                    receiverName:'',
                    receiverPhone:'',
                    receiverAddress:'',
                    totalPrice:'',
                    payMethod:'',
                    orderState:''
                },
                // 顯示訂單詳情相關資料
                infoDialogVisible: false,
                order: {},
                orderItemList: [{
                    orderItemId:'',
                    goodsId:'',
                    goodsCoverUrl: '',
                    goodsTitle:'',
                    goodsNum:'',
                    saleUnitPrice: ''
                }],
                // 編輯表單的label寬度
                formLabelWidth: '120px'
            };
        },

        methods: {

            // 切換分頁
            changePage(page) {
                this.$router.replace('?page=' + page);
                this.loadOrderList();
            },
            //彈出顯示訂單詳情對話框
            openShowInfoDialog(order) {
                let url = BaseUrl.ADMIN_MALL + '/orders/' + order.id;
                console.log('url = ' + url);

                TokenAxios.get(url).then((response) => {
                    let jsonResult = response.data;
                    if (jsonResult.state == 20000) {
                        this.order = jsonResult.data;
                        this.infoDialogVisible = true;
                    } else {
                        this.$alert(jsonResult.message, '警告', {
                            confirmButtonText: '確定',
                            callback: action => {
                                this.loadOrderList();
                            }
                        });
                    }
                });
            },
            //彈出修改對話框
            openEditDialog(order) {
                let url = BaseUrl.ADMIN_MALL + '/orders/' + order.id;
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
                                this.loadOrderList();
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
            //執行修改
            handleEdit() {
                let url = BaseUrl.ADMIN_MALL + '/orders/' + this.editForm.id + '/update';
                console.log('url = ' + url);

                let formData = this.qs.stringify(this.editForm);
                console.log('formData = ' + formData);

                TokenAxios.post(url, this.editForm).then((response) => {
                    let jsonResult = response.data;
                    if (jsonResult.state == 20000) {
                        this.$message({
                            message: '修改訂單成功！',
                            type: 'success'
                        });
                        this.editFormDialogVisible = false;
                        this.loadOrderList();
                    } else if (jsonResult.state = 40400) {
                        this.$alert(jsonResult.message, '錯誤', {
                            confirmButtonText: '確定',
                            callback: action => {
                                this.loadOrderList();
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
            //彈出删除確認框
            openDeleteConfirm(order) {
                let message = '將永久删除【' + order.title + '】訂單，是否繼續？';
                this.$confirm(message, '提示', {
                    confirmButtonText: '確定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.handleDelete(order);
                }).catch(() => {
                });
            },
            //執行删除
            handleDelete(order) {
                let url = BaseUrl.ADMIN_MALL + '/orders/' + order.id + '/delete';
                console.log('url = ' + url);

                TokenAxios.post(url).then((response) => {
                    let jsonResult = response.data;
                    if (jsonResult.state == 20000) {
                        this.$message({
                            message: '删除成功！',
                            type: 'success'
                        });
                        this.loadOrderList();
                    } else if (jsonResult.state == 40400) {
                        this.$alert(jsonResult.message, '錯誤', {
                            confirmButtonText: '確定',
                            callback: action => {
                                this.loadOrderList();
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
            // 加載訂單列表
            loadOrderList() {
                let page = this.$router.currentRoute.query.page;
                if (!page) {
                    page = 1;
                }

                let url = BaseUrl.ADMIN_MALL + '/orders?page=' + page;
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
            this.loadOrderList();
        }
    }
</script>

<style>
    .order-preview-dialog {
    }

    .order-preview-dialog .description-label {
        width: 150px;
    }

    .order-preview-dialog .picture-item {
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
