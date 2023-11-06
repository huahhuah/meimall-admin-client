import http from '../utils/request'

//請求首頁數據
export const  getData = () => {
    //返回一個promise對象
    return http.get('/index/getData')
}
