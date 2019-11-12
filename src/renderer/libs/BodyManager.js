/**
 * 物体管理器
 * Author: Bl.Chock
 * create: 2019年11月12日 15:41:53
 * update: 2019年11月12日 15:41:53
 * usage: 
 */
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
class BodyManager {
  constructor() {
    this.objs = []
  }
  getBodys() {
    return this.objs
  }
  initObjectPhysic(obj) {
    //计算模型尺寸
    var box = new THREE.Box3();
    box.expandByObject(obj);
    var helper = new THREE.Box3Helper(box, 0xffff00); // 显示网格
    sc.scene.add(helper); // updateMatrixWorld
    // var length = box.max.x - box.min.x;
    // var width = box.max.z - box.min.z;
    // var height = box.max.y - box.min.y;
    // var box = new THREE.Box3();
  }
  create(path, func) {
    let self = this;
    if (sc.loading) return;
    var loader = new GLTFLoader();
    loader.load(
      path,
      function (gltf) {
        // let obj = self.initObject(gltf.scene);
        let obj = gltf.scene;
        sc.scene.add(obj);
        self.initObjectPhysic(obj);
        self.objs.push(obj);
        if (func) func(obj);
        sc.showLoading(false);
        console.log("add:", obj.uuid);
        console.log("obj:", gltf);
      },
      undefined,
      function (error) {
        console.error(error);
        sc.showLoading(false);
        if (func) func(-1); // 您导入了一个错误的gltf模型文件！出错原因请看控制台
      }
    );
  }
  remove(uuid) {
    let self = this;
    for (const i in self.objs) {
      if (self.objs[i].uuid === uuid) {
        sc.scene.remove(self.objs[i]);
        self.objs.splice(i, 1);
        console.log("delete:", uuid);
      }
    }
  }
  getParent(obj) {
    // 通过选中模型模块 查找顶层模型
    let self = this;
    for (const i in self.objs) {
      if (self.objs[i].uuid === obj.uuid) {
        return self.objs[i];
      }
    }
    if (obj.parent && obj.parent.uuid) {
      return self.getParent(obj.parent);
    }
    return undefined;
  }
}

export default BodyManager