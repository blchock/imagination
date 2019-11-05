<template>
  <div id="app">
    <scene />
  </div>
</template>

<script>
import scene from "./components/scene.vue";
export default {
  name: "imagination",
  data() {
    return {};
  },
  components: {
    scene
  }
};
</script>

<style>
/* CSS */
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: absolute;
  left: 0;
  right: 3px;
  top: 0;
  bottom: 3px;
  -moz-user-select: none; /*火狐*/
  -webkit-user-select: none; /*webkit浏览器*/
  -ms-user-select: none; /*IE10*/
  -khtml-user-select: none; /*早期浏览器*/
  user-select: none;
}
ul,li{
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
