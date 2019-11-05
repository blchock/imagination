<template>
  <div class="main" ref="canvas">
    <div class="stats" id="canvas-frame"></div>
  </div>
</template>


<script>
export default {
  name: "test3",
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      mesh: null,
      stats: null
    };
  },
  methods: {
    createStats: function() {
      this.stats = new this.$stats();
      document
        .getElementById("canvas-frame")
        .appendChild(this.stats.domElement);
    },
    init: function() {
      let self = this;
      //initThree
      let container = this.$refs.canvas;
      this.renderer = new this.$three.WebGLRenderer({ antialias: true });
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(this.renderer.domElement);
      this.renderer.setClearColor(0xFFFFFF, 1.0);
      // 透视投影相机 类似于人眼
      this.camera = new this.$three.PerspectiveCamera(
        45, // fov 眼睛开合角度
        container.clientWidth / container.clientHeight, // aspect 实际窗口的纵横比（可视范围xy比例，广角/窄屏）
        1, // 近平面距离
        10000 // 远平面距离
      );
      this.camera.position.x = 100;
      this.camera.position.y = 300;
      this.camera.position.z = 600;
      this.camera.up.x = 0;
      this.camera.up.y = 1;
      this.camera.up.z = 0;
      this.camera.lookAt({
          x : 0,
          y : 0,
          z : 0
      });
      // 正投影相机 无论远近物体都一样大
      // this.camera = new this.$three.OrthographicCamera(
      //   container.clientWidth / -2,
      //   container.clientWidth / 2,
      //   container.clientHeight / 2,
      //   container.clientHeight / -2,
      //   0.1,
      //   100
      // );
      // initScene
      this.scene = new this.$three.Scene();
      // 环境光
      var light = new this.$three.AmbientLight(0xFF0000);
      light.position.set(100, 100, 200);
      this.scene.add(light);
      // 方向光/平行光/太阳光
      var light2 = new this.$three.DirectionalLight(0x00ff00, 1);
      light2.position.set(100, 300, 700);
      this.scene.add(light2);
      // // 点光源
      // var light3 = new this.$three.PointLight(0xFF0000);
      // light3.position.set(0, 0, 0);
      // this.scene.add(light3);
      // 设置材质
      // var material = new this.$three.MeshLambertMaterial( { color:0x880000} );  兰伯特材质
      // var image = this.$three.ImageUtils.loadTexture(url);
      // 绘制网格 边长是1000，每个小网格的边长是50
      var helper = new this.$three.GridHelper( 1000, 50, 0x0000ff, 0x808080 );
      this.scene.add( helper );
      // 加载模型
      var loader = new this.$gltf();
      loader.load(
        "static/m_bus_orange_out/m_bus_orange.gltf",
        function(gltf) {
          self.mesh = gltf.scene;
          // 设置模型初始点
          self.mesh.position.x = 0;
          self.mesh.position.y = 0;
          self.mesh.position.z = 0;
          self.scene.add(self.mesh);
        },
        undefined,
        function(error) {
          console.error(error);
        }
      );
      // const tween = new this.$tween.Tween(this.mesh.position).to( { x: -400 }, 3000 ).repeat( Infinity ).start();
      this.createStats();
    },
    animate: function() {
      requestAnimationFrame(this.animate);
      // this.mesh.rotation.x += 0.01;
      if(this.mesh && this.mesh.rotation) { // 加载完成才旋转
        this.mesh.rotation.y += 0.015;
      }
      this.renderer.render(this.scene, this.camera);
      this.stats.update();
      this.$tween.update();
    }
  },
  mounted() {
    this.init();
    this.animate();
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
.stats {
  position: absolute;
}
</style>
