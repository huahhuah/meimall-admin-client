<template>
  <div>
    <!-- 頂部的麵包屑導航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 16px;">
      <el-breadcrumb-item :to="{ path: '/' }"><i class="el-icon-s-promotion"></i> 後臺管理</el-breadcrumb-item>
      <el-breadcrumb-item>商城管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-divider content-position="left"></el-divider>
    <el-empty description="商城管理主頁正在開發中，敬請期待……"></el-empty>
  </div>
</template>

<script>
export default {
}
</script>

<style scoped>

</style>
