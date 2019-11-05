<template>
  <div class="e_container">
    <div class="i_docker">
      <iframe
        style="width: 100%;height: 100%;border-right: 1px solid #d2c7c7;"
        src="http://47.106.218.114/wordformat/demo/editindex.html?cmd=1"
        id="iframe"
        frameborder="0"
      ></iframe>
    </div>
    <div class="a_docker">
      <div class="edit_container">
        <quill-editor
          v-model="content"
          ref="myQuillEditor"
          :options="editorOption"
          @blur="onEditorBlur($event)"
          @change="onEditorChange($event)"
        ></quill-editor>
        <p class="onblur" @click="clickSelf">开始格式化</p>
      </div>
      <div id="container" class="Section0" style="layout-grid:15.6000pt;"></div>
    </div>
  </div>
</template>

<script>
import { quillEditor } from "vue-quill-editor";
import * as clipboard from "clipboard-polyfill";
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      editor: null, // 富文本编辑器对象
      content: ``, // 富文本编辑器默认内容
      editorOption: {
        modules: {
          toolbar: []
        },
        placeholder: "在此粘贴正文内容"
      },
      tips: [
        "成都税务局公文格式化使用须知：",
        "1.仅供原始word文档内正文使用，如从网页内复制内容粘贴进入，请先放入记事本格式化后使用，否则不会生效；",
        "2.支持一、（一）、1.、（1）四级标题，最深等级为6级，即一、二、三、四、五、六；（一）、（二）、（三）、（四）、（五）、（六）以此类推；",
        "3.除标题外其余文本全部按照正文处理；",
        "4.点击格式化按钮后，格式后的文本会自动放入用户的粘贴板，无需在此页面复制内容，到word应用内粘贴即可，且网页5秒内自动刷新；"
      ]
    };
  },
  mounted() {
  },
  methods: {
    clickSelf() {
      if (!this.content) {
        return this.$message.warning("请放入Word文件正文");
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
        console.log(x.innerText);
        x.innerHTML = x.innerText.replace(/\s/g, "");
        console.log(x.innerHTML);
        x.innerHTML = x.innerHTML.replace(/\s/g, "");
        console.log(x.innerHTML);
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
            <p class="MsoNormal" align="justify" style="text-indent:32.0000pt;text-align:justify;text-justify:inter-ideograph;mso-list:l0 level1 lfo1;">
            ${template_one}${template_two}
            <span style="mso-spacerun:'yes';font-family:仿宋;font-size:16.0000pt;mso-font-kerning:1.0000pt;"><o:p></o:p></span></p>
            `;
            container.innerHTML += comp;
          } else {
            //没有则只处理双引号
            let isIncludeDot = x.innerHTML.indexOf("“") > -1;
            template = `
            <p class="MsoNormal" align="justify" style="text-indent:32.0000pt;text-align:justify;text-justify:inter-ideograph;">
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
            <p class="MsoNormal" align="justify" style="text-indent:32.0000pt;text-align:justify;text-justify:inter-ideograph;mso-list:l0 level1 lfo1;">
            ${template_one}${template_two}
            <span style="mso-spacerun:'yes';font-family:仿宋_GB2312;font-size:16.0000pt;mso-font-kerning:1.0000pt;"><o:p></o:p></span></p>
            `;
            container.innerHTML += comp;
          } else {
            //没有则只处理双引号
            let isIncludeDot = x.innerHTML.indexOf("“") > -1;
            template = `
            <p class="MsoNormal" align="justify" style="text-indent:32.0000pt;text-align:justify;text-justify:inter-ideograph;">
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
            <p class="MsoNormal" align="justify" style="text-indent:32.0000pt;text-align:justify;text-justify:inter-ideograph;">
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
            <p class="MsoNormal" align="justify" style="text-indent:32.0000pt;text-align:justify;text-justify:inter-ideograph;">
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
            <p class="MsoNormal" align="justify" style="text-indent:32.0000pt;text-align:justify;text-justify:inter-ideograph;">
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

      //自动复制到粘贴板
      // const body = this.$el.querySelector("#container").innerHTML;
      // let dt = new clipboard.DT();
      // dt.setData("text/plain", "成都税务局-粘贴板");
      // //设置内容
      // dt.setData("text/html", body);
      // clipboard.write(dt);
      // // setTimeout(() => {
      // //   window.location.reload();
      // // }, 6000);
      // this.$message.info("正文已格式化并放入粘贴板，请到word文档内粘贴");
    },
    // 失去焦点事件
    onEditorBlur(e) {
      if (!this.content) {
        return console.log("nothing");
      }
      this.editor = e;
    },
    // 内容改变事件
    onEditorChange(e) {}
  }
};
</script>

<style scoped>
#app .bpm-container {
  min-width: unset !important;
}
</style>

<style lang="less">
.e_container {
  position: relative;
  display: flex;
  flex-direction: row;
  // padding: 20px;
  height: 100vh;
}
.i_docker {
  // border-top: 1px solid #b7b5b5;
  flex: 0 0 70%;
}
.a_docker {
  // border-top: 1px solid #b7b5b5;
  flex: 0 0 30%;
  display: flex;
  flex-direction: column;
}
.edit_container {
  border-top: 1px solid #b7b5b5;
  border-bottom: 1px solid #b7b5b5;
}
.ql-editor {
  height: 20vw;
}
.onblur {
  width: 20vw;
  margin: 19px auto;
  height: 60px;
  text-align: center;
  background-color: #00a3fb;
  line-height: 60px;
  font-size: 26px;
  border-radius: 12px;
  color: #fff;
  cursor: pointer;
}
.ql-toolbar {
  display: none;
}
.tips {
  position: absolute;
  left: 0;
  top: 0;
  width: 20vw;
  font-size: 13px;
  line-height: 26px;
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
}
</style>