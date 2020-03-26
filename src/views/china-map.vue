<template>
  <div class="echarts">
    <div :style="{height:'100vh',width:'100%'}" ref="myEchart"></div>
  </div>
</template>
<script>
import echarts from "echarts";
//   import '../../node_modules/echarts/map/js/world.js'
import "../../static/commonjs/_echart/china.js"; // 引入中国地图数据
import { mockData } from "../../static/commonjs/_echart/mock.js";
export default {
  name: "china",
  data() {
    return {
      chart: null
    };
  },
  mounted() {
    this.chinaConfigure();
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    deepClone(data) {
      return JSON.parse(JSON.stringify(data));
    },
    chinaConfigure() {
      let myChart = echarts.init(this.$refs.myEchart); //这里是为了获得容器所在位置
      window.onresize = myChart.resize;
      let one_dot = (() => {
        let obj = {};
        this.deepClone(mockData).forEach(x => {
          x.cords.push(x.zyd);
          obj[x.name + "_zyd"] = x.cords;
        });
        return obj;
      })();
      let two_dot = (() => {
        let obj = {};
        this.deepClone(mockData).forEach(x => {
          x.cords[0] += 1;
          x.cords.push(x.zmd);
          obj[x.name + "_zmd"] = x.cords;
        });
        return obj;
      })();
      let three_dot = (() => {
        let obj = {};
        this.deepClone(mockData).forEach(x => {
          x.cords[0] += 2;
          x.cords.push(x.fxwd);
          obj[x.name + "_fxwd"] = x.cords;
        });
        return obj;
      })();
      // 将坐标与值对应并反映在地图上
      var convertData = function(source, data) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
          var geoCoord = source[data[i].name];
          if (geoCoord) {
            res.push({
              name: data[i].name,
              value: geoCoord.concat(data[i].value)
            });
          }
        }
        return res;
      };
      myChart.setOption({
        // 进行相关配置
        backgroundColor: "#fff",
        animation: false,
        tooltip: {
          trigger: "item",
          showDelay: 0,
          transitionDuration: 0.2,
          formatter: function(params) {
            if (!params.data) return "暂无数据";
            if (params.seriesName === "门店个数") {
              let data = params.data;
              let m_data = mockData.filter(x => x.name === data.name)[0];
              return `<h2>${data.name}大区:${data.value}家</h2>
			 <p>专营店：${m_data.zyd}家</p> 
			 <p>专卖店家：${m_data.zmd}家</p> 
			 <p>分销网点：${m_data.fxwd}家</p> 
			  `;
            }
            return `<h5>${params.seriesName}</h5><p>数量：${
              params.data.value[2]
            }</p>`;
          }
        }, // 鼠标移到图里面的浮动提示框
        dataRange: {
          show: false,
          min: 0,
          max: 10000,
          realtime: true,
          calculable: true,
          color: ["#2787D5", "#fff"]
        },
        geo: {
          //   silent: true,
          // 这个是重点配置区
          map: "china", // 表示中国地图
          roam: true,
          label: {
            normal: {
              show: true, // 是否显示对应地名
              textStyle: {
                color: "rgba(0,0,0,0.7)"
              }
            }
          },
          itemStyle: {
            normal: {
              borderColor: "rgba(0, 0, 0, 0.2)"
            }
          }
        },
        series: [
          {
            type: "scatter",
            coordinateSystem: "geo" // 对应上方配置
          },
          {
            name: "门店个数", // 浮动框的标题
            type: "map",
            geoIndex: 0,
            data: mockData.map(x => {
              return {
                name: x.name,
                value: x.zyd + x.zmd + x.fxwd
              };
            })
          },
          {
            name: "专营店",
            type: "scatter",
            coordinateSystem: "geo",
            data: convertData(
              one_dot,
              mockData
                .filter(x => x.zyd > 0)
                .map(x => {
                  return {
                    name: x.name + "_zyd"
                  };
                })
            ),
            symbolSize: 7,
            itemStyle: {
              normal: {
                color: "orange"
              }
            }
          },
          {
            name: "专卖店",
            type: "scatter",
            coordinateSystem: "geo",
            data: convertData(
              two_dot,
              mockData
                .filter(x => x.zmd > 0)
                .map(x => {
                  return {
                    name: x.name + "_zmd"
                  };
                })
            ),
            symbolSize: 7,
            itemStyle: {
              normal: {
                color: "blue"
              }
            },
            zlevel: 1
          },
          {
            name: "分销网店",
            type: "scatter",
            coordinateSystem: "geo",
            data: convertData(
              three_dot,
              mockData
                .filter(x => x.fxwd > 0)
                .map(x => {
                  return {
                    name: x.name + "_fxwd"
                  };
                })
            ),
            symbolSize: 7,
            itemStyle: {
              normal: {
                color: "pink"
              }
            },
            zlevel: 1
          }
        ]
      });
    }
  }
};
</script>