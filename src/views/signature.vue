<template>
  <div class="container">
    <div class="content">
      <p class="p_center">{{title1}}</p>
      <p class="p_center">{{title2}}</p>
      <p style="margin: 1rem 0;">（{{dptName}}）：</p>
      <p class="p_indent">本人，{{name}}，{{id}}，{{sId}}，{{sex}}，{{content1}}</p>
      <p class="p_indent">{{content2}}</p>
      <p class="p_right">
        <span>{{signDes}}</span>
        <img
          style="width: 3rem;vertical-align: middle;"
          v-if="signature.length"
          :src="signature"
          alt
        />
      </p>
      <p class="p_right">
        <span>{{phoneDes}}</span>
        <span>{{phone}}</span>
      </p>
      <p style="    margin: 1rem 0 1rem 12rem;" class v-if="time.length">{{time}}</p>
      <p class="notime" v-if="!time.length">
        <span v-for="item in timeDesc" :key="'timesec'+item">{{item}}</span>
      </p>
    </div>
    <div class="btns">
      <van-button size="small" type="info" @click="editshow = true">信息写入</van-button>
      <van-button size="small" type="primary" @click="exportWord">导出Word</van-button>
    </div>

    <popup
      v-model="editshow"
      closeable
      position="bottom"
      :style="{ height: '80%' }"
      :close-on-click-overlay="false"
    >
      <cell-group title="请输入表单">
        <field v-model="form.dptName" required clearable label="代收单位名称" placeholder="请输入代收单位名称" />
        <field v-model="form.name" required clearable label="姓名" placeholder="请输入姓名" />
        <field v-model="form.id" required clearable label="身份证号码" placeholder="请输入身份证号码" />
        <field v-model="form.sId" required clearable label="社保编号" placeholder="请输入社保编号" />
        <field v-model="form.phone" required clearable label="联系电话" placeholder="请输入联系电话" />
        <field
          required
          readonly
          clickable
          label="性别"
          :value="form.sex"
          placeholder="选择性别"
          @click="showSexPicker = true"
        />
        <field
          required
          readonly
          clickable
          label="时间"
          :value="form.time"
          placeholder="选择时间"
          @click="showTimePicker = true"
        />
        <field
          required
          readonly
          clickable
          label="签名"
          placeholder="点击此处写签名"
          @click="showSignPicker = true"
        />
        <img
          style="width: 7rem;
    margin: auto;
    display: block;
    border: 1px solid #eee;"
          v-if="form.signature.length"
          :src="form.signature"
          alt
        />
        <div class="btn_s">
          <van-button size="small" type="primary" @click="saveToDoc">确定</van-button>
          <van-button size="small" @click="editshow = false">取消</van-button>
        </div>
      </cell-group>
    </popup>
    <popup v-model="showSexPicker" position="bottom" :close-on-click-overlay="false">
      <picker
        show-toolbar
        :columns="columns"
        @cancel="showSexPicker = false"
        @confirm="sexOnConfirm"
      />
    </popup>
    <popup v-model="showTimePicker" position="bottom" :close-on-click-overlay="false">
      <datetime-picker type="date" @cancel="showTimePicker = false" @confirm="TimeOnConfirm" />
    </popup>
    <popup v-model="showSignPicker" position="bottom" :close-on-click-overlay="false">
      <vueSignature ref="signature" :sigOption="option" :h="'400px'" :disabled="disabled"></vueSignature>
      <vueSignature ref="signature1" :sigOption="option"></vueSignature>
      <div class="btns_s">
        <van-button type="primary" size="small" @click="save">保存</van-button>
        <van-button type="danger" size="small" @click="clear">重置</van-button>
        <van-button type="warning" size="small" @click="undo">撤销</van-button>
      </div>
    </popup>
  </div>
</template>

<script>
import moment from "moment";
import {
  Button,
  Popup,
  Cell,
  CellGroup,
  Field,
  Picker,
  DatetimePicker
} from "vant";
export default {
  components: {
    vanButton: Button,
    Popup,
    CellGroup,
    Field,
    Picker,
    DatetimePicker
  },
  name: "app",
  data() {
    return {
      showSignPicker: false,
      showTimePicker: false,
      showSexPicker: false,
      columns: ["男", "女"],
      editshow: false,
      //   form: {
      title1: "自愿放弃成都市城乡居民基本医疗保险",
      title2: "参保承诺书",
      dptName: "代收单位名称",
      name: "姓名",
      id: "身份证号码",
      sId: "社保编号",
      sex: "性别",
      content1:
        "经本人慎重考虑，自愿放弃2020年城乡居民基本医疗保险参保，不缴纳相关费用。因自愿放弃参保导致本人未享受到医保待遇的后果和责任完全由本人承担",
      content2: "特此承诺！",
      signDes: "承诺人（签章）：",
      signature: "",
      phoneDes: "联系电话：",
      phone: "",
      timeDesc: ["年", "月", "日"],
      time: "",
      //   },
      form: {
        dptName: "",
        name: "",
        id: "",
        sId: "",
        sex: "",
        phone: "",
        time: "",
        signature: ""
      },
      option: {
        penColor: "rgb(0, 0, 0)",
        backgroundColor: "rgb(255,255,255)"
      },
      disabled: false
    };
  },
  methods: {
    exportWord() {
        let url = 'http://localhost:8080/api/export/download';
        let req = {
            title:this.title1+this.title2,
            organizationName:`（${this.dptName}）`,
            content:`本人，${this.name}，${this.id}，${this.sId}，${this.sex}，经本人慎重考虑，
            自愿放弃2020年城乡居民基本医疗保险参保，不缴纳相关费用。因自愿放弃参保导致本人未享受到医保待遇的后果和责任完全由本人承担`,
            acceptor:'承诺人（签章）：',
            mobile:``
        }
    },
    saveToDoc() {
      for (let key in this.form) {
        if (!this.form[key]) {
          return alert("表单内所有项目均为必填");
        }
        this[key] = this.form[key];
      }
      this.editshow = false;
    },
    TimeOnConfirm(value) {
      this.showTimePicker = false;
      this.form.time = moment(value).format("YYYY年MM月DD日");
    },
    sexOnConfirm(value) {
      this.showSexPicker = false;
      this.form.sex = value;
    },
    /**
     * 将以base64的图片url数据转换为Blob
     * @param urlData
     *            用url方式表示的base64图片数据
     */

    convertBase64UrlToBlob(urlData) {
      var bytes = window.atob(urlData.split(",")[1]); //去掉url的头，并转换为byte

      //处理异常,将ascii码小于0的转换为大于0
      var ab = new ArrayBuffer(bytes.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
      }

      return new Blob([ab], { type: "image/png" });
    },
    save() {
      var _this = this;
      var png = _this.$refs.signature.save();
      this.form.signature = png;
      //   let a = this.convertBase64UrlToBlob(png);
      //   console.log(a);
      this.showSignPicker = false;
    },
    clear() {
      var _this = this;
      _this.$refs.signature.clear();
    },
    undo() {
      var _this = this;
      _this.$refs.signature.undo();
    },
    addWaterMark() {
      var _this = this;
      _this.$refs.signature.addWaterMark({
        text: "mark text", // watermark text, > default ''
        font: "20px Arial", // mark font, > default '20px sans-serif'
        style: "all", // fillText and strokeText,  'all'/'stroke'/'fill', > default 'fill
        fillStyle: "red", // fillcolor, > default '#333'
        strokeStyle: "blue", // strokecolor, > default '#333'
        x: 100, // fill positionX, > default 20
        y: 200, // fill positionY, > default 20
        sx: 100, // stroke positionX, > default 40
        sy: 200 // stroke positionY, > default 40
      });
    },
    fromDataURL(url) {
      var _this = this;
      _this.$refs.signature.fromDataURL("data:image/png;base64,iVBORw0K...");
    },
    handleDisabled() {
      var _this = this;
      _this.disabled = !_this.disabled;
    }
  }
};
</script>

<style lang="less" scoped>
.p_indent {
  text-indent: 2em;
  line-height: 2.5rem;
}

.p_center {
  text-align: center;
}
.flex-right {
  display: flex;
  flex-direction: column;
}
.p_right {
  /* text-align: right; */
  margin: 1rem 0 1rem 7rem;
  span:nth-child(1) {
    display: inline-block;
    width: 13rem;
    text-align: right;
  }
}
.notime {
  width: 13rem;
  display: flex;
  justify-content: space-around;
  margin-left: 10rem;
}
.content {
  font-size: 1.4rem;
  padding: 1rem;
  color: #000;
}
.btns {
  text-align: center;
  margin-top: 7rem;
  display: flex;
  justify-content: space-around;
}
.btn_s {
  text-align: center;
  display: flex;
  justify-content: flex-end;
}
.btns_s {
  text-align: center;
  display: flex;
  justify-content: space-around;
  padding: 3rem;
}
</style>