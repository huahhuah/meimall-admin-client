import Mock from 'mockjs'
//圖表數據
let List = []
export  default {
    getStatisticalData: () => {
        //Mock.Random.float 產生隨機數100到8000之間 保留小數 最小0位 最大0位
        for (let i = 0; i < 7; i++) {
            List.push(
                Mock.mock({
                    瑪德蓮: Mock.Random.float(100, 8000, 0, 0),
                    客製蛋糕: Mock.Random.float(100, 8000, 0, 0),
                    可麗露: Mock.Random.float(100, 8000, 0, 0),
                    軟餅乾: Mock.Random.float(100, 8000, 0, 0),
                    磅蛋糕: Mock.Random.float(100, 8000, 0, 0),
                    肉桂捲: Mock.Random.float(100, 8000, 0, 0),
                    日式布丁: Mock.Random.float(100, 8000, 0, 0)
                })
            )
        }
        return {
            code: 2000,
            data: {
                //餅圖
                videoData: [
                    {
                        name: '瑪德蓮',
                        value: 2999
                    },
                    {
                        name: '客制蛋糕',
                        value: 5999
                    },
                    {
                        name: '可麗露',
                        value: 1500
                    },
                    {
                        name: '軟餅乾',
                        value: 1999
                    },
                    {
                        name: '磅蛋糕',
                        value: 2200
                    },
                    {
                        name: '肉桂捲',
                        value: 4500
                    },
                    {
                        name: '日式布丁',
                        value: 1800
                    }
                ],
                //柱狀圖
                userData: [
                    {
                        date: '周一',
                        new: 5,
                        active: 200
                    },
                    {
                        date: '周二',
                        new: 10,
                        active: 500
                    },
                    {
                        date: '周三',
                        new: 12,
                        active: 550
                    },
                    {
                        date: '周四',
                        new: 20,
                        active: 650
                    },
                    {
                        date: '周五',
                        new: 40,
                        active: 670
                    },
                    {
                        date: '周六',
                        new: 53,
                        active: 770
                    },
                    {
                        date: '周日',
                        new: 33,
                        active: 170
                    }
                ],
                //折線圖
                orderData: {
                    date: ['20231001', '20231002', '20231003', '20231004', '20231005', '20231006', '20231007'],
                    data: List
                },
                tableData: [
                    {
                        name: '瑪德蓮',
                        todayBuy: 500,
                        monthBuy: 3500,
                        totalBuy: 22000,
                    },
                    {
                        name: '客制蛋糕',
                        todayBuy: 300,
                        monthBuy: 2200,
                        totalBuy: 29000,
                    },
                    {
                        name: '可麗露',
                        todayBuy: 450,
                        monthBuy: 2500,
                        totalBuy: 20800
                    },
                    {
                        name: '軟餅乾',
                        todayBuy: 150,
                        monthBuy: 1200,
                        totalBuy: 20500,
                    },
                    {
                        name: '磅蛋糕',
                        todayBuy: 380,
                        monthBuy: 4500,
                        totalBuy: 28000,
                    },
                    {
                        name: '肉桂捲',
                        todayBuy: 500,
                        monthBuy: 4500,
                        totalBuy: 25000,
                    },
                    {
                        name: '日式布丁',
                        todayBuy: 200,
                        monthBuy: 1500,
                        totalBuy: 21000,
                    }
                ]
            }
        }
    }
}
