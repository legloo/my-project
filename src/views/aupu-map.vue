<template>
  <div class="container">
    <div class="filters" v-show="select_show">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="代理商">
          <el-select v-model="agent_options_value" placeholder="请选择">
            <el-option
              v-for="(item,index) in agent_options"
              :key="'agent_options'+index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属部门">
          <el-select v-model="depart_options_value" placeholder="请选择">
            <el-option
              v-for="(item,index) in depart_options"
              :key="'depart_options'+index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="终端类别">
          <el-select v-model="term_options_value" placeholder="请选择">
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
          <el-button size="medium" type="info">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- :icon="{url: marker.url, size: { width: 300, height: 171 }}" -->
    <div class="map_container">
      <baidu-map v-if="map_show" class="map" @ready="handler" :map-click="false">
        <bml-marker-clusterer
          :styles="markers_style"
          :averageCenter="true"
          v-if="markersShow&&markers.length"
        >
          <div v-for="(marker, i) of markers" :key="i" class="dsb">
            <bm-marker
              ref="bm_marker"
              animation="BMAP_ANIMATION_BOUNCE"
              :position="{lng: marker.lng, lat: marker.lat}"
              @click="infoWindowOpen(marker)"
            >
              <bm-info-window
                :position="{lng: marker.lng, lat: marker.lat}"
                :show="marker.showFlag"
                @close="infoWindowClose(marker)"
              >
                <div class="info_container">
                  <p class="title">{{marker.com_info.com_name}}</p>
                  <p class="address">
                    <img src="https://aupu.oss-cn-beijing.aliyuncs.com/location.png" />
                    {{marker.com_info.address}}
                  </p>
                  <p class="tel">
                    <img src="https://aupu.oss-cn-beijing.aliyuncs.com/phone.png" />
                    {{marker.com_info.tel}}
                  </p>
                  <p class="imgs">相册</p>
                  <div class="com_imgs">
                    <p v-show="!marker.com_info.imgs.length" class="no_imgs">暂无图片</p>
                    <template v-show="!marker.com_info.imgs.length">
                      <img
                        v-for="(img,index) in marker.com_info.imgs"
                        :key="'imgs'+index"
                        class="com_img"
                        :src="img"
                      />
                    </template>
                  </div>
                </div>
              </bm-info-window>
            </bm-marker>
          </div>
        </bml-marker-clusterer>
      </baidu-map>
    </div>
  </div>
</template>

<script>
// 按需引入点聚合
import { BmlMarkerClusterer } from "vue-baidu-map";
// 引入marker
import BmMarker from "vue-baidu-map/components/overlays/Marker";
import { resolve } from "url";
// 插入 100 个随机点
// const markers = [];

export default {
  name: "Bmaptrace",
  components: {
    BmlMarkerClusterer,
    BmMarker
  },
  data() {
    return {
      select_show: false,
      map_show: false,
      markers_style: [
        {
          url: "https://aupu.oss-cn-beijing.aliyuncs.com/circle_.png",
          size: {
            width: 32,
            height: 32,
            color: "gold"
          }
        }
      ],
      BMap: "",
      map: "",
      markers: [],
      show: false,
      dataList: [],
      user_dataList: [],
      markersShow: false,
      color_g: [[0, 1, "#F4F4F4"], [1, 5, "#0567cc"], [5, 100, "#0567cc"]],
      agent_options: [],
      depart_options: [],
      term_options: [],
      agent_options_value: "全部",
      depart_options_value: "全部",
      term_options_value: "全部"
    };
  },
  async created() {
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
    this.dataList = await this.getData();
    this.user_dataList = JSON.parse(JSON.stringify(this.dataList));
    this.map_show = true;
  },
  mounted() {},
  methods: {
    search() {
      this.user_dataList = JSON.parse(JSON.stringify(this.dataList));
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
      this.init(this.BMap, this.map);
      // location.href = location.href.split('?')[0]+`?agent_options_value=${this.agent_options_value}&depart_options_value=${this.depart_options_value}&term_options_value=${this.term_options_value}`;
    },
    handler({ BMap, map }) {
      map.enableScrollWheelZoom(true);
      map.centerAndZoom(new BMap.Point(102.404, 38.915), 5);
      map.addControl(new BMap.NavigationControl());
      map.setMinZoom(5);
      this.BMap = BMap;
      this.map = map;
      this.init(this.BMap, this.map);

      //区域颜色划分
      //制作下拉选择组
      this.makeOptions();
    },
    async init(BMap, map) {
      map.clearOverlays();
      this.markersShow = false;
      this.markers = [];
      for (let i = 0; i < this.user_dataList.length; i++) {
        const position = {
          lng: this.user_dataList[i].geo[0],
          lat: this.user_dataList[i].geo[1],
          // url: "http://developer.baidu.com/map/jsdemo/img/fox.gif",
          showFlag: false,
          com_info: {
            com_name: this.user_dataList[i].com_name,
            address: this.user_dataList[i].address,
            tel: this.user_dataList[i].tel,
            imgs: this.user_dataList[i].imgs
          }
        };
        this.markers.push(position);
      }
      this.areaColor(BMap, map);
      this.markersShow = true;
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
      for (let i = provinces.length - 1; i >= 0; i--) {
        let current_length = this.dataList.filter(
          x => x.province.indexOf(provinces[i]) > -1
        ).length;
        let current_color = this.color_g.filter(
          x => x[0] <= current_length && x[1] > current_length
        )[0][2];
        provinces[i] += "-" + current_color;
        this.getBoundary(BMap, map, provinces[i]);
      }
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
      this.agent_options = Array.from(new Set(this.dataList.map(x => x.agent)));
      this.depart_options = Array.from(
        new Set(this.dataList.map(x => x.department))
      );
      this.term_options = Array.from(
        new Set(this.dataList.map(x => x.terminal))
      );
      this.agent_options.unshift("全部");
      this.depart_options.unshift("全部");
      this.term_options.unshift("全部");
      this.select_show = true;
    },
    // 关闭信息窗口 @close 自带的方法
    infoWindowClose(marker) {
      marker.showFlag = false;
    },
    infoWindowOpen(marker) {
      console.log(marker.showFlag);
      marker.showFlag = true;
      console.log(marker.showFlag);
    },
    getData() {
      return new Promise(resolve => {
        const data = [
          {
            geo: [120.148245, 30.324932], //坐标
            com_name: "杭州格博卫浴有限公司", //门店名称
            address: "昌硕西路302-304号", //地址
            tel: "0572-5030968", //电话
            imgs: [], //门店照片
            agent: "代理商一", //代理商
            department: "部门一", //所属部门
            terminal: "ios", //终端
            province: "浙江省" //省会|直辖市
          },
          {
            geo: [120.374187, 29.895542],
            com_name: "临安旗舰店",
            address: "临安市锦城街道城中街828号",
            tel: "0571-63807980",
            imgs: [
              "https://aupu.oss-cn-beijing.aliyuncs.com/test_com.jpg",
              "https://aupu.oss-cn-beijing.aliyuncs.com/test_com.jpg",
              "https://aupu.oss-cn-beijing.aliyuncs.com/test_com.jpg",
              "https://aupu.oss-cn-beijing.aliyuncs.com/test_com.jpg"
            ],
            agent: "代理商二",
            department: "部门二",
            terminal: "andorid",
            province: "浙江省"
          },
          {
            geo: [119.961397, 29.443141],
            com_name: "临平店",
            address: "江南家居南门二楼C-15",
            tel: "0571 - 86777763",
            imgs: [],
            agent: "代理商一",
            department: "部门三",
            terminal: "pc",
            province: "浙江省"
          },
          {
            geo: [119.743504, 29.121556],
            com_name: "大都会店",
            address: "江南大道1088号第六空间大都会建材馆二楼C2 - 5A",
            tel: "0571 - 81950510",
            imgs: [],
            agent: "代理商四",
            department: "部门四",
            terminal: "pc",
            province: "浙江省"
          }
        ];
        resolve(data);
      });
    }
  }
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
.info_container {
  width: 500px;
}

.info_container .title {
  color: #fff;
  background: #2d77e6;
  padding: 12px;
  margin-top: 20px;
}

.info_container .address,
.info_container .tel {
  margin: 0;
  padding: 0;
  font-size: 13px;
  margin-bottom: 10px;
  margin-top: 20px;
}

.info_container .address img,
.info_container .tel img {
  width: 13px;
  vertical-align: middle;
  margin-right: 5px;
}

.info_container .imgs {
  font-size: 15px;
  margin: 15px 0;
}

.com_imgs {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}

.com_imgs .com_img {
  display: block;
  flex: 0 0 20%;
  width: 1px;
  border: 1px solid #eee;
  margin-right: 10px;
}

.com_imgs .no_imgs {
  text-align: center;
  width: 100%;
  margin-top: 30px;
  color: #cac8c8;
}
</style>