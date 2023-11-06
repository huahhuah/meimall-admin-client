import axios from "axios";

const http = axios.create({
    //通用請求的地址前綴
    baseURL: '/api',
    timeout: 10000, //超時時間
})

//添加請求攔截器
http.interceptors.request.use(function (config) {
    //再發達請求之前做些甚麼
    return config;
}, function (error) {
    //對請求錯誤做些甚麼
    return Promise.reject(error);
})

//添加響應攔截器
http.interceptors.response.use(function (response) {
    //對應數據做點甚麼
    return response;
}, function (error) {
    //對響應錯誤做點甚麼
    return Promise.reject(error);
});

export default  http
