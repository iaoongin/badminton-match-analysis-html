export const MatchPage = {
    template: `<div id="luckysheet" style="margin:0px;padding:0px;position:absolute;width:100%;height:100%;left: 0px;top: 0px;"></div>
`,
    data() {
        return {

        }
    },
    created() {
        // console.log(this)
        axios
            .get('/api/matchRecord/raw', {
                responseType: 'blob'
            })
            .then((response) => {
                var reader = new FileReader();
                reader.onload = e => {
                    //预处理
                    var binary = '';
                    var buf = new Uint8Array(e.target.result);
                    var length = buf.byteLength;
                    for (var i = 0; i < length; i++) {
                        binary += String.fromCharCode(buf[i]);
                    }

                    //读取excel

                    LuckyExcel.transformExcelToLucky(binary, function (exportJson, luckysheetfile) {
                        // Get the worksheet data after conversion
                        console.log(exportJson)
                        //配置项
                        var options = {
                            container: 'luckysheet', //luckysheet为容器id
                            lang: 'zh',
                            data: exportJson.sheets,
                            title: "白石龙比赛记录",
                            userInfo: "小鑫"
                        }
                        luckysheet.create(options)
                    });

                };
                console.log(response)
                console.log(typeof response.data)
                reader.readAsArrayBuffer(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }
}

