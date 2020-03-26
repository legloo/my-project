<template>
  <div class="container">
    <div class="filters" v-if="currentOptions">
      <el-form :label-position="'top'" style="width: 58%;
    margin: auto;
}">
        <el-form-item label="代理商" v-if="currentOptions.shouApiOptions.includes('agent')">
          <el-select
            filterable
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
        <!-- <el-form-item label="所属部门">
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
        </el-form-item>-->
          <el-form-item label="战区" v-if="currentOptions.shouApiOptions.includes('zq')">
          <el-select
            v-model="zq_options_value"
            :disabled="zq_options_disabled"
            placeholder="请选择"
          >
            <el-option
              v-for="(item,index) in zq_options"
              :key="'zq_options'+index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
          <el-form-item label="省区" v-if="currentOptions.shouApiOptions.includes('sq')">
          <el-select
            v-model="sq_options_value"
            :disabled="sq_options_disabled"
            placeholder="请选择"
          >
            <el-option
              v-for="(item,index) in sq_options"
              :key="'sq_options'+index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="终端类别" v-if="currentOptions.shouApiOptions.includes('terminal')">
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
        <el-form-item label="终端所属" v-if="currentOptions.showLocalOptions.includes('term_belong')">
          <el-select
            v-model="term_belong_options_value"
            :disabled="term_belong_options_disabled"
            placeholder="请选择"
          >
            <el-option
              v-for="(item,index) in term_belong_options"
              :key="'term_belong_options'+index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="事业部类型">
          <el-select v-model="ownerDept_options_value" :disabled="true" placeholder="请选择">
            <el-option
              v-for="(item,index) in ownerDept_options"
              :key="'term_options'+index"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item>
          <el-button size="medium" type="primary" @click="search">查询</el-button>
          <el-button size="medium" @click="reset" type="info">重置</el-button>
        </el-form-item>
        <el-form-item>
          <div v-for="(item,index) in get_dif_icons" :key="'diff_coin'+index">
            <span>{{item.name}}:</span>
            <img style="vertical-align: sub;
    width: 20px;" :src="item.value" alt />
          </div>
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
import { mapInfo } from "./utils/aupu-map";
export default {
  computed: {
    get_dif_icons() {
      let dc = [];
      if (!this.diff_icon) {
        return [];
      }
      for (let key in this.diff_icon) {
        let item = {
          name: key,
          value: this.diff_icon[key]
        };
        dc.push(item);
      }
      if (this.ownerDept_options_value === "electric") {
        return dc;
      }
      if (this.ownerDept_options_value === "integration") {
        return dc;
      }
    }
  },
  data() {
    return {
      diff_icon: null,
      e_dif_icon: {
        专营店: "https://aupu-map.oss-cn-beijing.aliyuncs.com/flag_org.png",
        专卖店: "https://aupu-map.oss-cn-beijing.aliyuncs.com/flag_red.png",
        KA: "https://aupu-map.oss-cn-beijing.aliyuncs.com/flag_deblue.png",
        照明综合店:
          "https://aupu-map.oss-cn-beijing.aliyuncs.com/flag_yello.png",
        家居综合店:
          "https://aupu-map.oss-cn-beijing.aliyuncs.com/flag_purpo.png",
        五金综合店:
          "https://aupu-map.oss-cn-beijing.aliyuncs.com/flag_green.png",
        分销网点: "https://aupu-map.oss-cn-beijing.aliyuncs.com/flag_blue.png"
      },
      i_dif_icon: {
        集成专卖店: "https://aupu-map.oss-cn-beijing.aliyuncs.com/flag_org.png",
        家装展厅: "https://aupu-map.oss-cn-beijing.aliyuncs.com/flag_red.png",
        KA: "https://aupu-map.oss-cn-beijing.aliyuncs.com/flag_deblue.png",
        超市: "https://aupu-map.oss-cn-beijing.aliyuncs.com/flag_yello.png"
      },
      host: "http://47.96.139.66",
      token: "",
      loading: null,
      map: {},
      dataList: [],
      user_dataList: [],
      opts: {
        width: 500,
        height: 380
      },

      agent_options: [],
      // depart_options: [],
      term_options: [],
      ownerDept_options: ["全部"],
      term_belong_options: ["全部", "代理商", "分销商"],
      zq_options: [],
      sq_options: [],

      agent_options_value: "全部",
      // depart_options_value: "全部",
      term_options_value: "全部",
      ownerDept_options_value: "全部",
      term_belong_options_value: "全部",
      zq_options_value: "全部",
      sq_options_value: "全部",

      agent_options_disabled: false,
      // depart_options_disabled: false,
      term_options_disabled: false,
      ownerDept_options_disabled: false,
      term_belong_options_disabled: false,
      zq_options_disabled: false,
      sq_options_disabled: false,

      color_g: [
        [0, 1, "#F4F4F4"],
        [1, 20, "#9fc2e6"],
        [20, 50, "#81b4e8"],
        [50, 100, "#589fe8"],
        [100, 200, "#2283e6"]
      ],
      currentOptions: null
    };
  },
  async created() {
    let query = this.$route.query;
    this.agent_options_value = query.agent_options_value
      ? query.agent_options_value
      : "全部";
    // this.depart_options_value = query.depart_options_value
    //   ? query.depart_options_value
    //   : "全部";
    this.term_options_value = query.term_options_value
      ? query.term_options_value
      : "全部";
    // this.ownerDept_options_value = query.ownerDept_options_value
    //   ? query.ownerDept_options_value
    //   : "全部";
    this.agent_options_disabled = query.agent_options_value ? true : false;
    // this.depart_options_disabled = query.depart_options_value ? true : false;
    this.term_options_disabled = query.term_options_value ? true : false;
    // this.ownerDept_options_disabled = query.ownerDept_options_disabled
    //   ? true
    //   : false;
    // this.ownerDept_options_value = query.type
    if (!query.type) {
      return this.$message.error("不合法的地址");
    }
    if (!["electric", "integration"].includes(query.type)) {
      return this.$message.error("type error,please check");
    }

    this.ownerDept_options_value = query.type;
    if (this.ownerDept_options_value === "electric") {
      this.diff_icon = this.e_dif_icon;
    }
    if (this.ownerDept_options_value === "integration") {
      this.diff_icon = this.i_dif_icon;
    }
    this.currentOptions = mapInfo.filter(x => x.code === query.type)[0];
    console.log("this.currentOptions", this.currentOptions);
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
    this.makeOptions();
    this.user_dataList = this.deepClone(this.dataList);
    this.search();
  },
  async mounted() {},
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
        //
        var d_icon = this.diff_icon[this.user_dataList[i].terminal]
          ? this.diff_icon[this.user_dataList[i].terminal]
          : "https://aupu-map.oss-cn-beijing.aliyuncs.com/location_other.png";
        var myIcon = new BMap.Icon(d_icon, new BMap.Size(32, 32));
        var marker = new BMap.Marker(pt, { icon: myIcon });
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
			<p class="address"><img src="https://aupu-map.oss-cn-beijing.aliyuncs.com/card/agent.png" />${this.user_dataList[i].agent}</p>
			<p class="address"><img src="https://aupu-map.oss-cn-beijing.aliyuncs.com/card/terminal-window-fill.png" />${this.user_dataList[i].terminal}</p>
			<p class="address"><img src="https://aupu-map.oss-cn-beijing.aliyuncs.com/card/category.png" />${this.user_dataList[i].terminalAssignment}</p>
			<p class="address"><img src="https://aupu-map.oss-cn-beijing.aliyuncs.com/card/location.png" />${this.user_dataList[i].address}</p>
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
          url:
            "https://aupu-map.oss-cn-beijing.aliyuncs.com/675809fed8efc01ad664533a7503e93.png",
          size: new BMap.Size(32, 32),
          textColor: "#ffffff"
        }
      ];
      var markerClusterer = new BMapLib.MarkerClusterer(this.map, {
        markers: markers,
        styles: _styles
      });
      if (this.user_dataList.length) {
        this.areaColor(BMap, this.map);
      }
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
            .filter(
              x => x.agent !== null && x.agent !== "" && x.agent !== undefined
            )
            .map(x => x.agent)
        )
      );
      // this.depart_options = Array.from(
      //   new Set(
      //     this.dataList
      //       .filter(
      //         x =>
      //           x.department !== null &&
      //           x.department !== "" &&
      //           x.department !== undefined
      //       )
      //       .map(x => x.department)
      //   )
      // );
      this.zq_options = Array.from(
        new Set(
          this.dataList
            .filter(
              x =>
                x.zq !== null &&
                x.zq !== "" &&
                x.zq !== undefined
            )
            .map(x => x.zq)
        )
      );
      this.sq_options = Array.from(
        new Set(
          this.dataList
            .filter(
              x =>
                x.sq !== null &&
                x.sq !== "" &&
                x.sq !== undefined
            )
            .map(x => x.sq)
        )
      );
      this.term_options = Array.from(
        new Set(
          this.dataList
            .filter(
              x =>
                x.terminal !== null &&
                x.terminal !== "" &&
                x.terminal !== undefined
            )
            .map(x => x.terminal)
        )
      );
      // this.ownerDept_options = Array.from(
      //   new Set(
      //     this.dataList
      //       .filter(
      //         x =>
      //           x.ownerDept !== null &&
      //           x.ownerDept !== "" &&
      //           x.ownerDept !== undefined
      //       )
      //       .map(x => x.ownerDept)
      //   )
      // );
      this.ownerDept_options = [
        {
          name: "电器事业部",
          value: "electric"
        },
        {
          name: "集成事业部",
          value: "integration"
        }
      ];
      this.agent_options.unshift("全部");
      this.zq_options.unshift("全部");
      this.sq_options.unshift("全部");
      // this.depart_options.unshift("全部");
      this.term_options.unshift("全部");
      this.ownerDept_options.unshift("全部");
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
    toLogin() {
      window.location.href = `${this.host}/login`;
    },
    async getData() {
      try {
        this.token = localStorage.getItem("token");
        if (!this.token) {
          this.loading.close();
          this.toLogin();
          return;
        }
        let config = {
          headers: {
            Authorization: "Bearer " + this.token
          }
        };
        let num = this.ownerDept_options_value === "electric" ? 0 : 1;
        let res = await Axios.get(
          `${this.host}/api/api/MapInfo/listPointsInfo?type=${num}`,
          config
        );
        // let res = await Axios.get(`/api/api/organization/user/info`,config);
        if (res.data.data) {
          let f_data = res.data.data.filter(x => x.lng !== 0);
          console.log(f_data);
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
        this.toLogin();
      }
    },
    search() {
      this.loading = this.$loading({
        lock: true,
        text: "正在加载...",
        spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 0.5)"
      });
      this.user_dataList = this.deepClone(this.dataList);
      const filterKeys = [
        {
          localValue: "agent_options_value",
          dataKey: "agent"
        },
        {
          localValue: "zq_options_value",
          dataKey: "zq"
        },
        {
          localValue: "sq_options_value",
          dataKey: "sq"
        },
        // {
        //   localValue: "depart_options_value",
        //   dataKey: "department"
        // },
        {
          localValue: "term_options_value",
          dataKey: "terminal"
        },
        {
          localValue: "term_belong_options_value",
          dataKey: "terminalAssignment"
        }
        // {
        //   localValue: "ownerDept_options_value",
        //   dataKey: "ownerDept"
        // }
      ];
      for (let i = 0; i < filterKeys.length; i++) {
        // console.log(this[filterKeys[i].localValue]);

        if (
          this[filterKeys[i].localValue] &&
          this[filterKeys[i].localValue] !== "全部"
        ) {
          this.user_dataList = this.user_dataList.filter(
            x => x[filterKeys[i].dataKey] === this[filterKeys[i].localValue]
          );
        }
      }
      let hadGeo = this.user_dataList.filter(x => x.lng !==0 && x.lat !==0);
      let msg = `查询到共${this.user_dataList.length}家门店，其中有坐标的门店为${hadGeo.length}家`
      this.$message.info(msg);
      this.loading.close();
      this.setMap();
    },
    reset() {
      if (!this.agent_options_disabled) {
        this.agent_options_value = "全部";
      }
      if (!this.zq_options_disabled) {
        this.zq_options_value = "全部";
      }
      if (!this.sq_options_disabled) {
        this.sq_options_value = "全部";
      }
      // if (!this.depart_options_disabled) {
      //   this.depart_options_value = "全部";
      // }
      if (!this.term_options_disabled) {
        this.term_options_value = "全部";
      }
      if (!this.term_belong_options_disabled) {
        this.term_belong_options_value = "全部";
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
  padding-top: 10px;
  height: 100vh;
  overflow: scroll;
}
// /deep/ .el-form {
//   text-align: center;
//   .el-form-item__label {
//     width: 100px;
//   }
// }
.map_container {
  flex: 0 0 80%;
}
.map {
  height: 100vh;
  width: 100%;
}
</style>
