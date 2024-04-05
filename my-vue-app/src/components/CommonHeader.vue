
<template>
  <el-header>
    <div class="l-content">
      <el-button size="small" plain @click="handleCollapse">
        <el-icon :size="20"><Menu/></el-icon>
      </el-button>
      <el-breadcrumb separator="/" class="bread">
        <!-- 首页是一定存在的所以直接写死 -->
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="current.path" v-if="current">{{current.label}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="r-content">
      <el-dropdown>
        <span class="el-dropdown-link">
         <img class="user"
         :src="getImgeUrl('user')" alt="" />
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>个人中心</el-dropdown-item>
            <el-dropdown-item>退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
</template>
<script>
import { computed, defineComponent } from 'vue-demi';
import { useStore } from 'vuex'; 
export default defineComponent({
  setup(){ 
    let store=useStore()
    let getImgeUrl=(user)=>{
  //console.log(import.meta.url);
  //console.log(new URL(`../assets/images/${user}.jpg`,import.meta.url));
  return new URL(`../assets/images/${user}.jpg`,import.meta.url).href;
};
let handleCollapse=()=>{
  //调用vuex中的mutations
  store.commit('updateIsCollapse');
};
//计算属性
const current=computed(()=>{
  return store.state.currentMenu;
})
    return{
      //imgSrc,
      getImgeUrl,
      handleCollapse,
      current,
    };
  },
});
</script>
<style lang="less" scoped>
header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background: #333;
}
.r-content{
  .user{
    width:40px;
    height: 40px;
    border-radius: 50%;
  }
}
.l-content{
  display: flex;
  align-items: center;
  .el-button{
    margin-right: 20px;
  }
  h3{
    color:#fff;
  }
}
.bread /deep/ span{
  color: #fff !important;
  cursor: pointer !important;
}

</style>

