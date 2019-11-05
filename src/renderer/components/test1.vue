<template>
  <div class="main" ref="canvas">
    
  </div>
</template>


<script>
export default {
  name: "test1",
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      mesh: null
    };
  },
  methods: {
    init: function() {
      let container = this.$refs.canvas
      this.camera = new this.$three.PerspectiveCamera(
        70,
        container.clientWidth / container.clientHeight,
        0.01,
        10
      );
      this.camera.position.z = 1;

      this.scene = new this.$three.Scene();

      let geometry = new this.$three.BoxGeometry(0.2, 0.2, 0.2);
      let material = new this.$three.MeshNormalMaterial();

      this.mesh = new this.$three.Mesh(geometry, material);
      this.scene.add(this.mesh);

      this.renderer = new this.$three.WebGLRenderer({ antialias: true });
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(this.renderer.domElement);
    },
    animate: function() {
      requestAnimationFrame(this.animate);
      this.mesh.rotation.x += 0.01;
      this.mesh.rotation.y += 0.02;
      this.renderer.render(this.scene, this.camera);
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
</style>
