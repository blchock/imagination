/**
 * 物件
 * Author: Bl.Chock
 * create: 2019年11月13日 10:31:09
 * update: 2019年11月13日 10:31:09
 * usage: 
 */
import Body from "./Body"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
class Obj extends Body {
  constructor(data) {
    super();
    this.data = data
    this.id = null // 物体id（唯一的uuid）
    this.entity = null // 物体实体（包含网格，材质，贴图，节点集合）
    this.soul = null // 物体刚体
    this.helper = null // 物体包围盒
  }
  init(func) {
    if (sc.loading) return;
    let self = this
    var loader = new GLTFLoader();
    loader.load(
      self.data,
      function (gltf) {
        // let obj = self.initObject(gltf.scene);
        let obj = gltf.scene;
        sc.scene.add(obj);
        self.entity = obj
        self.id = self.entity.uuid
        self.entity.userData.body = self // 关联自身对象
        if (func) func(obj);
        sc.showLoading(false);
        console.log("add:", self.id);
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
  initPhysic() {
    //计算模型尺寸
    var box = new THREE.Box3();
    box.expandByObject(this.entity);
    var helper = new THREE.Box3Helper(box, 0xffff00); // 显示网格
    sc.scene.add(helper); // updateMatrixWorld
    this.helper = helper;
    return helper;
    // var length = box.max.x - box.min.x;
    // var width = box.max.z - box.min.z;
    // var height = box.max.y - box.min.y;
    // var box = new THREE.Box3();
  }
  remove() {
    if(this.entity) sc.scene.remove(this.entity);
    // if(this.soul) sc.scene.remove(this.soul);
    if(this.helper) sc.scene.remove(this.helper);
  }
}

export default Obj