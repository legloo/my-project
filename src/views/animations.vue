<template>
  <div class="container">
    <div class="marquee">
      <div class="marquee_box">
        <ul class="marquee_list" :class="{marquee_top:animate}">
          <li v-for="(item,index) in marqueeList" :key="index+1/3">{{item.name}}</li>
        </ul>
      </div>
    </div>
    <div class="notice">
      <img class="img1" src="../assets/notice.png" alt />
      <p>hahahahahahahha</p>
    </div>
    <div class="notice">
      <img class="img2" src="../assets/notice.png" alt />
      <p>hahahahahahahha</p>
    </div>

    <div class="notice2" style="text-align: left;">
      <i-button type="primary" @click="addData">添加数据</i-button>
      <div class ref="trasition" v-for="(item,index) in list" :key="index+1/2">
        <p>{{item.name}}</p>
      </div>
    </div>

    <div class="notice3"></div>
  </div>
</template>

<script>
import { setTimeout, setInterval, clearInterval, clearTimeout } from "timers";
export default {
  data() {
    return {
      list: [],
      index: 1,
      animate: false,
      marqueeList: [
        {
          name: "未领取"
        },

        {
          name: "0"
        }
      ]
    };
  },
  watch: {
    list(val) {
      let time;
      if (this.list.length) {
        time = setTimeout(() => {
          this.list.shift(1, 1);
        }, 9000);
      }
    }
  },
  methods: {
    addData() {
      if (this.list.length) return;
      this.list.push({
        img: "../assets/notice.png",
        name: this.index + "、朱玉豪已兑换 电动牙刷"
      });
      this.index++;
      let trasition;
      this.$nextTick(() => {
        trasition = this.$refs.trasition;
        trasition.forEach(x => {
          x.className = "trasition";
        });
      });
    },
    showMarquee: function() {
      this.animate = true;
      let time;
      clearTimeout(time);
      time = setTimeout(() => {
        this.marqueeList.push(this.marqueeList[0]);
        this.marqueeList.shift();
        this.animate = false;
      }, 500);
    }
  },
  mounted() {
    setInterval(this.showMarquee, 6000);
  }
};
</script>

<style lang="scss" scoped>
@keyframes bottom_move {
  from {
    left: -100%;
    bottom: -100px;
  }
  to {
    left: 10%;
    bottom: 100px;
  }
}
.notice3 {
  height: 100px;
  background-color: cadetblue;
  position: absolute;
  // bottom: 0;
  // left: 0;
  width: 80%;
  animation: bottom_move 3s ease-in-out infinite;
  animation-fill-mode: forwards;
}
.notice {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  border: 1px solid #e6e6e6;
  border-radius: 10px;
  .img1 {
    height: 15px;
    transform-origin: center top 0;
    transform: rotate(-45deg);
    animation: notice 100ms linear infinite both;
  }
  .img2 {
    height: 15px;
    transform: rotate(-45deg);
    animation: notice 200ms linear infinite both;
  }
  p {
    margin-left: 8px;
    font-size: 16px;
  }
}

.notice2 {
  height: 200px;
  border: 1px solid #e6e6e6;
  border-radius: 10px;
  background-color: sandybrown;
  position: relative;
  .trasition {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: 6px;
    bottom: 8px;
    background-color: rgba(0, 0, 0, 0.4);
    border-radius: 5px;
    padding: 3px;
    animation: mymove 5s linear;
    animation-fill-mode: forwards;
  }
  p {
    margin-left: 8px;
    font-size: 16px;
    color: #fff;
  }
}

@keyframes mymove {
  0% {
    bottom: 3px;
    opacity: 0;
  }
  10% {
    bottom: 18px;
    opacity: 0.1;
  }
  20% {
    bottom: 33px;
    opacity: 0.2;
  }
  30% {
    bottom: 48px;
    opacity: 0.3;
  }
  40% {
    bottom: 63px;
    opacity: 0.4;
  }
  50% {
    bottom: 78px;
    opacity: 0.5;
  }
  60% {
    bottom: 93px;
    opacity: 0.6;
  }
  70% {
    bottom: 108px;
    opacity: 0.7;
  }
  80% {
    bottom: 123px;
    opacity: 0.8;
  }
  90% {
    bottom: 138px;
    opacity: 0.9;
  }
  100% {
    bottom: 153px;
    opacity: 1;
  }
}

@keyframes notice {
  from,
  to {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(-45deg);
  }
}
//marq
.marquee {
  width: 100%;

  height: 50px;

  align-items: center;

  color: #3a3a3a;

  background-color: white;

  display: flex;

  box-sizing: border-box;

  overflow: hidden;
}

.marquee_title {
  padding: 0 20px;

  height: 21px;

  font-size: 14px;

  border-right: 1px solid #d8d8d8;

  align-items: center;
}

.marquee_box {
  display: block;

  position: relative;

  width: 60%;

  height: 30px;

  overflow: hidden;
}

.marquee_list {
  display: block;

  position: absolute;

  top: 0;

  left: 0;
}

.marquee_top {
  transition: all 0.5s;

  margin-top: -30px;
}

.marquee_list li {
  height: 30px;

  line-height: 30px;

  font-size: 14px;

  padding-left: 20px;
}

.marquee_list li span {
  padding: 0 2px;
}
</style>

