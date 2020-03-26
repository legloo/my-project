<template>
  <div>
    <p>hahahaha</p>
    <el-input type="textarea" v-model="text" />
    <button @click="printText">确定</button>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      text: "",
      test: [
        // 131312312312,
        // 12312312sadada,
        // wqeqweqeqqeqwe",
        // "eqwewqewqeqeqeq"
      ]
    };
  },
  methods: {
    printText() {
      // console.log(JSON.stringify(this.text));
      // let f_text = this.text.replace(/\n/g,',')
      // console.log(f_text)
      console.log(
        this.text
          .replace(/\n/g, ",")
          .split(",")
          .filter(x => x !== "")
      );
    },
    getData() {
      axios
        .get(
          "/tencent_cloud_source/bgj/policy/insurance_company_with_icon.json"
        )
        .then(res => {
          console.log(res.data.companies);
        })
        .catch(error => {
          console.warn(error);
        });
    }
  },
  created() {
    this.getData();
    // this.getData2();
    // this.$jsonp(
    //   "https://minipro-1254007989.cos.ap-shanghai.myqcloud.com/bgj/policy/insurance_company_with_icon.json"
    // )
    //   .then(json => {
    //     // Success.
    //     console.log("json");
    //     console.log(json);
    //   })
    //   .catch(err => {
    //     // Failed.
    //     console.log("err");
    //     console.log(err);
    //   });
  }
};
</script>
