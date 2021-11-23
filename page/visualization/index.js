export const VisualizationPage = {
  template: `
    <el-row>
        <el-card class="box-card" :header='cardHeader' shadow="hover">
            <div slot="header" class="clearfix">
            <el-link v-if="false" href='/' :underline="false" target="_blank"><el-button icon="el-icon-s-home" circle></el-button></el-link>
            
            {{cardHeader}}
            </div>
            

            <div id="chart"></div>
        </el-card>


        <br>
          <el-row>
            <el-col :xs=24 :md=4 >
              <span>运动员</span>
              <el-select v-model="players" filterable collapse-tags=false clearable='true'  multiple placeholder="请选择">
                  <el-option
                  v-for="player in metaInfo.players"
                  :key="player"
                  :label="player"
                  :value="player">
                  </el-option>
              </el-select>
            </el-col>

            <div v-if='this.isMobile'><br/> &nbsp;</div>

            <el-col :xs=24 :md=4 >
              <span>属性</span>
              <el-select v-model="attr" filterable placeholder="请选择">
                  <el-option
                  v-for="(k, v) in metaInfo.attrToName"
                  :key="k"
                  :label="k"
                  :value="v">
                  </el-option>
              </el-select>
            </el-col>

            <div v-if='this.isMobile'><br/> &nbsp;</div>
            
            <el-col :xs=24 :md=4 >
              <el-button type='primary' @click='fetch'>对比</el-button>
            </el-col>
          </el-row>       
    </el-row>
  `,
  data() {
    return {
      chart: {},
      cardHeader: "",
      players: [],
      attr: "",
      metaInfo: {},
      isMobile: false,
      //   tableData: {},
    };
  },
  mounted() {
    this.init();
    this.fetchMeta().then(() => this.fetch());
    this.listenWindowSize();
  },
  methods: {
    init() {
      let isMobile = window.matchMedia("(max-width: 700px)").matches;
      this.isMobile = isMobile;
      let chartHeight = isMobile ? 300 : 600;
      let chartPadding = isMobile ? [20, 10, 65, 50] : [20, 20, 95, 80];

      const chart = new G2.Chart({
        container: "chart",
        autoFit: true,
        height: chartHeight,
        padding: chartPadding,
        // renderer: 'svg',
      });

      chart.line().position("date*value").color("player").shape("smooth");

      chart.tooltip({
        showCrosshairs: true,
        shared: true,
      });

      chart.point().position("date*value").color("player").shape("circle");

      // chart.scale({
      //   value: {
      //     min: 0,
      //   },
      // });

      this.chart = chart;
    },
    fetch() {
      var that = this;

      let players = this.players; // ["小鑫", "小张", "堂哥"];
      let attrs = [this.attr]; // ["wins"];

      // players = ["小鑫", "小张", "堂哥"];
      // attrs = ["winRatio"];

      if (!players || players.length == 0 || !attrs || attrs.length == 0) {
        this.cardHeader = `选择运动员及属性进行对比`;
        return;
      }

      if (this.attr == "winRatio") {
        console.log(this.attr);
        that.chart.axis("value", {
          label: {
            formatter: (val) => {
              return (100 * val).toFixed(2) + "%";
            },
          },
        });
      } else {
        that.chart.axis("value");
      }

      console.log(that.metaInfo);

      let attrStr = attrs.map((x) => that.metaInfo.attrToName[x]).join(",");
      console.log(attrStr);
      this.cardHeader = `${players.join(",")} ·  ${attrStr}对比`;
      console.log(this.cardHeader);
      return axios
        .post("/api/visualization", {
          players: players,
          attrs: attrs,
        })
        .then((response) => {
          // console.log(response)

          // that.tableData = response.data.data;
          that.chart.data(response.data.data);

          that.chart.render();
          /* setTimeout(() => {
              that.loading = false;
            }, 100);
          */
        });
    },
    formatData(data) {
      return data.map((x) => {
        x.winRatio = (x.winRatio * 100).toFixed(2) + "%";
        x.scorePerMatch = x.scorePerMatch.toFixed(2);
        return x;
      });
    },
    fetchMeta() {
      return axios.get("api/metaInfo/").then((response) => {
        this.metaInfo = response.data.data;
        this.players = this.metaInfo.players.slice(0, 10);
        this.attr = "winRatio";
      });
    },
    listenWindowSize() {
      var that = this;
      window.onresize = () => {
        return (() => {
          // window.screenWidth = document.body.clientWidth;
          // that.screenWidth = window.screenWidth;
          that.isMobile = window.matchMedia("(max-width: 700px)").matches;
        })();
      };
    },
  },
  watch: {},
};
