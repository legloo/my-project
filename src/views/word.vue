<template>
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
</template>

<script>
import { quillEditor } from "vue-quill-editor";
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
        placeholder: ""
      },
    };
  },
  mounted() {},
  methods: {
    clickSelf() {
      if (!this.content) {
        return console.log("nothing");
      }
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
      let f_nodes_one = [];
      let f_nodes_two = [];
      let f_nodes_three = [];
      let f_nodes_four = [];

      node_arr.forEach(x => {
        x.style.fontSize = "27px";
        x.style.fontFamily = "仿宋_GB2312";
        x.style.color = "#000";
        x.innerHTML = x.innerHTML.replace(/&nbsp;/g, "");
        x.innerHTML = x.innerHTML.replace(/\s/g, "");

        let html = x.innerHTML;
        //数字

        let html_arr = html.split("");
        for (let i = 0; i < html_arr.length; i++) {
          if (!isNaN(Number(html_arr[i]))) {
            //数字
            html_arr[
              i
            ] = `<span style="color:#000;font-size:27px;font-family:Times New Roman">${html_arr[i]}</span>`;
          }
          if (html_arr[i].match(/[a-z]/gi) && html_arr[i].indexOf("span") < 0) {
            html_arr[
              i
            ] = `<span style="color:#000;font-size:27px;font-family:Times New Roman">${html_arr[i]}</span>`;
          }
        }
        x.innerHTML = html_arr.join("");
        x.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;" + x.innerHTML;
      });
      arr_one.forEach((x, index) => {
        let finded = node_arr.filter(y => y.innerText.indexOf(x) > -1)[0];
        if (finded) {
          f_nodes_one.push(finded);
        }
      });
      f_nodes_one.forEach((x, index) => {
        x.style.fontFamily = "黑体";
      });
      //
      arr_two.forEach((x, index) => {
        let finded = node_arr.filter(y => y.innerText.indexOf(x) > -1)[0];
        if (finded) {
          f_nodes_two.push(finded);
        }
      });
      f_nodes_two.forEach(x => {
        x.style.fontFamily = "楷体_GB2312";
      });
      //
      //
      arr_three.forEach((x, index) => {
        let finded = node_arr.filter(y => y.innerText.indexOf(x) > -1)[0];
        if (finded) {
          f_nodes_three.push(finded);
        }
      });
      f_nodes_three.forEach(x => {
        x.style.fontFamily = "仿宋_GB2312";
      });
      //
      //
      arr_four.forEach((x, index) => {
        let finded = node_arr.filter(y => y.innerText.indexOf(x) > -1)[0];
        if (finded) {
          f_nodes_four.push(finded);
        }
      });
      f_nodes_four.forEach(x => {
        x.style.fontFamily = "仿宋_GB2312";
      });
    },
    // 失去焦点事件
    onEditorBlur(e) {
      if (!this.content) {
        return console.log("nothing");
      }
      this.editor = e;
    },
    // 内容改变事件
    onEditorChange(e) {
    }
  }
};
</script>

<style>
.ql-editor {
  height: 750px;
}
.onblur {
  width: 300px;
  margin: 10px auto;
  height: 60px;
  text-align: center;
  background-color: #39acea;
  line-height: 60px;
  font-size: 26px;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
}
.ql-toolbar{
  display: none;
}
</style>