
  
<template>
  <div>
    
    <div>
      <div
        @drag="drag"
        @dragend="dragend"
        class="droppable-element"
        draggable="true"
        unselectable="on"
      >
        布局
      </div>
      <!-- <drag class="drag" :transfer-data="{ example: 'styling' }">列表控件</drag> -->
    </div>

    <div id="content">
      <grid-layout
        ref="gridlayout"
        :layout.sync="layout"
        :col-num="36"
        :row-height="30"
        :is-draggable="true"
        :is-resizable="true"
        :vertical-compact="true"
        :use-css-transforms="true"
      >
        <grid-item
          :key="item.i"
          v-for="item in layout"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
        >
          <div class="gitem" @click.prevent="gitemClick(item)">
            <control :item="item" />
          </div>
        </grid-item>
      </grid-layout>
    </div>
    <!-- <ModalSet
      :mshow="modalShow"
      :currentItem="currentItem"
      @modalMsg="modalMsg"
    /> -->
    <button @click="layouts">layout</button>
    <el-button @click="save()">保存</el-button>
  </div>
</template>

<script>
import { GridLayout, GridItem } from "vue-grid-layout";
let mouseXY = { x: null, y: null };
let DragPos = { x: null, y: null, w: 10, h: 4, i: null };
import * as configs from "../components/drag/components/index";
import ModalSet from "../components/drag/model-set.vue";
import { Drag, Drop } from "vue-drag-drop";
import control from "../components/drag-control/index.vue";
export default {
  components: {
    control,
    GridLayout,
    GridItem,
    ModalSet,
    Drag,
    Drop,
  },
  data() {
    return {
      currentItem: {
        config: {
          code: null,
        },
        optionsProps: [],
      },
      over: false,
      layout: [],
      modalShow: false,
      dw: 10,
      dh: 4,
    };
  },
  computed: {},
  created() {
    let localData = localStorage.getItem("layout");
    if (localData) {
      this.layout = JSON.parse(localData);
    }
  },
  mounted() {
    document.addEventListener(
      "dragover",
      function (e) {
        mouseXY.x = e.clientX;
        mouseXY.y = e.clientY;
      },
      false
    );
  },
  methods: {
    save() {
      localStorage.setItem("layout", JSON.stringify(this.layout));
      this.modalShow = false;
    },
    gitemClick(item) {
      // this.modalShow = false;
      // setTimeout(() => {
      this.currentItem = item;
      this.modalShow = true;
      // }, 300);
    },
    layouts() {
      console.log(this.layout);
    },
    handleDrop(data) {
      this.over = false;
      alert(`You dropped with data: ${JSON.stringify(data)}`);
    },
    modalMsg(e) {
      if (e.type === "off") {
        this.modalShow = false;
      }
      if (e.type === "code") {
        // this.modalShow = false;
        let item = configs.default.filter(
          (x) => x.config.code === this.currentItem.config.code
        )[0];
        // this.currentItem.optionsProps = item.optionsProps;
        this.$set(this.currentItem, "optionsProps", item.optionsProps);
        for (let i = 0; i < item.optionsProps.length; i++) {
          // this.currentItem[item.optionsProps[i].code] =
          //     item.optionsProps[i].default;
          this.$set(
            this.currentItem,
            item.optionsProps[i].code,
            item.optionsProps[i].default
          );
        }
      }
      if (e.type === "props") {
        this.currentItem[e.code] = e.content;
      }
    },
    drag: function (e) {
      let parentRect = document
        .getElementById("content")
        .getBoundingClientRect();
      let mouseInGrid = false;
      if (
        mouseXY.x > parentRect.left &&
        mouseXY.x < parentRect.right &&
        mouseXY.y > parentRect.top &&
        mouseXY.y < parentRect.bottom
      ) {
        mouseInGrid = true;
      }
      if (
        mouseInGrid === true &&
        this.layout.findIndex((item) => item.i === "drop") === -1
      ) {
        this.layout.push({
          x: (this.layout.length * 2) % (this.colNum || 12),
          y: this.layout.length + (this.colNum || 12), // puts it at the bottom
          w: this.dw,
          h: this.dh,
          i: "drop",
          config: {
            code: null,
          },
        });
      }
      let index = this.layout.findIndex((item) => item.i === "drop");
      if (index !== -1) {
        try {
          this.$refs.gridlayout.$children[
            this.layout.length
          ].$refs.item.style.display = "none";
        } catch (e) {
          console.log(e);
        }
        let el = this.$refs.gridlayout.$children[index];
        el.dragging = {
          top: mouseXY.y - parentRect.top,
          left: mouseXY.x - parentRect.left,
        };
        let new_pos = el.calcXY(
          mouseXY.y - parentRect.top,
          mouseXY.x - parentRect.left
        );
        if (mouseInGrid === true) {
          this.$refs.gridlayout.dragEvent(
            "dragstart",
            "drop",
            new_pos.x,
            new_pos.y,
            this.dh,
            this.dw
          );
          DragPos.i = String(index);
          DragPos.x = this.layout[index].x;
          DragPos.y = this.layout[index].y;
        }
        if (mouseInGrid === false) {
          this.$refs.gridlayout.dragEvent(
            "dragend",
            "drop",
            new_pos.x,
            new_pos.y,
            this.dh,
            this.dw
          );
          this.layout = this.layout.filter((obj) => obj.i !== "drop");
        }
      }
    },
    dragend: function (e) {
      let parentRect = document
        .getElementById("content")
        .getBoundingClientRect();
      let mouseInGrid = false;
      if (
        mouseXY.x > parentRect.left &&
        mouseXY.x < parentRect.right &&
        mouseXY.y > parentRect.top &&
        mouseXY.y < parentRect.bottom
      ) {
        mouseInGrid = true;
      }
      if (mouseInGrid === true) {
        // alert(`Dropped element props:\n${JSON.stringify(DragPos, ['x', 'y', 'w', 'h'], 2)}`);
        this.$refs.gridlayout.dragEvent(
          "dragend",
          "drop",
          DragPos.x,
          DragPos.y,
          this.dh,
          this.dw
        );
        this.layout = this.layout.filter((obj) => obj.i !== "drop");
        // UNCOMMENT below if you want to add a grid-item
        let citem = {
          x: DragPos.x,
          y: DragPos.y,
          w: this.dw,
          h: this.dh,
          i: DragPos.i,
          config: {
            code: null,
          },
        };
        this.layout.push(citem);

        // this.$refs.gridLayout.dragEvent(
        //   "dragend",
        //   DragPos.i,
        //   DragPos.x,
        //   DragPos.y,
        //   1,
        //   1
        // );
        // this.$refs.gridLayout.$children[
        //   this.layout.length
        // ].$refs.item.style.display = "block";
        // this.currentItem = citem;
        // this.modalShow = true;
      }
    },
  },
};
</script>

<style scoped>
.drop.over {
  border-color: #aaa;
  background: #ccc;
}
.drop {
  background: green;
  height: 100%;
}
.drag {
  height: 30px;
  width: 100px;
  background: yellow;
}
.gitem {
  width: 100%;
  height: 100%;
  background: #fff;
  padding: 5px;
}
.droppable-element {
  width: 150px;
  text-align: center;
  background: #fdd;
  /* border: 1px dashed #8e8c8c; */
  margin: 10px 0;
  padding: 10px;
}
.vue-grid-layout {
  width: 100%;
  background: #a3cc9e;
  min-height: 80vh;
  transition: height 300ms ease-in-out, width 300ms ease-in-out;
}
.right-show {
  width: calc(100% - 300px);
}
.vue-grid-item:not(.vue-grid-placeholder) {
  background: #ccc;
  /* border: 1px dashed #8e8c8c; */
}
.vue-grid-item .resizing {
  opacity: 0.9;
}
.vue-grid-item .static {
  background: #cce;
}
.vue-grid-item .text {
  font-size: 24px;
  text-align: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  height: 100%;
  width: 100%;
}
.vue-grid-item .no-drag {
  height: 100%;
  width: 100%;
}
.vue-grid-item .minMax {
  font-size: 12px;
}
.vue-grid-item .add {
  cursor: pointer;
}
.vue-draggable-handle {
  position: absolute;
  width: 20px;
  height: 20px;
  top: 0;
  left: 0;
  background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'><circle cx='5' cy='5' r='5' fill='#999999'/></svg>")
    no-repeat;
  background-position: bottom right;
  padding: 0 8px 8px 0;
  background-repeat: no-repeat;
  background-origin: content-box;
  box-sizing: border-box;
  cursor: pointer;
}

.layoutJSON {
  background: #ddd;
  /* border: 1px dashed #8e8c8c; */
  margin-top: 10px;
  padding: 10px;
}
.columns {
  -moz-columns: 120px;
  -webkit-columns: 120px;
  columns: 120px;
}
</style>
