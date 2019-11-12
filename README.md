# imagination
vue init simulatedgreg/electron-vue imagination
cnpm install --save node-uuid
cnpm install vue-localstorage --save
cnpm i imports-loader exports-loader --save-dev
cnpm i three --save-dev
cnpm install three-orbitcontrols


性能监视器Stats
cnpm install stats.js
动画引擎Tween.js
cnpm i @tweenjs/tween.js@^18
GLTF模型
cnpm i --save three-gltf-loader

转换fbx文件：
D:\software\FBX2glTF-windows-x64.exe
直接拖fbx文件到该程序上面即可
> An electron-vue project

物理引擎
cnpm install --save schteppe/cannon.js

#### Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build

# run unit & end-to-end tests
npm test


```

---

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[8fae476](https://github.com/SimulatedGREG/electron-vue/tree/8fae4763e9d225d3691b627e83b9e09b56f6c935) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).

### 弃用库
FBX 模型 (弃用，支持特性太少 没有fbx符合)
cnpm i --save three-fbx-loader