import Vue from 'vue';
import * as THREE from 'three';
Vue.prototype.$three = THREE
//性能监视器Stats
import * as Stats from 'stats.js';
Vue.prototype.$stats = Stats
//动画引擎Tween.js
import TWEEN from "@tweenjs/tween.js";
Vue.prototype.$tween = TWEEN
//gltf-loader
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
Vue.prototype.$gltf = GLTFLoader
//
"use strict";

let Com = {}

Vue.prototype.Com = Com;

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
