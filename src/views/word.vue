<template>
  <div class="e_container">
    <div class="i_docker">
      <iframe
        v-show="isIE"
        style="width: 100%;height: 98%;border-right: 1px solid #d2c7c7;"
        src="http://47.106.218.114/wordformat/demo/editindex.html?cmd=1"
        id="iframe"
        frameborder="0"
      ></iframe>
      <p v-show="!isIE" class="not_ie">请使用IE浏览器打开</p>
    </div>
    <div class="a_docker">
      <div class="btn_group">
        <button
          class="d_btn"
          :class="{d_btn_active:currentDocker === 'tips'}"
          @click="currentChange('tips')"
        >易错点</button>
        <button
          class="d_btn"
          :class="{d_btn_active:currentDocker === 'editor'}"
          @click="currentChange('editor')"
        >公文格式刷</button>
      </div>
      <div class="edit_container" v-show="currentDocker === 'editor'">
        <quill-editor
          v-model="content"
          ref="myQuillEditor"
          :options="editorOption"
          @blur="onEditorBlur($event)"
          @change="onEditorChange($event)"
        ></quill-editor>
        <div class="blue_g">
          <p class="onblur" @click="clickSelf">开始格式刷</p>
          <p class="onblur btn" @click="copy" data-clipboard-target="#container">复制</p>
        </div>
      </div>
      <div class="tips" v-show="currentDocker === 'tips'">
        <p v-for="(item,index) in tips" :class="{tips_br:item === ''}" :key="index">{{item}}</p>
      </div>
      <div
        v-show="currentDocker === 'editor'"
        id="container"
        class="Section0"
        style="layout-grid:15.6000pt;"
      ></div>
    </div>
  </div>
</template>
<script>
// let docx_name = location.href.split('?')[1].split('=')[1];
// document.getElementById('iframe').onload = function () {
// 	var child = document.getElementById('iframe').contentWindow;
// 	let url = 'http://47.106.218.114/docx/' + docx_name;
// 	child.open_doc(url);
// };
</script>

<script>
import { quillEditor } from "vue-quill-editor";
import clipboard from "clipboard";
import { resolve } from "url";
import { reject } from "q";
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      Clipboard: null,
      currentDocker: "editor",
      isIE: true,
      editor: null, // 富文本编辑器对象
      content: ``, // 富文本编辑器默认内容
      editorOption: {
        modules: {
          toolbar: []
        },
        placeholder: "在此粘贴正文内容"
      },
      tips: [
        "报告：",
        "字数要求：全局性报告公文控制在5000字以内；单项工作或阶段性工作报告公文控制在3000字以内",
        "内容要求：报告要求行文简洁，直切要害。报告里不能夹带请示事项！",
        "报告不得有多个主送机关。超过一个的，应选择一个为主送机关，其它抄送。",
        "",
        "请示：",
        "字数要求：请示公文控制在1500字以内",
        "内容要求：请示要求言简意赅，准确描述基本情况和请示事项。请示只能一文一事！严禁在请示内夹带报告！严禁一篇请示公文内请示多个事项",
        "请示请在落款后备注联系人，格式为：（联系人：人事教育科 XXX，联系电话：XXX）",
        "",
        "函：",
        "函用于不相隶属关系的单位之间行文往来。除税务总局、省局、市局及新都区委、区人民政府、区人大、区政协以外的单位，区局对外行文一般用函件。",
        "",
        "科室便函：",
        "各单位以公文形式向上级处室报送工作材料，以本科室便函的形式。",
        "",
        "标点符号：",
        "不得在引号之间、书名号之间加“、”号。",
        "注意区分单书名号与大于小于号：“<>”为大于小于号，不是单书名号。单书名号为“〈 〉“，输入方式为 word - 插入 - 符号 - 其他符号 - 字符代码：3008,3009。",
        "",
        "报告：",
        "字数要求：全局性报告公文控制在5000字以内；单项工作或阶段性工作报告公文控制在3000字以内",
        "内容要求：报告要求行文简洁，直切要害。报告里不能夹带请示事项！",
        "报告不得有多个主送机关。超过一个的，应选择一个为主送机关，其它抄送。",
        "",
        "请示：",
        "字数要求：请示公文控制在1500字以内",
        "内容要求：请示要求言简意赅，准确描述基本情况和请示事项。请示只能一文一事！严禁在请示内夹带报告！严禁一篇请示公文内请示多个事项",
        "请示请在落款后备注联系人，格式为：（联系人：人事教育科 XXX，联系电话：XXX）",
        "请示不得有多个主送机关。超过一个的，应选择一个为主送机关，其它抄送。",
        "",
        "函：",
        "函用于不相隶属关系的单位之间行文往来。除税务总局、省局、市局及新都区委、区人民政府、区人大、区政协以外的单位，区局对外行文一般用函件。",
        "",
        "科室便函：",
        "各单位以公文形式向上级处室报送工作材料，以本科室便函的形式。"
      ]
    };
  },
  mounted() {
    let agent = this.IEVersion();
    if (agent < 0) {
      this.isIE = false;
    }
    let self = this;
    self.Clipboard = new clipboard(".btn");
  },
  methods: {
    async copy() {
      let res = await new Promise((resolve, reject) => {
        this.Clipboard.on("success", e => {
          resolve("success");
          e.clearSelection();
        });
        this.Clipboard.on("error", e => {
          reject("error");
        });
      });
      if (res === "success") {
        const h = this.$createElement;
        this.$notify({
          title: "复制操作",
          message: "复制成功",
          type: "success"
        });
      }
    },
    currentChange(name) {
      this.currentDocker = name;
    },
    clickSelf() {
      if (!this.content) {
        this.$notify({
          title: "提示",
          message: "请放入内容",
          type: "warning"
        });
        return;
      }
      let container = this.$el.querySelector("#container");
      container.innerHTML = "";
      let nodes = this.editor.scrollingContainer.childNodes;
      let node_arr = Array.from(nodes);
      let arr_one = ["一、", "二、", "三、", "四、", "五、", "六、"];
      let arr_two = [
        "（一）",
        "（二）",
        "（三）",
        "（四）",
        "（五）",
        "（六）"
      ];
      let arr_three = ["1.", "2.", "3.", "4.", "5.", "6."];
      let arr_four = ["（1）", "（2）", "（3）", "（4）", "（5）", "（6）"];
      let other_str = ["“", "”"];
      let title_special_split = ["。", "！", "!", "?", "？", "……", "......"];
      let other_nodes = [];
      let f_nodes_one = [];
      let f_nodes_two = [];
      let f_nodes_three = [];
      let f_nodes_four = [];
      let template;
      node_arr.forEach(x => {
        // console.log(x.innerText);
        let isT_one = false;
        let isT_two = false;
        let isT_three = false;
        let isT_four = false;
        x.innerHTML = x.innerText.replace(/\s/g, "");
        x.innerHTML = x.innerHTML.replace(/\s/g, "");
        arr_one.forEach(t_one => {
          if (x.innerHTML.indexOf(t_one) > -1) {
            isT_one = true;
          }
        });
        arr_two.forEach(t_two => {
          if (x.innerHTML.indexOf(t_two) > -1) {
            isT_two = true;
          }
        });
        arr_three.forEach(t_three => {
          if (x.innerHTML.indexOf(t_three) > -1) {
            isT_three = true;
          }
        });
        arr_four.forEach(t_four => {
          if (x.innerHTML.indexOf(t_four) > -1) {
            isT_four = true;
          }
        });
        // console.log(x.innerHTML);
        let html_arr = x.innerHTML.split("");
        for (let i = 0; i < html_arr.length; i++) {
          if (!isNaN(Number(html_arr[i]))) {
            html_arr[
              i
            ] = `<span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:仿宋;ont-size:16.0000pt;mso-font-kerning:1.0000pt;">${html_arr[i]}</span>`;
          }
          if (html_arr[i].match(/[a-z]/gi) && html_arr[i].indexOf("span") < 0) {
            html_arr[
              i
            ] = `<span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:仿宋;ont-size:16.0000pt;mso-font-kerning:1.0000pt;">${html_arr[i]}</span>`;
          }
        }
        x.innerHTML = html_arr.join("");
        // return;
        if (isT_one) {
          // 一级标题
          let e_num = -1;
          let s_tag = "";
          let isExit = [];
          title_special_split.forEach(s_s => {
            if (x.innerHTML.indexOf(s_s) > -1) {
              let index_num = x.innerHTML.indexOf(s_s);
              isExit.push({
                name: s_s,
                num: index_num
              });
            }
          });
          if (isExit.length) {
            let sortE = isExit.sort((a, b) => a.num - b.num);
            s_tag = sortE[0].name;
            e_num = sortE[0].num;
            //如果s_tag有值，则说明需分段处理,最多两段
            let add_num = s_tag.length;
            let inner_one = x.innerHTML.slice(0, e_num + add_num);
            let inner_two = x.innerHTML.slice(e_num + add_num);
            let isIncludeDot_one = inner_one.indexOf("“") > -1;
            let isIncludeDot_two = inner_two.indexOf("“") > -1;
            let template_one = `
            <span style="mso-spacerun:'yes';font-family:黑体;color:#000;font-size:16.0000pt;mso-font-kerning:1.0000pt;">
            <font face="黑体">${
              isIncludeDot_one ? inner_one.split("“")[0] : inner_one
            }</font>${
              isIncludeDot_one ? "“" + inner_one.split("“")[1] : ""
            }</span>`;
            let template_two = `
            <span style="mso-spacerun:'yes';font-family:仿宋;color:#000;font-size:16.0000pt;mso-font-kerning:1.0000pt;">
            <font face="仿宋">${
              isIncludeDot_two ? inner_two.split("“")[0] : inner_two
            }</font>${
              isIncludeDot_two ? "“" + inner_two.split("“")[1] : ""
            }</span>`;
            let comp = `
            <p class="MsoNormal" align="justify" style="text-indent:32.0000pt;line-height: 29pt;text-align:justify;text-justify:inter-ideograph;mso-list:l0 level1 lfo1;">
            ${template_one}${template_two}
            <span style="mso-spacerun:'yes';font-family:仿宋;font-size:16.0000pt;mso-font-kerning:1.0000pt;"><o:p></o:p></span></p>
            `;
            container.innerHTML += comp;
          } else {
            //没有则只处理双引号
            let isIncludeDot = x.innerHTML.indexOf("“") > -1;
            template = `
            <p class="MsoNormal" align="justify" style="text-indent:32.0000pt;line-height: 29pt;text-align:justify;text-justify:inter-ideograph;">
            <span style="mso-spacerun:'yes';font-family:黑体;color:#000;font-size:16.0000pt;mso-font-kerning:1.0000pt;">
            <font face="黑体">${
              isIncludeDot ? x.innerHTML.split("“")[0] : x.innerHTML
            }</font>${
              isIncludeDot ? "“" + x.innerHTML.split("“")[1] : ""
            }</span><span style="mso-spacerun:'yes';font-family:黑体;font-size:16.0000pt;mso-font-kerning:1.0000pt;"><o:p></o:p></span></p>
            `;
            container.innerHTML += template;
          }
          //
        } else if (isT_two) {
          // 二级标题
          let e_num = -1;
          let s_tag = "";
          let isExit = [];
          title_special_split.forEach(s_s => {
            if (x.innerHTML.indexOf(s_s) > -1) {
              let index_num = x.innerHTML.indexOf(s_s);
              isExit.push({
                name: s_s,
                num: index_num
              });
            }
          });
          if (isExit.length) {
            let sortE = isExit.sort((a, b) => a.num - b.num);
            s_tag = sortE[0].name;
            e_num = sortE[0].num;
            //如果s_tag有值，则说明需分段处理,最多两段
            let add_num = s_tag.length;
            let inner_one = x.innerHTML.slice(0, e_num + add_num);
            let inner_two = x.innerHTML.slice(e_num + add_num);
            let isIncludeDot_one = inner_one.indexOf("“") > -1;
            let isIncludeDot_two = inner_two.indexOf("“") > -1;
            let template_one = `
            <span style="mso-spacerun:'yes';font-family:楷体;color:#000;font-size:16.0000pt;mso-font-kerning:1.0000pt;">
            <font face="楷体">${
              isIncludeDot_one ? inner_one.split("“")[0] : inner_one
            }</font>${
              isIncludeDot_one ? "“" + inner_one.split("“")[1] : ""
            }</span>`;
            let template_two = `
            <span style="mso-spacerun:'yes';font-family:仿宋;color:#000;font-size:16.0000pt;mso-font-kerning:1.0000pt;">
            <font face="仿宋">${
              isIncludeDot_two ? inner_two.split("“")[0] : inner_two
            }</font>${
              isIncludeDot_two ? "“" + inner_two.split("“")[1] : ""
            }</span>`;
            let comp = `
            <p class="MsoNormal" align="justify" style="text-indent:32.0000pt;line-height: 29pt;text-align:justify;text-justify:inter-ideograph;mso-list:l0 level1 lfo1;">
            ${template_one}${template_two}
            <span style="mso-spacerun:'yes';font-family:仿宋_GB2312;font-size:16.0000pt;mso-font-kerning:1.0000pt;"><o:p></o:p></span></p>
            `;
            container.innerHTML += comp;
          } else {
            //没有则只处理双引号
            let isIncludeDot = x.innerHTML.indexOf("“") > -1;
            template = `
            <p class="MsoNormal" align="justify" style="text-indent:32.0000pt;line-height: 29pt;text-align:justify;text-justify:inter-ideograph;">
            <span style="mso-spacerun:'yes';font-family:楷体;color:#000;font-size:16.0000pt;mso-font-kerning:1.0000pt;">
            <font face="楷体">${
              isIncludeDot ? x.innerHTML.split("“")[0] : x.innerHTML
            }</font>${
              isIncludeDot ? "“" + x.innerHTML.split("“")[1] : ""
            }</span><span style="mso-spacerun:'yes';font-family:楷体;font-size:16.0000pt;mso-font-kerning:1.0000pt;"><o:p></o:p></span></p>
            `;
            container.innerHTML += template;
          }
          //
        } else if (isT_three) {
          // 三级标题
          let isIncludeDot = x.innerHTML.indexOf("“") > -1;
          template = `
            <p class="MsoNormal" align="justify" style="text-indent:32.0000pt;line-height: 29pt;text-align:justify;text-justify:inter-ideograph;">
            <span style="mso-spacerun:'yes';font-family:仿宋;color:#000;font-size:16.0000pt;mso-font-kerning:1.0000pt;">
            <font face="仿宋">${
              isIncludeDot ? x.innerHTML.split("“")[0] : x.innerHTML
            }</font>${
            isIncludeDot ? "“" + x.innerHTML.split("“")[1] : ""
          }</span><span style="mso-spacerun:'yes';font-family:仿宋;font-size:16.0000pt;mso-font-kerning:1.0000pt;"><o:p></o:p></span></p>
            `;
          container.innerHTML += template;
        } else if (isT_four) {
          // 四级标题
          let isIncludeDot = x.innerHTML.indexOf("“") > -1;
          template = `
            <p class="MsoNormal" align="justify" style="text-indent:32.0000pt;line-height: 29pt;text-align:justify;text-justify:inter-ideograph;">
            <span style="mso-spacerun:'yes';font-family:仿宋;color:#000;font-size:16.0000pt;mso-font-kerning:1.0000pt;">
            <font face="仿宋">${
              isIncludeDot ? x.innerHTML.split("“")[0] : x.innerHTML
            }</font>${
            isIncludeDot ? "“" + x.innerHTML.split("“")[1] : ""
          }</span><span style="mso-spacerun:'yes';font-family:仿宋;font-size:16.0000pt;mso-font-kerning:1.0000pt;"><o:p></o:p></span></p>
            `;
          container.innerHTML += template;
        } else {
          let isIncludeDot = x.innerHTML.indexOf("“") > -1;
          template = `
            <p class="MsoNormal" align="justify" style="text-indent:32.0000pt;line-height: 29pt;text-align:justify;text-justify:inter-ideograph;">
            <span style="mso-spacerun:'yes';font-family:仿宋;color:#000;font-size:16.0000pt;mso-font-kerning:1.0000pt;">
            <font face="仿宋">${
              isIncludeDot ? x.innerHTML.split("“")[0] : x.innerHTML
            }</font>${
            isIncludeDot ? "“" + x.innerHTML.split("“")[1] : ""
          }</span><span style="mso-spacerun:'yes';font-family:仿宋;font-size:16.0000pt;mso-font-kerning:1.0000pt;"><o:p></o:p></span></p>
            `;
          container.innerHTML += template;
        }
      });

      // //自动复制到粘贴板
      // const body = this.$el.querySelector("#container").innerHTML;
      // let dt = new clipboard.DT();
      // dt.setData("text/plain", "body");
      // //设置内容
      // dt.setData("text/html", body);
      // clipboard.write(dt);
      // this.$message({
      //   message: "正文已格式化并放入粘贴板，请到word文档内粘贴",
      //   type: "warning",
      //   duration: 3000
      // });
    },
    // 失去焦点事件
    onEditorBlur(e) {
      if (!this.content) {
        return console.log("nothing");
      }
      this.editor = e;
    },
    // 内容改变事件
    onEditorChange(e) {},
    IEVersion() {
      let userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
      let isIE =
        userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
      let isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
      let isIE11 =
        userAgent.indexOf("Trident") > -1 && userAgent.indexOf("rv:11.0") > -1;
      if (isIE) {
        let reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);
        let fIEVersion = parseFloat(RegExp["$1"]);
        if (fIEVersion == 7) {
          return 7;
        } else if (fIEVersion == 8) {
          return 8;
        } else if (fIEVersion == 9) {
          return 9;
        } else if (fIEVersion == 10) {
          return 10;
        } else {
          return 6; //IE版本<=7
        }
      } else if (isEdge) {
        return "edge"; //edge
      } else if (isIE11) {
        return 11; //IE11
      } else {
        return -1; //不是ie浏览器
      }
    }
  }
};
</script>

<style scoped>
#app .bpm-container {
  min-width: unset !important;
}
</style>

<style lang="less" scoped>
.blue_g {
  display: flex;
  flex-direction: row;
}
.d_btn_active {
  background-color: #57a3f3 !important;
}
.d_btn {
  border-radius: 5px;
  border: none;
  background-color: #abafb3;
  box-sizing: border-box;
  width: 20%;
  height: 39px;
  font-size: 1.2vw;
  margin: 5px;
  color: #fff;
}
.not_ie {
  font-size: 27px;
  text-align: center;
  margin-top: 50px;
  color: #a98a8a;
}
.e_container {
  position: relative;
  display: flex;
  flex-direction: row;
  // padding: 20px;
  height: 100vh;
}
.i_docker {
  // border-top: 1px solid #b7b5b5;
  flex: 0 0 60%;
}
.a_docker {
  // border-top: 1px solid #b7b5b5;
  flex: 0 0 40%;
  display: flex;
  flex-direction: column;
}
.edit_container {
  // border-top: 1px solid #b7b5b5;
  // border-bottom: 1px solid #b7b5b5;
  // border-left: 1px solid #b7b5b5;
}
.ql-editor {
  height: 20vw;
  width: 39vw;
}
.onblur {
  width: 10vw;
  margin: 10px auto;
  text-align: center;
  background-color: #00a3fb;
  font-size: 15px;
  border-radius: 10px;
  color: #fff;
  cursor: pointer;
  padding: 8px 0;
}
.ql-toolbar {
  display: none;
}
.tips {
  padding: 10px 20px 30px 20px;
  // position: absolute;
  // left: 0;
  // top: 0;
  // width: 20vw;
  font-size: 12px;
  height: 93%;
  overflow: scroll;
  // line-height: 26px;
}
.tips_br {
  height: 10px;
}
</style>

<style>
@font-face {
  font-family: "Times New Roman";
}

@font-face {
  font-family: "宋体";
}

@font-face {
  font-family: "Calibri";
}

@font-face {
  font-family: "DejaVu Sans";
}

@font-face {
  font-family: "黑体";
}

@font-face {
  font-family: "楷体";
}

@font-face {
  font-family: "仿宋";
}

p.MsoNormal {
  mso-style-name: 正文;
  mso-style-parent: "";
  margin: 0pt;
  margin-bottom: 0.0001pt;
  mso-pagination: none;
  text-align: justify;
  text-justify: inter-ideograph;
  font-family: Calibri;
  mso-fareast-font-family: 宋体;
  mso-bidi-font-family: "Times New Roman";
  font-size: 10.5pt;
  mso-font-kerning: 1pt;
}

span.10 {
  font-family: "Times New Roman";
}

span.15 {
  font-family: "Times New Roman";
  font-weight: bold;
}

span.16 {
  font-family: "Times New Roman";
  font-size: 9pt;
}

span.17 {
  font-family: "Times New Roman";
  font-size: 9pt;
}

span.18 {
  font-family: "Times New Roman";
  font-size: 9pt;
}

p.MsoFooter {
  mso-style-name: 页脚;
  mso-style-noshow: yes;
  margin: 0pt;
  margin-bottom: 0.0001pt;
  layout-grid-mode: char;
  mso-pagination: none;
  text-align: left;
  font-family: Calibri;
  mso-fareast-font-family: 宋体;
  mso-bidi-font-family: "Times New Roman";
  font-size: 9pt;
  mso-font-kerning: 1pt;
}

p.MsoAcetate {
  mso-style-name: 批注框文本;
  mso-style-noshow: yes;
  margin: 0pt;
  margin-bottom: 0.0001pt;
  mso-pagination: none;
  text-align: justify;
  text-justify: inter-ideograph;
  font-family: Calibri;
  mso-fareast-font-family: 宋体;
  mso-bidi-font-family: "Times New Roman";
  font-size: 9pt;
  mso-font-kerning: 1pt;
}

p.MsoHeader {
  mso-style-name: 页眉;
  mso-style-noshow: yes;
  margin: 0pt;
  margin-bottom: 0.0001pt;
  border-bottom: 1pt solid windowtext;
  mso-border-bottom-alt: 0.75pt solid windowtext;
  padding: 0pt 0pt 1pt 0pt;
  layout-grid-mode: char;
  mso-pagination: none;
  text-align: center;
  font-family: Calibri;
  mso-fareast-font-family: 宋体;
  mso-bidi-font-family: "Times New Roman";
  font-size: 9pt;
  mso-font-kerning: 1pt;
}

p.22 {
  mso-style-name: "List Paragraph";
  margin: 0pt;
  margin-bottom: 0.0001pt;
  text-indent: 21pt;
  mso-char-indent-count: 2;
  mso-pagination: none;
  text-align: justify;
  text-justify: inter-ideograph;
  font-family: Calibri;
  mso-fareast-font-family: 宋体;
  mso-bidi-font-family: "Times New Roman";
  font-size: 10.5pt;
  mso-font-kerning: 1pt;
}

span.msoIns {
  mso-style-type: export-only;
  mso-style-name: "";
  text-decoration: underline;
  text-underline: single;
  color: blue;
}

span.msoDel {
  mso-style-type: export-only;
  mso-style-name: "";
  text-decoration: line-through;
  color: red;
}

table.MsoNormalTable {
  mso-style-name: 普通表格;
  mso-style-parent: "";
  mso-style-noshow: yes;
  mso-tstyle-rowband-size: 0;
  mso-tstyle-colband-size: 0;
  mso-padding-alt: 0pt 5.4pt 0pt 5.4pt;
  mso-para-margin: 0pt;
  mso-para-margin-bottom: 0.0001pt;
  mso-pagination: widow-orphan;
  font-family: "Times New Roman";
  font-size: 10pt;
  mso-ansi-language: #0400;
  mso-fareast-language: #0400;
  mso-bidi-language: #0400;
}
@page {
  mso-page-border-surround-header: no;
  mso-page-border-surround-footer: no;
}
@page Section0 {
  margin-top: 72pt;
  margin-bottom: 72pt;
  margin-left: 90pt;
  margin-right: 90pt;
  size: 595.3pt 841.9pt;
  layout-grid: 15.6pt;
}
.Section0 {
  page: Section0;
  padding-left: 20px;
  height: 45%;
  width: 40vw;
  overflow: scroll;
  word-wrap: break-word;
}
</style>