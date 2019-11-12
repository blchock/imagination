/**
 * 场景管理器
 * Author: Bl.Chock
 * create: 2019年11月12日 14:20:05
 * update: 2019年11月12日 14:20:05
 * usage: new SceneManager(dom,'canvas',true,true)
 * sc.showLoading(true)
 */
import * as THREE from "three";
import * as Stats from "Stats";
import TWEEN from "@tweenjs/tween.js";
import BodyManager from "./BodyManager";
import "three-orbitcontrols";
import { Loading } from "element-ui";
const path = require("path");
class SceneManager { //  extends Base
  // 创建时参数：场景节点，显示FPS，显示参考线
  constructor(view, name, showFPS, showHelper) {
    window.sc = this;
    window.THREE = THREE;
    window.CANNON = require("cannon");
    this.view = view;
    this.name = name;
    this.showFPS = showFPS
    this.showHelper = showHelper
    this.camera = null
    this.scene = null
    this.renderer = null
    this.oc = null
    this.clock = null
    this.world = null
    this.stats = null
    this.size = null
    this.loading = null
    this.pickObject = null // 选中的物体
    this.rootPath = path.normalize(process.execPath.slice(0,process.execPath.lastIndexOf("node_modules"))); // 主目录
    this.initEngine();
    this.initCamera();
    this.initScene();
    this.initLight();
    this.Bodym = new BodyManager();
    if (this.showHelper) this.initGrid();
    this.initOperation();
    this.initPhysic();
    this.animation();
    this.initObject();
  }
  dom() {
    return this.view.$refs[this.name]
  }
  initEngine() {
    this.size = { w: this.dom().clientWidth, h: this.dom().clientHeight };
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.size.w, this.size.h);
    this.dom().appendChild(this.renderer.domElement);
    this.renderer.setClearColor(0xffffff, 1.0);
    if (this.showFPS) {
      this.stats = new Stats();
      this.dom().appendChild(this.stats.domElement);
    }
    this.clock = new THREE.Clock();
  }
  render() {
    sc.renderer.render(sc.scene, sc.camera);
  }
  onWindowResize() { //窗口变动触发的函数
    sc.size = { w: sc.dom().clientWidth, h: sc.dom().clientHeight };
    sc.camera.aspect = sc.size.w / sc.size.h;
    sc.camera.updateProjectionMatrix();
    sc.render();
    sc.renderer.setSize(sc.size.w, sc.size.h);
  }
  initCamera() {
    this.camera = new THREE.PerspectiveCamera(70, this.size.w / this.size.h, 1, 10000);
    this.camera.position.set(50, 30, 50);
    this.camera.up.set(0, 1, 0);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    window.onresize = this.onWindowResize;
  }
  initScene() {
    this.scene = new THREE.Scene();
  }
  initPhysic() {
    let world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);
    world.broadphase = new CANNON.NaiveBroadphase(); // Broadphase
    this.world = world;
  }
  initLight() {
    let light = new THREE.DirectionalLight(0xffffff); // 方向光/平行光/太阳光
    light.position.set(20, 40, -15);
    light.target.position.copy(this.scene.position);
    light.castShadow = true;
    light.shadowCameraLeft = -60;
    light.shadowCameraTop = -60;
    light.shadowCameraRight = 60;
    light.shadowCameraBottom = 60;
    light.shadowCameraNear = 20;
    light.shadowCameraFar = 200;
    light.shadowBias = -0.0001;
    light.shadowMapWidth = light.shadowMapHeight = 2048;
    light.shadowDarkness = 0.7;
    this.scene.add(light);
    var lightEnv = new THREE.AmbientLight(0xffffff, 0.2); // 环境光
    lightEnv.position.set(100, 100, 200);
    this.scene.add(lightEnv);
  }
  initGrid() {
    // 绘制网格 边长是1000，每个小网格的边长是50
    var helper = new THREE.GridHelper(2000, 100, 0x000000, 0x808080);
    this.scene.add(helper);
  }
  animation() {
    let delta = sc.clock.getDelta();
    sc.oc.update(delta);
    sc.render();
    if (sc.showFPS) sc.stats.update();
    TWEEN.update();
    sc.world.step(1 / 60);
    if (sc.sphere) {
      sc.sphere.position.copy(sc.sphereBody.position);
      sc.sphere.quaternion.copy(sc.sphereBody.quaternion);
    }
    requestAnimationFrame(sc.animation);
  }
  showLoading(isShow) {
    if (isShow) {
      if (!self.loading)
        self.loading = Loading.service({
          fullscreen: true,
          background: "#00000066"
        });
    } else {
      if (self.loading) {
        self.loading.close();
        self.loading = null;
      }
    }
  }
  /**
   * 射线拾取函数
   * 选中的网格模型变为半透明效果
   */
  ray(event) {
    let self = sc;
    if (event.button === 0) {
      // console.log("win:",this.size)
      var mouse = new THREE.Vector2();
      var raycaster = new THREE.Raycaster();
      //将鼠标点击位置的屏幕坐标转成threejs中的标准坐标,具体解释见代码释义
      mouse.x = (event.clientX / sc.size.w) * 2 - 1;
      mouse.y = -(event.clientY / sc.size.h) * 2 + 1;
      // console.log("mouse:",mouse)
      // console.log(event.clientX,event.clientY)
      raycaster.setFromCamera(mouse, self.camera);
      var intersects = raycaster.intersectObjects(self.Bodym.getBodys(), true);
      // console.log("intersects:",intersects)
      if (intersects.length > 0) {
        sc.pickObject = self.Bodym.getParent(intersects[0].object);
        console.log("pick:", sc.pickObject.uuid);
      }
    } else if (event.button === 2) {
      sc.pickObject = undefined;
      // console.log("clear pick");
    }
  }
  initOperation() {
    this.dom().addEventListener("mousedown", this.ray);
    let controls = new THREE.OrbitControls(
      this.camera,
      this.dom()
      // this.renderer.domElement
    );
    // 如果使用animate方法时，将此函数删除
    //controls.addEventListener( 'change', render );
    // 使动画循环使用时阻尼或自转 意思是否有惯性
    controls.target = new THREE.Vector3(0, 0, 0);
    // controls.enabled = true
    // controls.enableKeys = true;
    controls.enableDamping = true;
    // //动态阻尼系数 就是鼠标拖拽旋转灵敏度
    controls.dampingFactor = 0.25;
    //是否自动旋转
    controls.autoRotate = false;
    controls.autoRotateSpeed = 1.0;
    controls.keys = {
      LEFT: 65, //left arrow
      UP: 87, // up arrow
      RIGHT: 68, // right arrow
      BOTTOM: 83 // down arrow
    };
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.PAN
    };
    // //设置相机距离原点的最近距离
    // controls.minDistance = 200;
    // //设置相机距离原点的最远距离
    // controls.maxDistance = 600;
    // //是否开启右键拖拽
    controls.enablePan = true;
    this.oc = controls;
  }
  initObject() {
    //创建球形刚体
    var sphereShape = new CANNON.Sphere(1); // 形状
    var sphere_cm = new CANNON.Material(); // 材质
    var sphereBody = new CANNON.Body({
      // 刚体
      mass: 5, //质量
      position: new CANNON.Vec3(0, 10, 0), // 位置
      shape: sphereShape,
      material: sphere_cm
    });

    this.world.add(sphereBody);
    // 平面 Body
    var groundShape = new CANNON.Plane(); // 形状
    var ground_cm = new CANNON.Material(); // 材质
    var groundBody = new CANNON.Body({
      // 刚体
      mass: 0, // 质量，质量为0时为静态刚体
      shape: groundShape,
      material: ground_cm
    });
    // setFromAxisAngle 旋转 X 轴 -90 度
    groundBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(1, 0, 0),
      -Math.PI / 2
    );

    this.world.add(groundBody);
    var sphere_ground = new CANNON.ContactMaterial(ground_cm, sphere_cm, {
      //  定义两个刚体相遇后会发生什么
      friction: 1, // 摩擦系数
      restitution: 0.4 // 恢复系数
    });
    this.world.addContactMaterial(sphere_ground); // 添加到世界中

    // 平面网格
    var groundGeometry = new THREE.PlaneGeometry(1000, 1000, 32);
    var groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x7f7f7f,
      side: THREE.DoubleSide //这个属性只知道是两面，具体的不清楚，哪位知道可以留言告知，谢谢
    });
    var ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2; // 跟随 前面的物理平面角度
    this.scene.add(ground);

    // 球网格
    var sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    var sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    this.scene.add(sphere);
    this.sphereBody = sphereBody;
    this.sphere = sphere;
  }
}

export default SceneManager














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