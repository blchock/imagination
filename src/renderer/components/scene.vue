<template>
  <div class="main">
    <div class="main" ref="canvas">
      <div class="main" ref="ui" v-if="showUI">
        <Menu @loadObj="loadObject" @delObj="deleteObject" @loading="showLoading" />
      </div>
    </div>
  </div>
</template>


<script>
import Menu from "./menu.vue";
import { Loading } from "element-ui";
export default {
  name: "Scene",
  data() {
    return {
      showFPS: true,
      showUI: true,
      showHelper: true,
      camera: null,
      scene: null,
      renderer: null,
      mesh: null,
      stats: null,
      size: null,
      objs: [],
      loading: null
    };
  },
  methods: {
    initThree() {
      let container = this.$refs.canvas;
      this.size = { w: container.clientWidth, h: container.clientHeight };
      this.renderer = new this.$three.WebGLRenderer({ antialias: true });
      this.renderer.setSize(this.size.w, this.size.h);
      container.appendChild(this.renderer.domElement);
      this.renderer.setClearColor(0xffffff, 1.0);
      if (this.showFPS) {
        this.stats = new this.$stats();
        container.appendChild(this.stats.domElement);
      }
    },
    initCamera() {
      this.camera = new this.$three.PerspectiveCamera(
        45,
        this.size.w / this.size.h,
        1,
        10000
      );
      this.camera.position.set(100, 300, 600);
      this.camera.up.set(0, 1, 0);
      this.camera.lookAt(new this.$three.Vector3(0, 0, 0));
    },
    initScene() {
      this.scene = new this.$three.Scene();
    },
    initLight() {
      // 环境光
      var light = new this.$three.AmbientLight(0xffffff);
      light.position.set(100, 100, 200);
      this.scene.add(light);
      // 方向光/平行光/太阳光
      var light2 = new this.$three.DirectionalLight(0xf5e56b, 1);
      light2.position.set(100, 1000, 600);
      this.scene.add(light2);
    },
    showLoading(isShow) {
      if (isShow) {
        if (!self.loading)
          self.loading = Loading.service({
            fullscreen: true,
            background: "#00000066"
          });
      } else {
        if (self.loading) {
          self.loading.close();
          self.loading = null;
        }
      }
    },
    loadObject(path, func) {
      let self = this;
      if (self.loading) return;
      var loader = new this.$gltf();
      loader.load(
        path,
        function(gltf) {
          let obj = gltf.scene;
          self.objs.push(obj);
          self.scene.add(obj);
          if (func) func(obj);
          self.showLoading(false);
          console.log("add:", obj.uuid);
        },
        undefined,
        function(error) {
          self.$notify.error({
            title: "加载失败",
            message: "您导入了一个错误的gltf模型文件！出错原因请看控制台"
          });
          console.error(error);
          self.showLoading(false);
        }
      );
    },
    deleteObject(uuid) {
      let self = this;
      for (const i in self.objs) {
        if (self.objs[i].uuid === uuid) {
          self.scene.remove(self.objs[i]);
          self.objs.splice(i, 1);
          console.log("delete:", uuid);
        }
      }
    },
    initGrid() {
      // 绘制网格 边长是1000，每个小网格的边长是50
      var helper = new this.$three.GridHelper(2000, 100, 0x000000, 0x808080);
      this.scene.add(helper);
    },
    animation: function() {
      // if (this.mesh && this.mesh.rotation) {
      //   // 加载完成才旋转
      //   // this.mesh.rotation.x += 0.01;
      //   this.mesh.rotation.y += 0.015;
      // }
      this.renderer.render(this.scene, this.camera);
      if (this.showFPS) this.stats.update();
      this.$tween.update();
      requestAnimationFrame(this.animation);
    },
    getPickedObject(obj) {
      // 通过选中模型模块 查找顶层模型
      let self = this;
      for (const i in self.objs) {
        if (self.objs[i].uuid === obj.uuid) {
          return self.objs[i];
        }
      }
      if (obj.parent && obj.parent.uuid) {
        return self.getPickedObject(obj.parent);
      }
      return undefined;
    },
    /**
     * 射线拾取函数
     * 选中的网格模型变为半透明效果
     */
    ray(event) {
      let self = this;
      if (event.button === 0) {
        // console.log("win:",this.size)
        var mouse = new self.$three.Vector2();
        var raycaster = new self.$three.Raycaster();
        //将鼠标点击位置的屏幕坐标转成threejs中的标准坐标,具体解释见代码释义
        mouse.x = (event.clientX / this.size.w) * 2 - 1;
        mouse.y = -(event.clientY / this.size.h) * 2 + 1;
        // console.log("mouse:",mouse)
        // console.log(event.clientX,event.clientY)
        raycaster.setFromCamera(mouse, self.camera);
        // console.log(mouse,self.objs)
        var intersects = raycaster.intersectObjects(self.objs, true);
        // console.log("intersects:",intersects)
        if (intersects.length > 0) {
          self.Com.pickObject = self.getPickedObject(intersects[0].object);
          console.log("pick:", self.Com.pickObject.uuid);
          // if(self.Com.pickObject) console.log("pick:", self.Com.pickObject.uuid)
          // else console.error("not find object " + intersects[0].object.uuid)
        }
      } else if (event.button === 2) {
        self.Com.pickObject = undefined;
        // console.log("clear pick");
      }
    }
  },
  mounted() {
    this.objs = [];
    this.initThree();
    this.initCamera();
    this.initScene();
    this.initLight();
    if (this.showHelper) this.initGrid();
    this.animation();
    window.addEventListener("mousedown", this.ray);
  },
  components: {
    Menu
  }
};
</script>

<style scoped>
.main {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
}
</style>
