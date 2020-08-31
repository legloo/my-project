<template>
  <div class="tree">
    <div class="node" v-for="(item,index) in list" :key="'node'+index" style="margin:0 auto;">
      <div class="node-dot" :style="nodeDot(item)">
        <div class="space" :style="borderTop(item,index,'space')"></div>

        <div class="dot">
          <div class="dots"></div>
          <div class="line"></div>
          <div class="dots_" v-if="!item.children"></div>
        </div>

        <div class="word" :style="borderTop(item,index,'word')">
          <p
            v-for="(itemshow,index3) in showfields_"
            :key="'itemshow'+index3"
          >{{itemshow.name}}{{item[itemshow.key]}}</p>
        </div>
      </div>
      <div v-if="item.children && item.children.length" class="child">
        <TreeDown :list="item.children" :showfields_="showfields_" :height="height" :width="width" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TreeDown",
  components: {},
  data() {
    return {};
  },
  props: {
    height: {
      type: Number,
      default: 200,
    },
    width: {
      type: Number,
      default: 200,
    },
    list: {
      type: Array,
      default: () => [],
    },
    showfields_: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    nodeDot(e) {
      if (e.children && e.children.length > 1) {
        let handleGetTreeExtent_ = this.handleGetTreeExtent(e.children);
        return {
          height: this.height + "px",
          width: `${handleGetTreeExtent_ * this.width}px`,
        };
      }
      return {
        height: this.height + "px",
        width: `${this.width}px`,
      };
    },
    borderTop(e, index, type) {
      if (index !== 0 && type === "space") {
        return {
          borderTop: `3px solid #1890ff`,
        };
      }
      if (index !== this.list.length - 1 && type === "word") {
        return {
          borderTop: `3px solid #1890ff`,
        };
      }
    },

    handleGetTreeExtent(node) {
      let extend = 0;
      node.forEach((item) => {
        if (item.children) {
          extend += this.handleGetTreeExtent(item.children);
        } else {
          extend += 1;
        }
      });
      return extend;
    },
  },
};
</script>

<style lang="less" scoped>
.tree {
  display: flex;
  text-align: center;
  p {
    margin-bottom: 7px;
  }
  .node-dot {
    margin: auto;
    display: flex;
    // background-color: thistle;
    .space {
      flex: 0 0 50%;
      width: 95px;
    }
    .dot {
      position: relative;
      // flex: 0 0 10%;
      width: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      .dots {
        background: #1890ff;
        height: 11px;
        width: 11px;
        border-radius: 50%;
        display: block;
        position: absolute;
        top: -3px;
        border: 2px solid #a3d2ff;
      }
      .dots_ {
        background: #1890ff;
        height: 11px;
        width: 11px;
        border-radius: 50%;
        display: block;
        position: absolute;
        bottom: -6px;
        border: 2px solid #fff;
      }
      .line {
        background: #1890ff;
        width: 3px;
        height: 100%;
      }
    }
    .word {
      // width: 95px;
      flex: 0 0 50%;
      text-align: left;
      padding-bottom: 27px;
      font-size: 13px;
      padding-top: 10px;
      color: #716b6b;
      padding: 20px 0 0 15px;
    }
  }
}
</style>
