<template>
  <Vuescroll class="wrapper" :data="data" :pulldown="pulldown" @pulldown="loadData">
    <ul class="content">
      <li v-for="item in data" :key="item">{{item}}</li>
    </ul>
    <div class="loading-wrapper"></div>
  </Vuescroll>
</template>
<script>
import Vuescroll from "../components/scroll";
export default {
  components: {
    Vuescroll
  },
  data() {
    return {
      data: 10,
      pulldown: true
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    loadData() {
      console.log('loadData')
      this.data += 10;
    }
  }
};
</script>