<template>
  <Pie :basedata="basedata" :r="r" :id="id" />
</template>

<script>
// import vuePie from "../components/vue-pie.vue";
import Pie from "vue-pie-canvas"
export default {
  components: {
    Pie,
  },
  data() {
    return {
      basedata: [
        {
          num: 200,
          color: "black",
        },
        {
          num: 200,
          color: "yellow",
        },
        {
          num: 200,
          color: "green",
        },
      ],
      r: 50,
      id: "xxxx-1",
    };
  },
};
</script>

<style>
</style>