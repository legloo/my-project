<template>
  <div class="container">
    <button id="debounceTime">debounceTime</button>
    <button id="throttleTime">throttleTime</button>
  </div>
</template>

<script>
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/fromEvent";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/throttleTime";
export default {
  data() {
    return {
      num: 1,
    };
  },
  mounted() {
    this.subButton();
  },
  methods: {
    subButton() {
      //订阅按钮点击+防抖
      Observable.fromEvent(document.getElementById("debounceTime"), "click")
        .debounceTime(1000)
        .subscribe(() => this.numchange("debounceTime"));
      //订阅按钮点击+节流
      Observable.fromEvent(document.getElementById("throttleTime"), "click")
        .throttleTime(1000)
        .subscribe(() => this.numchange("throttleTime"));
    },
    numchange(type) {
      this.num += 1;
      console.log(type, this.num);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>