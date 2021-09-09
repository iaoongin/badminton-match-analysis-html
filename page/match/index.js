export const MatchPage = {
  template: `<div id="luckysheet" style="margin:0px;padding:0px;position:absolute;width:100%;height:100%;left: 0px;top: 0px;"></div>
`,
  data() {
    return {
        loading: {}
    };
  },
  mounted() {
    this.loading = this.$loading({
      lock: true,
      text: "Loading",
    //   spinner: "el-icon-loading",
    //   background: "rgba(0, 0, 0, 0.7)",
    });
  },
  created() {
    // console.log(this)
    var that = this;
    axios
      .get("/api/matchRecord/raw", {
        responseType: "blob",
      })
      .then((response) => {
        that.loading.close();
        var reader = new FileReader();
        reader.onload = (e) => {
          //预处理
          var binary = "";
          var buf = new Uint8Array(e.target.result);
          var length = buf.byteLength;
          for (var i = 0; i < length; i++) {
            binary += String.fromCharCode(buf[i]);
          }

          //读取excel

          LuckyExcel.transformExcelToLucky(
            binary,
            function (exportJson, luckysheetfile) {
              // Get the worksheet data after conversion
            //   console.log(exportJson);
              // console.log(luckysheetfile)
              //配置项
              var options = {
                container: "luckysheet", //luckysheet为容器id
                lang: "zh",
                data: exportJson.sheets,
                title: "白石龙比赛记录",
                userInfo: "",
                functionButton: `<button id='btnSave' class='el-button el-button--default el-button--medium'>保存</button>`,
              };

              

              luckysheet.create(options);

              that.bindListenner();
            }
          );
        };
        console.log(response);
        console.log(typeof response.data);
        reader.readAsArrayBuffer(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  },
  methods: {
    bindListenner() {
      var that = this;
      var btnSave = document.getElementById("btnSave");
      btnSave.addEventListener("click", (e) => {
        console.log("save.");

        // is-loading
        btnSave.classList.add("is-loading");
        var i = document.createElement("i");
        i.classList.add("el-icon-loading");
        btnSave.prepend(i);

        axios
          .post(
            "/api/matchRecord/luckySheet/save",
            luckysheet.getLuckysheetfile()
          )
          .then((resp) => {
            console.log(resp);
            btnSave.classList.remove("is-loading");
            btnSave.removeChild(i);

            if (resp.data.code == "200") {
              that.$message(resp.data.msg);
            } else {
              that.$message({
                type: "error",
                message: resp.data.data,
              });
            }
          });
      });
    },
  },
};
