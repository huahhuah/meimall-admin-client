<template>
  <div>
    <!-- 頂部麵包屑標示與導航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 16px;">
      <el-breadcrumb-item :to="{ path: '/' }"><i class="el-icon-s-promotion"></i> 後臺管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/admin/content' }">内容管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/admin/content/article' }">文章管理</el-breadcrumb-item>
      <el-breadcrumb-item>新增文章</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>

    <!-- 添加資料的表單 -->
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
      <el-form-item label="文章類别" prop="categoryId">
        <el-select v-model="ruleForm.categoryId" placeholder="請選擇文章類别">
          <el-option
                  v-for="item in categoryOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="標題" prop="title">
        <el-input v-model="ruleForm.title"></el-input>
      </el-form-item>
      <el-form-item label="摘要" prop="brief">
        <el-input type="textarea" v-model="ruleForm.brief"
                  :autosize="{ minRows: 3, maxRows: 5}"
                  maxlength="255" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="封面圖" prop="coverUrl">
        <div class="picture-preview" v-if="ruleForm.coverUrl">
          <el-image class="image"
                    :src="ruleForm.coverUrl"
                    fit="cover"></el-image>
        </div>
        <el-upload
            class="picture-uploader"
            action="http://localhost:19082/resources/upload/image/article"
            :show-file-list="false"
            :on-success="handleUploadSuccess">
          <i class="el-icon-upload picture-uploader-icon"></i>
          <div class="picture-uploader-text">僅允許上傳 <i>JPG</i> / <i>PNG</i> 格式的圖片</div>
          <div class="picture-uploader-text">僅允許上傳不超過 <i>5MB</i> 的圖片</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章詳情">
        <div id="wangEditor"></div>
      </el-form-item>

      <el-form-item label="排序序號" prop="sort">
        <el-input v-model="ruleForm.sort"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">新增</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
        <el-button type="warning" @click="gotoList">返回列表</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import BaseUrl from "@/http/BaseUrl";
  import TokenAxios from "@/http/TokenAxios";

export default {
  data() {
    return {
      // 父級類别的下拉菜單的選項資料
      categoryOptions: [],
      // 表單
      ruleForm: {
        categoryId: '',
        title: '',
        brief: '',
        coverUrl: '',
        sort: ''
      },
      // 表單規則
      rules: {
        categoryId: [
          {required: true, message: '請選擇文章類别', trigger: 'change'}
        ],
        title: [
          {required: true, message: '請輸入標題', trigger: 'blur'},
          {min: 2, max: 150, message: '長度在 2 到 150 個字符', trigger: 'blur'}
        ],
        brief: [
          {required: true, message: '請輸入摘要', trigger: 'blur'},
          {min: 2, max: 255, message: '長度在 2 到 255 個字符', trigger: 'blur'}
        ],
        coverUrl: [
          {required: true, message: '請上傳封面圖', trigger: 'blur'}
        ],
        sort: [
          {required: true, message: '請輸入排序序號', trigger: 'blur'},
          {pattern: /^(\d{1}|[1-9]{1}[0-9]{1})$/, message: '排序序號必須是0~99之間的值', trigger: 'blur'}
        ]
      },
      // 富文本編輯器
      editor: {}
    };
  },
  methods: {
    // 返回列表
    gotoList() {
      this.$router.push('./');
    },
    // 初始化富文本编辑器
    initWangEditor() {
      this.editor = new this.wangEditor('#wangEditor');
      this.editor.config.uploadImgServer = "http://localhost:19082/resources/upload/image/article"
      this.editor.config.uploadFileName = 'file';
      this.editor.config.uploadImgHooks = {
        customInsert: function(insertImgFn, result) {
          insertImgFn(result.data.url);
        }
      }
      this.editor.config.zIndex = 1;
      this.editor.create();
    },
    // 上傳成功後的回調
    handleUploadSuccess(response) {
      console.log(response)
      if (response.state == 20000) {
        this.ruleForm.coverUrl = response.data.url;
      } else {
        let title = '操作失敗';
        this.$alert(response.message, title, {
          confirmButtonText: '確定',
          callback: action => {
          }
        });
      }
    },
    // 提交表單
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let url = BaseUrl.ADMIN_CONTENT + '/articles/add-new';
          console.log('url = ' + url);


          this.ruleForm.detail = this.editor.txt.html();
          let formData = this.qs.stringify(this.ruleForm);
          console.log('formData = ' + formData);

          TokenAxios.post(url, this.ruleForm).then((response) => {
            let jsonResult = response.data;
            if (jsonResult.state == 20000) {
              this.$message({
                message: '新增文章成功！',
                type: 'success'
              });
              this.resetForm(formName);
            } else {
              this.$alert(jsonResult.message, '錯誤', {
                confirmButtonText: '確定',
                callback: action => {
                }
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    // 重置表單
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.editor.txt.clear();
    },
    // 加載類别列表
    loadCategoryTemplateList() {
      let url = BaseUrl.ADMIN_CONTENT + '/categories?queryType=all';
      console.log('url = ' + url);

      TokenAxios.get(url).then((response) => {
        let jsonResult = response.data;
        if (jsonResult.state == 20000) {
          let categoryTemplateList = jsonResult.data.list;
          this.categoryOptions = categoryTemplateList;
        } else {
          this.$message.error(jsonResult.message);
        }
      });
    }
  },
  mounted() {
    this.loadCategoryTemplateList();
    this.initWangEditor();
  }
}
</script>

<style>
.picture-uploader {
  float: left;
  width: 240px;
  height: 135px;
  margin-right: 20px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.picture-uploader .picture-uploader-icon {
  width: 240px;
  height: 80px;
  font-size: 58px;
  color: #8c939d;
  line-height: 80px;
  text-align: center;
}

.picture-uploader .picture-uploader-text {
  width: 240px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  font-size: 10px;
  color: #8c939d;
}

.picture-uploader .picture-uploader-text i {
  font-size: 10px;
  font-weight: bold;
  font-style: normal;
  color: #F56C6C;
}

.picture-preview {
  width: 240px;
  height: 135px;
  margin-right: 20px;
  border: 1px solid #e8e6e6;
  border-radius: 6px;
  float: left;
  display: inline;
  position: relative;
}

.picture-preview .image {
  width: 240px;
  height: 135px;
  border-radius: 6px;
}
</style>
