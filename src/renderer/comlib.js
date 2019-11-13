var uuid = require('node-uuid');
//
"use strict";

let Com = {}

window.Com = Com;

Com.genID = (isTime) => {
  if(isTime) return uuid.v1(); // time-based
  else return uuid.v4(); // random
}

export default Com;





// import VueJsonp from "vue-jsonp";
// Vue.use(VueJsonp)
// import './axios'
// import qs from "qs";
// var urlencode = require('urlencode');
// import FileSaver from 'file-saver'
// import XLSX from 'xlsx'
// import json2csv from "json2csv";
// import $ from 'jquery'

// const config = {
//     baseURL: "http://120.78.10.102:54338/",
//     timeout: 60 * 1000, // Timeout
// };

// // urlencode加密,charset可以填gbk,isObject 可以将字符串或数值对象加密传输
// Com.encode = (str, charset, isObject) => {
//     if (isObject) {
//         return urlencode.stringify(str, { charset: charset });
//     }
//     if (charset) {
//         return urlencode(str, charset);
//     }
//     return urlencode(str);
// }

// // urlencode解密 this.Com.encode(data,'gbk',true) this.Com.decode(this.$route.params.arg,'gbk',true);
// Com.decode = (str, charset, isObject) => {
//     if (isObject) {
//         return urlencode.parse(str, { charset: charset });
//     }
//     if (charset) {
//         return urlencode.decode(str, charset);
//     }
//     return urlencode.decode(str);
// }

// Com.jsonp = (route, data, func, errfunc) => {
//     let url = config.baseURL + route
//     // console.log(url,data)
//     Vue.prototype.$jsonp(url, data, config.timeout)
//         .then(func).catch(err => { if (errfunc) errfunc(err) });
// }

// Com.post = (route, data, func, errfunc, headers) => {
//     Vue.prototype.$axios({
//         method: 'post',
//         headers: headers,
//         url: config.baseURL + route,
//         data: data
//     }).then(func).catch((err) => {
//         if (errfunc) errfunc(err);
//     });
// }

// Com.get = (route, data, func, errfunc) => {
//     Vue.prototype.$axios({
//         method: 'get',
//         url: config.baseURL + route,
//         params: data
//     }).then(func).catch((err) => {
//         if (errfunc) errfunc(err);
//     });
// }
