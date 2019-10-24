<template>
  <Row style="background:#eee;padding:20px">
    <i-col span="24">
      <!-- <input type="file" accept=".xlsx, .xls" @change="read" /> -->
      <Upload :action="uploadApi" :before-upload="beforeUpload">
        <Button icon="ios-cloud-upload-outline">Upload files</Button>
      </Upload>
    </i-col>
  </Row>
</template>

<script>
import XLSX from "xlsx";
import * as utils from "lottery-utils";

export default {
  name: "xlsx2json",
  data() {
    return {
      outputs: [],
      uploadApi: "//jsonplaceholder.typicode.com/posts/"
    };
  },
  methods: {
    async read(e) {
      let exl = e.target.files[0];
      if (!exl) {
        return false;
      } else if (!/\.(xls|xlsx)$/.test(exl.name.toLowerCase())) {
        throw new Error("上传格式不正确，请上传xls或者xlsx格式");
        return false;
      }
      let output = await xlsx2js(exl);
      console.log(output);
    },
    beforeUpload(file) {
      this.reafile(file);
      return false;
    },
    async reafile(file) {
      let res = await this.readExcel(file);
    },
    readExcel(files) {
      //表格导入
      var that = this;
      if (!files) {
        return false;
      } else if (!/\.(xls|xlsx)$/.test(files.name.toLowerCase())) {
        this.$Message.error("上传格式不正确，请上传xls或者xlsx格式");
        return false;
      }

      const fileReader = new FileReader();
      // FileReader.onabort
      // FileReader.onerror
      // FileReader.onprogress
      // FileReader.onloadend
      fileReader.onabort = ev => {
        console.log("onabort");
        console.log(ev);
      };
      fileReader.onloadstart = ev => {
        console.log("onloadstart");
        console.log(ev);
      };
      fileReader.onprogress = ev => {
        console.log("onprogress");
        console.log(ev);
      };
      fileReader.onloadend = ev => {
        console.log("onloadend");
        console.log(ev);
      };
      fileReader.onerror = ev => {
        console.log("onerror");
        console.log(ev);
      };

      fileReader.onload = ev => {
        try {
          const data = ev.target.result;
          const workbook = XLSX.read(data, {
            type: "binary"
          });
          console.log('workbook');
          console.log(workbook);
          const wsname = workbook.SheetNames[0]; //取第一张表
          const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]); //生成json表格内容
          console.log('ws');
          console.log(ws);
          // that.outputs = []; //清空接收数据
          // //编辑数据
          // for (var i = 0; i < ws.length; i++) {
          //   var sheetData = {
          //     title: ws[i].Title,
          //     path: ws[i].Url,
          //     desc: ws[i].Desc
          //   };
          //   that.outputs.push(sheetData);
          // }
          // console.log(that.outputs);/
        } catch (e) {
          return false;
        }
      };
      fileReader.readAsBinaryString(files);
    }
  },
  mounted() {
    // run.
    let arr = [parseInt(Math.random() * 100)];
    let res = utils.combination(arr);
    // console.log(res);
    // console.log(testrun.run('hello'));
  }
};
</script>

<style lang="scss" scoped>
</style>
