<template>
  <div class="container">
    <list v-model="loading" :offset="offset" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <cell v-for="item in list" :key="item" :title="item" />
    </list>
  </div>
</template>

<script>
import { List, Cell } from "vant";
export default {
  components: {
    List,
    Cell
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
	  time: null,
	  offset:10
    };
  },
  methods: {
    onLoad() {
		console.log('load')
      // 异步更新数据
    //   if (this.list.length >= 40) {
    //     //   this.finished = true;
    //     this.loading = false;
	// 	clearTimeout(this.time);
	// 	return;
    //   }
      this.time = setTimeout(() => {
        for (let i = 0; i < 20; i++) {
          this.list.push(this.list.length + 1);
        }
        // 加载状态结束
        this.loading = false;

        // 数据全部加载完成
      }, 2000);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>