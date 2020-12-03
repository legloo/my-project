<template>
  <div class="leftModal" :class="getClass">
    <el-form label-width="100px" class="demo-dynamic" size="small" :v-if="mshow">
      <el-form-item label="选择组件">
        <el-select
          size="small"
          v-model="currentItem.config.code"
          placeholder="请选择"
          @change="modalMsg('code')"
        >
          <el-option
            v-for="item in typelist"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <div class="f_items" v-if="currentItem.config.code && currentItem.optionsProps.length">
      <el-form-item
        v-for="(f_item, index) in currentItem.optionsProps"
        :key="'f_item'+index"
        :label="f_item.name"
      >

        <el-input v-if="f_item.type === 'textarea'" type="textarea" :rows="3" v-model="currentItem[f_item.code]"></el-input>
      </el-form-item>

      </div>
      <el-form-item>
        <!-- <el-button>提交</el-button> -->
        
        <el-button @click="modalMsg('off')">关闭</el-button>
      </el-form-item>
    </el-form>

    <!-- // -->
  </div>
</template>

<script>
import * as configs from "./components/index";
export default {
  props: {
    currentItem: {
      required: true,
    },
    mshow: {
      default: false,
    },
  },
  data() {
    return {
      value: "",
      typelist: configs.default.map((x) => {
        return { label: x.config.name, value: x.config.code };
      }),
    };
  },
  computed: {
    getClass() {
      return this.mshow ? "show-move" : "hidden-move";
    },
  },
  methods: {
    modalMsg(type,code,content) {
      this.$emit("modalMsg", {
        type,
        code,
        content
      });
    },
  },
};
</script>

<style lang="scss">
.leftModal {
  padding: 10px;
  position: fixed;
  right: -300px;
  width: 300px;
  height: 100%;
  background: #f3f2f2;
  top: 0;
  transition: right 300ms ease-in-out;
  //   -moz-transition: right 2s; /* Firefox 4 */
  //   -webkit-transition: right 2s; /* Safari and Chrome */
  //   -o-transition: right 2s; /* Opera */
}
.show-move {
  right: 0px;
}
</style>