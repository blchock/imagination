/**
 * 物体
 * Author: Bl.Chock
 * create: 2019年11月12日 15:41:53
 * update: 2019年11月12日 15:41:53
 * usage: 
 */
class Body { //  extends Body
  constructor() {

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
  setPo(x,y,z) {
    if(this.obj && this.obj.position) this.obj.position.set(x,y,z);
  }
  setScale(x,y,z) {
    if(this.obj && this.obj.scale) this.obj.scale.set(x,y,z);
  }
}

export default Body