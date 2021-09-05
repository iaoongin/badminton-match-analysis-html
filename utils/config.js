var dev = {
  indexSrc: "/index.js",
  baseURL: "http://127.0.0.1:8080/",
};

var prod = {
  indexSrc: "/index.js",
  baseURL: "http://119.23.190.226/bma-api/",
};

let isProd = !(
  window.location.hostname == "127.0.0.1" ||
  window.location.hostname == "localhost"
);


export const Config = isProd ? prod : dev