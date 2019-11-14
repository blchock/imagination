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
    this.material = null // 刚体材质
    this.contacts = [] // 联系集合
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
    let po = this.entity.position;
    console.log("box:",box)
    // soul
    
    // shape = new CANNON.Box(box.max);
    // mass = 1;
    // body = new CANNON.Body({
    //   mass: 1
    // });
    // body.addShape(shape);
    // body.angularVelocity.set(0,10,0);
    // body.angularDamping = 0.5;
    // world.addBody(body);
    let boxsize = new CANNON.Vec3(box.max.x / 2, box.max.y / 2, box.max.z / 2)
    console.log("CANNON box:",boxsize)
    var soulShape = new CANNON.Box(boxsize); // 形状
    this.material = new CANNON.Material(); // 材质
    this.soul = new CANNON.Body({
      mass: 1, //质量
      position: new CANNON.Vec3(po.x, po.y, po.z), // 位置
      shape: soulShape,
      material: this.material
    });
    this.soul.angularVelocity.set(0,10,0);
    this.soul.angularDamping = 0.5;
    sc.world.add(this.soul);
    return this.soul;
    // var length = box.max.x - box.min.x;
    // var width = box.max.z - box.min.z;
    // var height = box.max.y - box.min.y;
    // var box = new THREE.Box3();
  }
  remove() {
    if(this.entity) sc.scene.remove(this.entity);
    if(this.soul) sc.world.remove(this.soul);
    if(this.helper) sc.scene.remove(this.helper);
    if(this.contacts.length > 0) {
      this.contacts.forEach(con => {
        sc.world.remove(con);
      });
    }
    this.contacts = []
  }
}

export default Obj

// loadPhysicObject(obj, id) {
//   // 通过选中模型模块 查找顶层模型
//   let self = this;
//   if (obj.children.length > 0) {
//     for (const i in obj.children) {
//       self.loadPhysicObject(obj.children[i], i);
//     }
//   }
//   if (obj.material && obj.geometry) {
//     let material = Physijs.createMaterial(obj.material, 1, 0);
//     let mesh = new Physijs.BoxMesh(obj.geometry, material, 0);
//     mesh.castShadow = true;
//     mesh.receiveShadow = true;
//     self.scene.add(mesh);
//     obj.parent.children[id] = mesh;
//   }
// },
// initObject(mesh) {
//   this.loadPhysicObject(mesh, 0);
//   return mesh;
//   // obj.addEventListener("collision", function(
//   //   other_object,
//   //   relative_velocity,
//   //   relative_rotation,
//   //   contact_normal
//   // ) {
//   //   // this是当前监听的模型，other_object是与之碰撞的对象，relative_velocity是两个模型之间的速度力差，relative_rotation是两个模型旋转之间的差
//   // });
// },