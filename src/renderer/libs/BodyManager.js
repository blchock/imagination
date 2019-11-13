/**
 * 物体管理器
 * Author: Bl.Chock
 * create: 2019年11月12日 15:41:53
 * update: 2019年11月12日 15:41:53
 * usage: 
 */
import Obj from "./Obj"
import Terrain from "./Terrain"
class BodyManager {
  constructor() {
    this.bodys = [] // 物体集合
    this.entitys = [] // 实体集合（物体实际的本体）
    this.souls = [] // 刚体集合
  }
  getBodys = () => this.bodys;
  getEntitys = () => this.entitys;
  getSouls = () => this.souls;
  create(type, data, func) {
    let self = this;
    let body = null
    if (type === "obj") { // 创建物体
      body = new Obj(data);
    } else if (type === "terrain") { // 创建地面
      body = new Terrain(data);
    }
    body.init(entity => {
      let soul = body.initPhysic();
      self.bodys.push(body);
      self.entitys.push(entity);
      self.souls.push(soul);
      if (func) func(body);
    });
  }
  remove(id) {
    let self = this;
    for (const i in self.bodys) {
      if (self.bodys[i].id === id) {
        self.bodys[i].remove();
        self.bodys.splice(i, 1);
        self.entitys.splice(i, 1);
        self.souls.splice(i, 1);
        console.log("delete:", id);
      }
    }
  }
  getParent(entity) {
    // 通过选中模型实体 查找顶层模型对象
    let self = this;
    for (const i in self.bodys) {
      if (self.bodys[i].id === entity.uuid) {
        return self.bodys[i];
      }
    }
    if (entity.parent && entity.parent.uuid) {
      return self.getParent(entity.parent);
    }
    return undefined;
  }
}

export default BodyManager

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