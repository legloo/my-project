<template>
  <div class="container">
    <div class="filters">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="代理商">
          <el-select
            v-model="agent_options_value"
            :disabled="agent_options_disabled"
            placeholder="请选择"
          >
            <el-option
              v-for="(item,index) in agent_options"
              :key="'agent_options'+index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属部门">
          <el-select
            v-model="depart_options_value"
            :disabled="depart_options_disabled"
            placeholder="请选择"
          >
            <el-option
              v-for="(item,index) in depart_options"
              :key="'depart_options'+index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="终端类别">
          <el-select
            v-model="term_options_value"
            :disabled="term_options_disabled"
            placeholder="请选择"
          >
            <el-option
              v-for="(item,index) in term_options"
              :key="'term_options'+index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="medium" type="primary" @click="search">查询</el-button>
          <el-button size="medium" @click="reset" type="info">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="map_container">
      <div class="map" id="map-core"></div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import BMap from "BMap";
import { setTimeout } from "timers";
import Axios from "axios";
export default {
  data() {
    return {
      host: "http://47.96.139.66",
      token:'',
      loading: null,
      map: {},
      dataList: [],
      user_dataList: [],
      opts: {
        width: 500,
        height: 300
      },
      agent_options: [],
      depart_options: [],
      term_options: [],
      agent_options_value: "全部",
      depart_options_value: "全部",
      term_options_value: "全部",
      agent_options_disabled: false,
      depart_options_disabled: false,
      term_options_disabled: false,
      color_g: [
        [0, 1, "#F4F4F4"],
        [1, 20, "#9fc2e6"],
        [20, 50, "#81b4e8"],
        [50, 100, "#589fe8"],
        [100, 200, "#2283e6"]
      ]
    };
  },
  created() {
    let query = this.$route.query;
    this.agent_options_value = query.agent_options_value
      ? query.agent_options_value
      : "全部";
    this.depart_options_value = query.depart_options_value
      ? query.depart_options_value
      : "全部";
    this.term_options_value = query.term_options_value
      ? query.term_options_value
      : "全部";
    this.agent_options_disabled = query.agent_options_value ? true : false;
    this.depart_options_disabled = query.depart_options_value ? true : false;
    this.term_options_disabled = query.term_options_value ? true : false;
  },
  async mounted() {
    this.loading = this.$loading({
      lock: true,
      text: "正在加载...",
      spinner: "el-icon-loading",
      background: "rgba(255, 255, 255, 0.5)"
    });
    this.dataList = await this.getData();
    if (this.dataList === undefined) {
      return;
    }
    console.log(this.dataList);
    this.makeOptions();
    this.user_dataList = this.deepClone(this.dataList);
    this.search();
  },
  methods: {
    // 初始化地图
    setMap() {
      this.map = new BMap.Map("map-core");
      this.map.clearOverlays();
      this.map.centerAndZoom(new BMap.Point(102.404, 38.915), 5);
      // 地图缩放控件
      const topLeftControl = new BMap.ScaleControl({
        anchor: BMAP_ANCHOR_BOTTOM_LEFT
      });
      // 城市选择控件
      const cityListControl = new BMap.CityListControl({
        anchor: BMAP_ANCHOR_TOP_RIGHT
      });
      this.map.enableScrollWheelZoom(true);
      // 比例尺控件
      const topLeftNavigation = new BMap.NavigationControl();
      this.map.addControl(topLeftControl);
      this.map.addControl(topLeftNavigation);
      this.map.addControl(cityListControl);
      this.map.setMinZoom(5);
      var markers = [];
      var pt = null;
      var i = 0;
      for (; i < this.user_dataList.length; i++) {
        pt = new BMap.Point(
          this.user_dataList[i].lng,
          this.user_dataList[i].lat
        );
        var marker = new BMap.Marker(pt);
        let imgs_dom = '<p class="no_imgs">暂无图片</p>';
        if (this.user_dataList[i].imgs && this.user_dataList[i].imgs.length) {
          imgs_dom = "";
          for (let x = 0; x < this.user_dataList[i].imgs.length; x++) {
            imgs_dom += `<img class="com_img" src="${this.host}/api/api/aliyun/download?refId=${this.user_dataList[i].imgs[x]}&access_token=${this.token}">`;
          }
        }
        var content = `
		<div class="info_container">
			<p class="title">${this.user_dataList[i].comName}</p>
			<p class="address"><img src="https://aupu.oss-cn-beijing.aliyuncs.com/location.png" />${this.user_dataList[i].address}</p>
			<p class="tel"><img src="https://aupu.oss-cn-beijing.aliyuncs.com/phone.png" />${this.user_dataList[i].tel}</p>
			<p class="imgs"><img src="https://aupu.oss-cn-beijing.aliyuncs.com/photo_.png" />相册</p>
			<div class="com_imgs">
				${imgs_dom}
				</div>
			</div>
		`;
        this.addClickHandler(content, marker); //添加点击事件
        markers.push(marker);
      }
      var _styles = [
        {
          url: "https://aupu.oss-cn-beijing.aliyuncs.com/circle_.png",
          size: new BMap.Size(32, 32)
        }
      ];
      var markerClusterer = new BMapLib.MarkerClusterer(this.map, {
        markers: markers,
        styles: _styles
      });
      this.areaColor(BMap, this.map);
    },
    areaColor(BMap, map) {
      let provinces = [
        "广西",
        "广东",
        "湖南",
        "贵州",
        "云南",
        "福建",
        "江西",
        "浙江",
        "安徽",
        "湖北",
        "河南",
        "江苏",
        "四川",
        "海南省",
        "山东",
        "辽宁",
        "新疆",
        "西藏",
        "陕西",
        "河北",
        "黑龙江",
        "宁夏",
        "内蒙古自治区",
        "青海",
        "甘肃",
        "山西",
        "吉林省",
        "北京",
        "天津",
        "三河市",
        "上海",
        "重庆市",
        "香港"
      ];
      for (let i = 0; i < provinces.length; i++) {
        let current_length = this.user_dataList.filter(
          x => x.province && x.province.indexOf(provinces[i]) > -1
        ).length;
        let current_color = this.color_g.filter(
          x => x[0] <= current_length && x[1] > current_length
        )[0][2];
        provinces[i] += "-" + current_color;
        this.getBoundary(BMap, map, provinces[i]);
      }
      this.loading.close();
    },
    getBoundary(BMap, map, province) {
      //此函数需要传入一个province参数，为上述数据中的一项
      var silvern = province.split("-"); //将数据项拆分，放入一个数组中待用
      var boundary = new BMap.Boundary(); //创建区域边界对象
      boundary.get(silvern[0], function(rs) {
        //获取区域边界数据，silvern[0]为区域名称，get方法会返回边界数据给第二个参数：回调函数 ；此处须注意，一个省有可能有多个闭合区域组成
        for (var i = 0; i < rs.boundaries.length; i++) {
          //boundaries.length代表行政区域的闭合区域有多少个，其中，每个boundaries为一个闭合区域中点的数组
          var ply = new BMap.Polygon(rs.boundaries[i], {
            strokeWeight: 1,
            strokeColor: silvern[1],
            fillColor: silvern[1],
            fillOpacity: 0.5
          }); //建立多边形覆盖物对象
          map.addOverlay(ply); //添加覆盖物
        }
      });
    },
    makeOptions() {
      this.agent_options = Array.from(
        new Set(
          this.dataList
            .filter(x => x.agent !== null && x.agent !== "")
            .map(x => x.agent)
        )
      );
      this.depart_options = Array.from(
        new Set(
          this.dataList
            .filter(x => x.department !== null && x.department !== "")
            .map(x => x.department)
        )
      );
      this.term_options = Array.from(
        new Set(
          this.dataList
            .filter(x => x.terminal !== null && x.terminal !== "")
            .map(x => x.terminal)
        )
      );
      this.agent_options.unshift("全部");
      this.depart_options.unshift("全部");
      this.term_options.unshift("全部");
      this.select_show = true;
    },
    addClickHandler(content, marker) {
      let self = this;
      marker.addEventListener("click", function(e) {
        self.openInfo(content, e);
      });
    },

    openInfo(content, e) {
      var p = e.target;
      var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
      var infoWindow = new BMap.InfoWindow(content, this.opts); // 创建信息窗口对象
      this.map.openInfoWindow(infoWindow, point); //开启信息窗口
    },
    async getData() {
      try {
         this.token = localStorage.getItem("token");
        if (!this.token) {
          this.loading.close();
          this.$message.error("无用户登录信息");
          return;
        }
        let config = {
          headers: {
            Authorization: "Bearer " + this.token
          }
        };
        let res = await Axios.get(`/api/api/MapInfo/listPointsInfo`,config);
        // let res = await Axios.get(`/api/api/organization/user/info`,config);
        if (res.data.data) {
          return res.data.data;
        } else {
          this.loading.close();
          this.$message.error(res.message);
          return undefined;
        }
      } catch (e) {
        console.log(e.request);
        this.loading.close();
        this.$message.error("获取数据失败");
      }
    },
    search() {
      this.loading = this.$loading({
        lock: true,
        text: "正在加载...",
        spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 0.5)"
      });
      if (!this.user_dataList.length) {
        this.loading.close()
        return this.$message.info("无符合条件的门店信息");
      }
      this.user_dataList = this.deepClone(this.dataList);
      if (this.agent_options_value && this.agent_options_value !== "全部") {
        this.user_dataList = this.user_dataList.filter(
          x => x.agent === this.agent_options_value
        );
      }
      if (this.depart_options_value && this.depart_options_value !== "全部") {
        this.user_dataList = this.user_dataList.filter(
          x => x.department === this.depart_options_value
        );
      }
      if (this.term_options_value && this.term_options_value !== "全部") {
        this.user_dataList = this.user_dataList.filter(
          x => x.terminal === this.term_options_value
        );
      }
      if (!this.user_dataList.length) {
        this.loading.close()
        return this.$message.info("无符合条件的门店信息");
      }
      this.setMap();
    },
    reset() {
      if (!this.agent_options_disabled) {
        this.agent_options_value = "全部";
      }
      if (!this.depart_options_disabled) {
        this.depart_options_value = "全部";
      }
      if (!this.term_options_disabled) {
        this.term_options_value = "全部";
      }
      this.search();
    },
    deepClone(data) {
      return JSON.parse(JSON.stringify(data));
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: row;
}
.filters {
  flex: 0 0 20%;
  margin-top: 100px;
}
/deep/ .el-form {
  text-align: center;
  .el-form-item__label {
    width: 100px;
  }
}
.map_container {
  flex: 0 0 80%;
}
.map {
  height: 100vh;
  width: 100%;
}
</style>
