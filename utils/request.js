import { Config } from "./config.js";

axios.defaults.baseURL = Config.baseURL;

function getCookie(name) {
  var arr,
    reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if ((arr = document.cookie.match(reg))) return unescape(arr[2]);
  else return null;
}

// http request 拦截器
axios.interceptors.request.use(
  (config) => {
    // config.headers.AUTHORIZATION = getCookie('token')
    config.headers.Authorization = getCookie("token");
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

//设置cookie
function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + "; " + expires + ";path=/";
}

// 将blob对象转化为json（文件类型调用ajax 取后端的返回值做特殊处理）
function fileToJson(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (res) => {
      const { result } = res.target; // 得到字符串
      const data = JSON.parse(result); // 解析成json对象
      resolve(data);
    }; // 成功回调
    reader.onerror = (err) => {
      reject(err);
    }; // 失败回调
    reader.readAsText(new Blob([file]), "utf-8"); // 按照utf-8编码解析
  });
}

// http response 拦截器
axios.interceptors.response.use(
  async (response) => {
    //拦截响应，做统一处理
    console.log(response);
    let responseType = response.config.responseType;

    let data = response.data;
    if (responseType == "blob" && data.type == "application/json") {
      console.log("blob");
      data = await fileToJson(response.data);
      console.log("data", data);
    }
    let code = data.code;
    if (code) {
      switch (code) {
        case "403":
          // alert("未登录")
          window.app
            .$prompt(data.data, "请输入口令", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
              // inputErrorMessage: '邮箱格式不正确'
            })
            .then(({ value }) => {
              var token = CryptoJS.MD5(data.data + value);
              localStorage.setItem("token", token);
              setCookie("token", token, 10);
              window.location.reload();
            })
            .catch((e) => {
              console.log(e);
              window.app.$message({
                type: "info",
                message: "取消输入",
              });
            });
      }
    }
    return response;
  },
  //接口错误状态处理，也就是说无响应时的处理
  (error) => {
    return Promise.reject(error.response.status); // 返回接口返回的错误信息
  }
);
