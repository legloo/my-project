<template>
  <div class="cmain">
    <p style="display:none">{{ item }}</p>
    <!-- <p>{{ props_ }}</p> -->
    <component v-if="item" :is="component" v-bind="props_"></component>
  </div>
</template>

<script>
import * as coms from "../drag/components/index.js";
import Vue from "vue";
export default {
  components: {},
  props: {
    item: {
      required: false,
    },
  },
  data() {
    return {
      component: "",
      props_: {},
    };
  },
  created() {
  },
  computed: {
    code() {
      return this.item ? this.item.config.code : null;
    },
    // props_() {
    //   return props;
    // },
  },
  methods: {
    codeChange() {
      if (!this.code) {
        return;
      }
      let id = coms.default.filter((x) => x.config.code === this.code)[0].config
        .cname;
      let pcpage = coms.default.filter((x) => x.config.code === this.code)[0]
        .components.pc;
      if (
        this.item &&
        this.item.optionsProps &&
        this.item.optionsProps.length
      ) {
        for (let i = 0; i < this.item.optionsProps.length; i++) {
          this.props_[[this.item.optionsProps[i].code]] = this.item[
            this.item.optionsProps[i].code
          ];
        }
      }

      Vue.component(id, pcpage);
      this.component = id;
    },
  },
  watch: {
    item: {
      handler(a, b) {
    this.codeChange();
        // this.props_.content ='hahah'
        // if (
        //   this.item &&
        //   this.item.optionsProps &&
        //   this.item.optionsProps.length
        // ) {
        //   for (let i = 0; i < this.item.optionsProps.length; i++) {
        //     this.props_[[this.item.optionsProps[i].code]] = this.item[
        //       this.item.optionsProps[i].code
        //     ];
        //   }
        // }
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>

<style>
</style>