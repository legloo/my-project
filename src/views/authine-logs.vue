<template>
  <div class="container">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="标题">
        <el-input v-model="formInline.title" placeholder="标题"></el-input>
      </el-form-item>
      <el-form-item label="完成时间">
        <el-input v-model="formInline.time" placeholder="完成时间"></el-input>
      </el-form-item>
      <el-form-item label="月份">
        <el-input v-model="formInline.month" placeholder="月份"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-show="!isEdit" @click="onSubmit">创建</el-button>
        <el-button type="primary" v-show="isEdit" @click="onSubmit">保存编辑</el-button>
      </el-form-item>
      <el-form-item label="月份过滤">
        <el-select v-model="currentMonth" placeholder="请选择月份" @change="monthChange">
          <el-option v-for="item in monthOptions" :key="'month'+item" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="人天总计:">
        <el-input v-model="totalTime" readonly></el-input>
      </el-form-item>
    </el-form>
    <el-table border :data="tableData" stripe style="width: 100%" height="750">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="title" label="任务"></el-table-column>
      <el-table-column prop="workItem" label="工时（人天）"></el-table-column>
      <el-table-column prop="month" label="月份"></el-table-column>
      <el-table-column prop="timeFormat" label="创建时间"></el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row,'edit')" type="text" size="small">编辑</el-button>
          <!-- <el-button @click="handleClick(scope.row,'delete')" type="text" size="small">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import moment from "moment";
const monthOptions = new Array(12).fill(0).map((x, index) => (x = index + 1));
import { addAuLog, patchAuLog, deleteAuLog, getAuLog } from "../apis/apis";
export default {
  data() {
    return {
      totalTime: 0,
      isEdit: false,
      editItem: null,
      tableData: [],
      url: "/domain/api/authine_logs",
      currentMonth: 1,
      monthOptions,
      formInline: {
        title: "",
        time: "",
        month: "",
      },
    };
  },
  created() {
    // this.currentMonth = new Date().getMonth() + 1;
    this.currentMonth = 12;
    this.init();
  },
  methods: {
    monthChange(e) {
      this.totalTime = 0;
      this.tableData = [];
      this.init();
    },
    async handleClick(e, type) {
      if (type === "edit") {
        this.formInline.title = e.title;
        this.formInline.time = e.workItem;
        this.formInline.month = e.month;
        this.isEdit = true;
        this.editItem = e;
      }
      if (type === "delete") {
        let res = await deleteAuLog(e._id);
        this.init();
      }
    },
    async init() {
      let _filters = {
        month: this.currentMonth,
      };
      let options = {
        limit: 9999,
      };
      let res = await getAuLog(options, _filters);
      if (res.status === 200 && res.data.docs.length) {
        res.data.docs.map((x) => {
          x.timeFormat = moment(x.time).format("YYYY-MM-DD HH:mm:SS");
        });
        this.tableData = res.data.docs;
        this.totalTime = res.data.docs
          .map((x) => Number(x.workItem))
          .reduce((a, b) => a + b);
      }
      this.formInline.title = "";
      this.formInline.title = "";
    },
    async edit() {
      let req = {
        title: this.formInline.title,
        workItem: this.formInline.time,
        month: this.formInline.month,
      };
      let res = await patchAuLog(this.editItem._id, req);
      this.isEdit = false;
      this.formInline.title = "";
      this.formInline.time = "";
      this.formInline.month = "";
      this.init();
    },
    async onSubmit() {
      if (this.isEdit) {
        this.edit();
        return;
      }
      let req = {
        title: this.formInline.title,
        workItem: this.formInline.time,
        month: this.formInline.month,
      };
      const res = await addAuLog(req);
      if (res.status === 201) {
        this.init();
      } else {
        this.$message.error(res.statusText);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  padding: 20px;
}
</style>