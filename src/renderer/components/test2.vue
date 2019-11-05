<template>
  <div class="main" ref="canvas">
    <div class="stats" id="canvas-frame"></div>
  </div>
</template>


<script>
export default {
  name: "test2",
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
      let container = this.$refs.canvas;
      // 透视投影相机 类似于人眼
      this.camera = new this.$three.PerspectiveCamera(
        60, // fov 眼睛开合角度
        container.clientWidth / container.clientHeight, // aspect 实际窗口的纵横比（可视范围xy比例，广角/窄屏）
        0.1, // 近平面距离
        100 // 远平面距离
      );
      // 正投影相机 无论远近物体都一样大
      // this.camera = new this.$three.OrthographicCamera(
      //   container.clientWidth / -2,
      //   container.clientWidth / 2,
      //   container.clientHeight / 2,
      //   container.clientHeight / -2,
      //   0.1,
      //   100
      // );
      this.camera.position.z = 1;
      this.scene = new this.$three.Scene();
      let geometry = new this.$three.BoxGeometry(0.2, 0.2, 0.2);
      let material = new this.$three.MeshNormalMaterial();
      this.mesh = new this.$three.Mesh(geometry, material);
      this.scene.add(this.mesh);
      // const tween = new this.$tween.Tween(this.mesh.position).to( { x: -400 }, 3000 ).repeat( Infinity ).start();
      this.renderer = new this.$three.WebGLRenderer({ antialias: true });
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(this.renderer.domElement);
      this.createStats();
    },
    animate: function() {
      requestAnimationFrame(this.animate);
      this.mesh.rotation.x += 0.01;
      this.mesh.rotation.y += 0.02;
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
