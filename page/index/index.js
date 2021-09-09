export const IndexPage = {
    template: `
        <div id="app">
            <el-row>
                <el-card class="box-card">
                    <el-dropdown @command="handleCommand">
                            <span class="el-dropdown-link">
                                {{title}}<i class="el-icon-arrow-down el-icon--right"></i>
                              </span>
        
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="(value,key,index) in dropDownMenu" :command='key'>{{value}}
                            </el-dropdown-item>
                        </el-dropdown-menu>
        
                    </el-dropdown>
                    <el-link type="primary" href='#/match' target="_blank" style="margin-left: 2rem;">预览原始数据</el-link>
                    
                </el-card>
            </el-row>
            </el-page-header>
            <el-row>
                <el-col :span="24">
                    <el-table :data="tableData" style="width: 100%" border stripe v-loading='loading'>
                        <el-table-column type="index" label="序号" align="right" fixed></el-table-column>
                        <el-table-column prop="player" label="运动员" sortable align="right"></el-table-column>
                        <el-table-column prop="totalScore" label="累计得分" sortable align="right"></el-table-column>
                        <el-table-column prop="totalMatch" label="场次" sortable align="right"></el-table-column>
                        <el-table-column prop="wins" label="胜场" sortable align="right"></el-table-column>
                        <el-table-column prop="scorePerMatch" label="场均得分" sortable align="right"></el-table-column>
                        <el-table-column prop="scoreLow" label="史低" sortable align="right"></el-table-column>
                        <el-table-column prop="winRatio" label="胜率" sortable align="right"></el-table-column>
                    </el-table>
                </el-col>
            </el-row>
        </div>
`,
    data() {
        return {
            tableData: [],
            title: "个人排行",
            loading: false,
            isLogin: true,
            dropDownMenu: {
                "single": "单打排行",
                "manSingle": "男单排行",
                "femaleSingle": "女单排行",

                "doubles": "双打排行",
                "manDoubles": "男双排行",
                "femaleDoubles": "女双排行",
                "mixedDoubles": "混双排行"
            },
        }

    },
    created() {
        this.init()
    },
    methods: {
        fetch(command) {
            this.title = this.dropDownMenu[command]
            // console.log(this.title)
            this.loading = true
            var that = this
            axios.get('api/rank/' + command)
                .then(response => {
                    console.log(response)
                    
                    that.tableData = this.formatData(response.data.data)
                    setTimeout(() => {
                        that.loading = false 
                    }, 100);
                })
        },
        init() {
            this.fetch('single')
        },
        handleCommand: function (command) {
            this.fetch(command)
        },
        handleRawDataPreview: function () {
            window.location.href = '/match'
        },
        formatData(data){
            return data.map(x =>{
                x.winRatio = (x.winRatio * 100).toFixed(2) +"%"
                x.scorePerMatch = (x.scorePerMatch).toFixed(2)
                return x
            })
        }

    },
    watch: {
        title() {
            document.title = this.title
        }
    }
}
