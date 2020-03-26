<template>
  <div class="container">
    <div class="content">
      <button class="header_btn" :style="opch">header</button>
    </div>
    <p v-for="(item,index) in 100" :key="index">{{item}}</p>
    <button class="footer_btn" :style="opcf">footer</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      scroll2top: 0
    };
  },
  watch: {},
  computed: {
    opcf() {
      if (this.scroll2top >= 250) return { opacity: 1, display: "block" };
      let radio = this.scroll2top / ((250 - this.scroll2top) * 20);
      return this.scroll2top >= 200
        ? {
            opacity: radio,
            display: "block"
          }
        : {};
    },
    opch() {
      if (this.scroll2top >= 250) return { opacity: 0, display: "none" };
      let radio = 1 - this.scroll2top / ((250 - this.scroll2top) * 20);
      return this.scroll2top >= 200
        ? {
            opacity: radio
          }
        : {};
    }
  },
  methods: {
    windowScroll() {
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      this.scroll2top = scrollTop;
    }
  },
  mounted() {
    window.addEventListener("scroll", this.windowScroll);
  }
};
</script>

<style lang="scss" scoped>
.content {
  position: absolute;
  top: 200px;
  width: 100%;
}
.footer_btn {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  display: none;
  opacity: 0;
}
.header_btn,
.footer_btn {
  background: red;
  color: #fff;
  border: none;
  height: 50px;
  width: 300px;
  border-radius: 10px;
  font-size: 30px;
  font-weight: bold;
}
</style>