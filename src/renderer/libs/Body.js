/**
 * 物体
 * Author: Bl.Chock
 * create: 2019年11月12日 15:41:53
 * update: 2019年11月12日 15:41:53
 * usage: 
 */
class Body { //  extends Body
  constructor() {
    this.lockPick = false // 是否能选中该物体
  }
  init() {
    // 初始化物体 override
  }
  initPhysic() {
    // 初始化刚体 override
  }
  remove() {
    // 析构函数 override
  }
  setVisible(visible) { // 设置可见
    if(this.entity) this.entity.visible = visible;
  }
  setPo(x,y,z) { // 设置位置
    if(this.entity && this.entity.position) this.entity.position.set(x,y,z);
  }
  setScale(x,y,z) { // 设置缩放
    if(this.entity && this.entity.scale) this.entity.scale.set(x,y,z);
  }
  linkage() { // 联动:身体跟上灵魂的步伐
    if(this.entity && this.soul) {
      if(this.entity.position && this.soul.position) this.entity.position.copy(this.soul.position);
      if(this.entity.quaternion && this.soul.quaternion) this.entity.quaternion.copy(this.soul.quaternion);
      if(this.entity.scale && this.soul.scale) this.entity.scale.copy(this.soul.scale);
    }
  }
  contact(one, option) { // 关联材质摩擦
    var con = new CANNON.ContactMaterial(this.material, one.material, option);
    this.contacts.push(con);
    sc.world.addContactMaterial(con);
  }
}

export default Body