<template>
  <el-row class="home" :gutter="20">
  <el-col :span="8" style="margin-top: 20px;">
    <el-card shadow="hover">
      <div class="user">
        <img src="../../assets//images/user.jpg" alt=""/>
        <div class="userinfo">
          <p class="name">Admin</p>
          <p class="role">超级管理员</p>
        </div>
      </div>
      <div class="login-info">
        <p>上次登陆时间：<span>2024-4-2</span></p>
        <p>登录地点：<span>四川</span></p>
      </div>
    </el-card>
    <el-card shadow="hover" style="margin-top: 20px" height="450px">
      <el-table :data="tableData">
        <el-table-column
        v-for="(val,key) in tableLabel" 
        :key="key" 
        :prop="key" 
        :label="val"></el-table-column>
      </el-table>     
    </el-card>
  </el-col>
  <el-col :span="16" style="margin-top: 20px">
    <div class="num">
      <el-card 
      :body-style="{display:'flex',padding:0}" 
      v-for="item in countData"
      :key="item.name">
      <component 
      class="icons" 
      :is="item.icon" 
      :style="{background:item.color}"
      ></component>
      <div class="detail">
        <p class="num">¥{{ item.value }}</p>
        <p class="txt">{{ item.name }}</p>
      </div>
      </el-card>
    </div>
    <el-card style="height: 280px;">
      <div ref="echart" style="height: 280px; width:1150px"></div>
    </el-card>
    <div class="graph">
      <el-card style="height: 260px;">
        <div ref="userechart" style="height: 240px; width: 500px;"></div>
      </el-card>
      <el-card style="height: 260px;">
        <div ref="videoechart" style="height: 240px; width: 500px"></div>
      </el-card>
    </div>
  </el-col>
  </el-row>
</template>
<script>
import { defineComponent,getCurrentInstance,onMounted,reactive,ref} from "vue";
import * as echarts from 'echarts'
import axios from 'axios';
export default defineComponent({
  setup() {
    const {proxy}=getCurrentInstance();
    let tableData=ref([]);
    let countData=ref([]);
    const tableLabel={
      name:'课程',
      todayBuy:'今日购买',
      monthBuy:'本月购买',
      totalBuy:'总购买',
    };
    const getTableList=async()=>{
      // await axios.get("/home/getData").then((res)=>{
      //   tableData.value=res.data.data.tableData;
      // })
     let res=await proxy.$api.getTableData();
     //console.log(res);
     tableData.value=res;
    }

    //获取首页count数据
    const getCountData=async()=>{
      let res=await proxy.$api.getCountData()
      countData.value=res;
    }
    onMounted(()=>{
      getTableList();
      //获取count数据
      getCountData();
      //获取echarts表格数据
      getChartData();
    })
    //关于echarts表格的渲染
    let xOptions=reactive({
      // 图例文字颜色
      textStyle: {
        color: "#333",
      },
      grid: {
        left: "20%",
      },
      // 提示框
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        type: "category", // 类目轴
        data: [],
        axisLine: {
          lineStyle: {
            color: "#17b3a3",
          },
        },
        axisLabel: {
          interval: 0,
          color: "#333",
        },
      },
      yAxis: [
        {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#17b3a3",
            },
          },
        },
      ],
      color: ["#2ec7c9", "#b6a2de", "#5ab1ef", "#ffb980", "#d87a80", "#8d98b3"],
      series: [],
    })
    let pieOptions=reactive({
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
      series: [],
    }
    )
    let orderData=reactive({
      xData:[],
      series:[],
    });
    let userData=reactive({
      xData:[],
      series:[],
    });
    let videoData=reactive({
      series:[]
    });
    //获取数据
    const getChartData=async()=>{
      let result=await proxy.$api.getChartData();
      //console.log(result);
      let res =result.orderData
      let userRes=result.userData
      let videoRes=result.videoData
      orderData.xData=res.date;
      const keyArray=Object.keys(res.data[0])
      const series=[]
      keyArray.forEach((key)=>{
        series.push({
          name:key,
          data:res.data.map(item=>item[key]),
          type:"line",
        })
      })
      orderData.series=series;
      xOptions.xAxis.data=orderData.xData;
      xOptions.series=orderData.series;
      //userData进行渲染
      let hEcharts=echarts.init(proxy.$refs['echart'])
      hEcharts.setOption(xOptions);

      //柱状图进行渲染
      userData.xData=userRes.map((item)=>item.date);
      userData.series=[
        {
          name:'新增用户',
          data:userRes.map(item=>item.new),
          type:"bar",
        },
        {
          name:'活跃用户',
          data:userRes.map(item=>item.active),
          type:"bar",
        }
      ];
      xOptions.xAxis.data=userData.xData;
      xOptions.series=userData.series;
      let uEcharts=echarts.init(proxy.$refs["userechart"]);
      uEcharts.setOption(xOptions);
      videoData.series=[
        {
          data:videoRes,
          type:"pie",
        }
      ];
      pieOptions.series=videoData.series
      let vEcharts=echarts.init(proxy.$refs["videoechart"]);
      vEcharts.setOption(pieOptions);
    }
    return{
      tableData,
      tableLabel,
      countData:[
                {
                    name:"今日支付订单",
                    value:"1234",
                    icon:"CircleCheck",
                    color:"#2ec7c9",
                },
                {
                    name:"今日收藏订单",
                    value:"210",
                    icon:"Star",
                    color:"#ffb980",
                },
                {
                    name:"今日未支付订单",
                    value:"1234",
                    icon:"Goods",
                    color:"#5ab1ef",
                },
                {
                    name:"本月支付订单",
                    value:"1234",
                    icon:"CircleCheck",
                    color:"#2ec7c9",
                },
                {
                    name:"本月收藏订单",
                    value:"210",
                    icon:"Star",
                    color:"#ffb980",
                },
                {
                    name:"本月未支付订单",
                    value:"1234",
                    icon:"Goods",
                    color:"#5ab1ef",
                },
            ],
          }
        },
        })
</script>

<style lang="less" scoped>
.home{
  .user{
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 1px solid #ccc;
    margin-bottom: 20px;
    img{
      width:150px;
      height: 150px;
      border-radius: 50%;
      margin-right: 40px;
    }
  }
  .login-info{
    p{
      line-height: 30px;
      font-size: 14px;
      color: #999;
      span{
        color: #666;
        margin-left:50px;
      }
    }
  }
  .num{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .el-card{
      width: 32%;
      margin-bottom: 20px;
    }
    .icons{
      width:80px;
      height: 80px;
      font-size: 30px;
      text-align: center;
      line-height: 80px;
      color: #fff;
    }
    .detail{
      margin-left: 15px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .num{
        font-size: 30px;
        margin-bottom: 10px;
      }
      .txt{
        font-size: 14px;
        text-align: center;
        color: #999;
      }
    }
  }
  .graph{
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    .el-card{
      width: 48%;
    }
  }
}
</style>