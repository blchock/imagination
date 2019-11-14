/**
 * 物体管理器
 * Author: Bl.Chock
 * create: 2019年11月12日 15:41:53
 * update: 2019年11月12日 15:41:53
 * usage: 
 */
import Obj from "./Obj"
import Shape from "./Shape"
class BodyManager {
  constructor() {
    this.bodys = [] // 物体集合
    this.entitys = [] // 实体集合（物体实际的本体）
    this.souls = [] // 刚体集合
    this.materials = [] // 材质集合
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
    } else if (type === "shape") { // 创建形状
      body = new Shape(data);
    }
    body.init(entity => {
      let soul = body.initPhysic();
      self.bodys.forEach(mat => {
        body.contact(mat,{ //  定义两个刚体相遇后会发生什么
          friction: 1, // 摩擦系数
          restitution: 0.4 // 恢复系数
        });
      });
      self.bodys.push(body);
      self.entitys.push(entity);
      self.souls.push(soul);
      self.materials.push(body.material);
      if (func) func(body);
    });
    return body
  }
  remove(id) {
    let self = this;
    for (const i in self.bodys) {
      if (self.bodys[i].id === id) {
        self.bodys[i].remove();
        self.bodys.splice(i, 1);
        self.entitys.splice(i, 1);
        self.souls.splice(i, 1);
        self.materials.splice(i, 1);
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