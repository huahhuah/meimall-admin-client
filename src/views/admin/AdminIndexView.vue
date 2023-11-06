<template>
    <div>
        <!-- 頂部的麵包屑導航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 16px;">
            <el-breadcrumb-item :to="{ path: '/' }"><i class="el-icon-s-promotion"></i> 後臺管理</el-breadcrumb-item>
        </el-breadcrumb>
        <br>

        <el-row>
            <el-col :span="8" style="padding-right: 10px">
                <el-card class="box-card">
                    <div class="user">
                        <img src="../../assets/images/root1.jpg"/>
                        <div class="userinfo">
                            <p class="name">Root</p>
                            <p class="access">超級管理員</p>
                        </div>
                    </div>
                    <div class="login-info">
                        <p>上次登入時間: <span>2023-10-26</span></p>
                        <p>上次登入地點: <span>台北</span></p>
                    </div>
                </el-card>

                <el-card style="margin-top: 20px;height: 460px">
                    <el-table
                            :data="tableData"
                            style="width: 100%">
                        <el-table-column v-for="(val, key) in tableLabel" :prop="key" :label="val"/>
                    </el-table>
                </el-card>

            </el-col>

            <el-col :span="16" style="padding-left: 10px">
                <div class="num">
                    <el-card v-for="item in countDate" :key="item.name" :body-style="{ display: 'flex', padding: 0}">
                        <i class="icon" :class="`el-icon-${item.icon}`" :style="{ background: item.color}"></i>
                        <div class="detail">
                            <p class="price">${{item.value}}</p>
                            <p class="desc">{{item.name}}</p>
                        </div>
                    </el-card>
                </div>
                <el-card style="height: 280px">
                    <!-- 折線圖-->
                    <div ref="echarts1" style="height:280px "></div>
                </el-card>
                <div class="graph">
                    <el-card style="height: 260px">
                        <div ref="echarts2" style="height: 260px"></div>
                    </el-card>
                    <el-card style="height: 260px">
                        <div ref="echarts3" style="height: 260px"></div>
                    </el-card>
                </div>
            </el-col>
        </el-row>
    </div>
</template>


<script>
    import {getData} from '@/api'
    import * as echarts from 'echarts'

    export default {
        data() {
            return {
                tableData: [],
                tableLabel: {
                    name: '品名',
                    todayBuy: '今日購買',
                    monthBuy: '本月購買',
                    totalBuy: '總購買',
                },
                countDate: [
                    {
                        name: "今日支付訂單",
                        value: 1234,
                        icon: "success",
                        color: "#2ec7c9",
                    },
                    {
                        name: "今日收藏訂單",
                        value: 210,
                        icon: "star-on",
                        color: "#ffb980",
                    },
                    {
                        name: "今日未支付訂單",
                        value: 1234,
                        icon: "s-goods",
                        color: "#5ab1ef",
                    },
                    {
                        name: "本月支付訂單",
                        value: 1234,
                        icon: "success",
                        color: "#2ec7c9",
                    },
                    {
                        name: "本月收藏訂單",
                        value: 210,
                        icon: "star-on",
                        color: "#ffb980",
                    },
                    {
                        name: "本月未支付訂單",
                        value: 1234,
                        icon: "s-goods",
                        color: "#5ab1ef",
                    },
                ]
            }
        },
        mounted() {
            getData().then(({data}) => {
                const {tableData} = data.data
                console.log(data.data)
                this.tableData = tableData

                //基於準備好的dom. 初始化echarts實例
                const echarts1 = echarts.init(this.$refs.echarts1)
                //指定圖表的配置項和數據
                var echarts1Option = {};
                //處理數據xAxis
                const {orderData, userData, videoData} = data.data
                const xAxis = Object.keys(orderData.data[0])
                const xAxisData = {
                    data: xAxis
                }
                echarts1Option.xAxis = xAxisData
                echarts1Option.yAxis = {}
                echarts1Option.legend = xAxisData
                echarts1Option.series = []
                xAxis.forEach(key => {
                    echarts1Option.series.push({
                        name: key,
                        data: orderData.data.map(item => item[key]),
                        type: 'line'
                    })
                })
                console.log(echarts1Option)
                //使用剛指定的配置項和數據顯示圖表
                echarts1.setOption(echarts1Option)

                //柱狀圖
                const echarts2 = echarts.init(this.$refs.echarts2)
                const echarts2Option = {
                    legend: {
                        //圖例文字顏色
                        textStyle: {
                            color: "#333",
                        },
                    },
                    grid: {
                        trigger: "axis",
                    },
                    xAxis: {
                        type: "category",  //類目軸
                        data: userData.map(item => item.date),
                        axisLine: {
                            lineStyle: {
                                color: "#17b3a3",
                            },
                        },
                        axisLabel1: {
                            interval: 0,
                            color: "#333",
                        },
                    },
                    yAxis: [
                        {
                            type: "value",
                            axisLine: {
                                lineStyle: {
                                    color: "#17b3a3"
                                },
                            },
                        },
                    ],
                    color: ["#2ec7c9", "#b6a2de"],
                    series: [
                        {
                            name: '新增用戶',
                            data: userData.map(item => item.new),
                            type: 'bar'
                        },
                        {
                            name: '活躍用戶',
                            data: userData.map(item => item.active),
                            type: 'bar'
                        }
                    ],
                }
                echarts2.setOption(echarts2Option)

                //餅狀圖
                const echarts3 = echarts.init(this.$refs.echarts3)
                const echarts3Option = {
                    tooltip: {
                       trigger: "item",
                    },
                    color: [
                        "#0f78f4",
                        "#dd536b",
                        "#9462e5",
                        "#a6a6a6",
                        "#e1bb22",
                        "#39c362",
                        "#3ed1cf",
                    ],
                  series: [
                        {
                            data: videoData,
                            type: 'pie'
                        }
                    ],
                }
                echarts3.setOption(echarts3Option)
            })
        }
    }
</script>

<style lang="less" scoped>
    .user {
        padding-bottom: 20px;
        margin-bottom: 20px;
        border-bottom: 1px solid #ccc;
        display: flex;
        align-items: center;

        img {
            margin-right: 40px;
            width: 130px;
            height: 130px;
            borde-radius: 50%;
        }
    }

    .userinfo {
        .name {
            font-size: 32px;
            margin-bottom: 10px;
        }

        .access {
            color: #999999;
        }
    }

    .login-info {
        p {
            line-height: 28px;
            font-size: 14px;
            color: #999999;
        }

        span {
            color: #666666;
            margin-left: 60px;
        }
    }

    .num {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;

        .icon {
            width: 80px;
            height: 80px;
            font-size: 30px;
            text-align: center;
            line-height: 80px;
            color: #fff;
        }

        .detail {
            margin-left: 15px;
            display: flex;
            flex-direction: column;
            justify-content: center;

            .price {
                font-size: 30px;
                margin-bottom: 10px;
                line-height: 30px;
                height: 30px;
            }

            .desc {
                font-size: 14px;
                color: #999;
                text-align: center;
            }
        }

        .el-card {
            width: 32%;
            margin-bottom: 20px;
        }
    }

    .graph {
        margin-top: 20px;
        display: flex;
        justify-content: space-between;

        .el-card {
            width: 48%;
        }
    }


    html, body, h3, p {
        margin: 0;
        padding: 0;
    }

</style>
