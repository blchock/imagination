/**
 * 形状（由3D物理引擎创建的3D物体）
 * Author: Bl.Chock
 * create: 2019年11月13日 14:48:10
 * update: 2019年11月13日 14:48:10
 * usage: 
 */
import Body from "./Body"
class Shape extends Body {
  constructor(data) {
    super();
    this.data = data
    this.id = data.entity.uuid // 物体id（唯一的uuid）  || Com.genID()
    this.entity = data.entity // 物体实体（包含网格，材质，贴图，节点集合）
    this.soul = data.soul // 物体刚体
    this.material = data.material // 物体材质
    this.contacts = [] // 联系集合
  }
  init(func) {
    // self.entity.userData.body = self // 关联自身对象
    sc.scene.add(this.entity);
    if (func) func(this.entity);
  }
  initPhysic() {
    sc.world.add(this.soul);
    return this.soul;
  }
  remove() {
    if(this.entity) sc.scene.remove(this.entity);
    if(this.soul) sc.world.remove(this.soul);
    if(this.contacts.length > 0) {
      this.contacts.forEach(con => {
        sc.world.remove(con);
      });
    }
    this.contacts = []
  }
}

export default Shape