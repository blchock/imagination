<template>
  <div class="main">
    <div class="main" ref="canvas">
      <div class="main" ref="ui" v-if="showUI">
        <Menu />
      </div>
    </div>
  </div>
</template>


<script>
import Menu from "./menu.vue";
import SceneManager from "../libs/SceneManager"
export default {
  name: "Scene",
  data() {
    return {
      showUI: true
    };
  },
  methods: {
  },
  mounted() {
    new SceneManager(this, "canvas", true, false);
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
