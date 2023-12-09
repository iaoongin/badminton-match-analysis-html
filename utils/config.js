var dev = {
  indexSrc: "/index.js",
  baseURL: window.location.hostname.startsWith("192.168")
    ? `http://${window.location.hostname}:8080/`
    : "http://127.0.0.1:8080/",
};

var prod = {
  indexSrc: "/index.js",
  baseURL: "https://proxy.yffjglcms.com/bma-api",
};

let isProd = !(
  window.location.hostname == "127.0.0.1" ||
  window.location.hostname.startsWith("192.168") ||
  window.location.hostname == "localhost"
);

export const Config = isProd ? prod : dev;
