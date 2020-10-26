<template>
  <div class="container">
    <div
      v-for="(planet, index) in system"
      :key="'system' + index"
      class="fa fa-contain"
      :style="{
        height: `${planet.fa / farule}px`,
        width: `${planet.fa / farule}px`,
        animationDuration: `${planet.speed / speedrule}s`,
      }"
    >
      <div
        class="ch"
        :style="{
          height: `${planet.ch / chrule}px`,
          width: `${planet.ch / chrule}px`,
          top: `-${planet.ch / 2 / chrule}px`,
          left: `${planet.fa / farule / 2 - planet.ch / 2 / chrule}px`,
          backgroundColor:`${planet.color}`
        }"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      farule:50,//公转轨道比例
      chrule:200,//行星直径比例
      speedrule:100,//公转周期比例 越大公转周期越短 为1时即 1s = 1天 为2时 1s = 2天
      system: [
        {
          name: "Mercury",//名称
          fa: 5791,//轨道半长轴 万千米
          ch: 2440,//赤道半径 千米
          speed: 88,//公转周期 天
          color:'grey'//颜色
        },
        {
          name: "Venus",
          fa: 10820.9,
          ch: 6073,
          speed: 224.701,
          color:'gold'
        },
        {
          name: "Earth",
          fa: 15029,
          ch: 6378,
          speed: 365,
          color:'blue'
        },
        {
          name: "Mars",
          fa: 22899.729625,
          ch: 3397.2,
          speed: 686.98,
          color:'red'
        },
        {
          name: "Jupiter",
          fa: 78151,
          ch: 71492,
          speed: 11.86 * 365,
          color:'#c7c776'
        },
        {
          name: "Saturn",
          fa: 143361.89,
          ch: 60000,
          speed: 29.458 * 365,
          color:'#f3f3c4'
        },
        {
          name: "Uranus",
          fa: 288827.8,
          ch: 25559,
          speed: 84 * 365,
          color:'#a6eaff'
        },
        {
          name: "Neptune",
          fa: 451741,
          ch: 24766,
          speed: 90581,
          color:'#476fff'
        },
      ],
    };
  },
};
</script>

<style>
.container {
  background-color: antiquewhite;
  height: 10000px;
  width: 10000px;
  margin: auto;
  position: relative;
}
.fa {
  margin: auto;
  border: 1px solid #000;
  border-radius: 50%;
  animation: rotate 1s linear infinite;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.ch {
  border: 1px solid #000;
  border-radius: 50%;
  position: absolute;
}
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>