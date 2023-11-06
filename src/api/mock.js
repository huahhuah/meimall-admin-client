import Mock from 'mockjs'
import indexApi from './mockServeDate/index'
import {getData} from "@/api/index";

//定義mock請求攔截
Mock.mock('/api/index/getData', indexApi.getStatisticalData)



