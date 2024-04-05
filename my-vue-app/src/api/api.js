import request from "./request";
export default{
  //home组件 左侧表格数据获取
  getTableData(params){
    return request({
      url:'/home/getTableData',
      method:'get',
      data:params,
      mock:true,
    })
  },
  getCountData(){
    return request({
      url:'/home/getCountData',
      method:'get',
      mock:true
    })
  },
  getChartData(){
    return request({
      url:'/home/getChartData',
      method:'get',
      mock:true
    })
  },
  getUserData(params){
    return request({
      url:'/user/getUser',
      method:'get',
      mock:false,
      data:params
      //data;{total:0,page:1}
    })
  }
}