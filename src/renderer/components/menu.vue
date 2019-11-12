<template>
  <div class="main">
    <span class="title">幻想位面</span>
    <ul class="menu">
      <li>
        <el-button v-show="!isEditing" size="mini" @click="isEditing=true">时间静止</el-button>
      </li>
      <li>
        <el-button v-show="isEditing" size="mini" @click="isEditing=false">恢复时间</el-button>
      </li>
      <li>
        <el-button v-show="isEditing" size="mini" @click="onImportBtn">导入角色</el-button>
      </li>
      <li>
        <el-button v-show="isEditing" size="mini">赋予生命</el-button>
      </li>
      <li>
        <el-button v-show="isEditing" size="mini" @click="onDeleteBtn">删除角色</el-button>
      </li>
      <li>
        <el-button size="mini" @click="onQuitBtn">退出系统</el-button>
      </li>
    </ul>
  </div>
</template>


<script>
const { ipcRenderer } = require("electron");
const { dialog } = require("electron").remote;
const exec = require("child_process").exec;
const path = require("path");
export default {
  name: "Menu",
  data() {
    return {
      isEditing: false
    };
  },
  methods: {
    onQuitBtn() {
      this.$confirm("您将退出本位面, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        ipcRenderer.send("close");
      });
    },
    runExec(cmdStr, callback) {
      // 执行命令行，如果命令不需要路径，或就是项目根目录，则不需要cwd参数：
      let workerProcess = exec(cmdStr);
      // 不受child_process默认的缓冲区大小的使用方法，没参数也要写上{}：workerProcess = exec(cmdStr, {})
      // 打印正常的后台可执行程序输出
      workerProcess.stdout.on("data", function(data) {
        console.log("stdout: " + data);
      });
      // 打印错误的后台可执行程序输出
      workerProcess.stderr.on("data", function(data) {
        console.log("stderr: " + data);
      });
      // 退出之后的输出
      workerProcess.on("close", function(code) {
        if (callback) callback(code);
      });
    },
    onImportBtn() {
      let self = this;
      let ret = dialog.showOpenDialog({
        title: "选择一个模型文件(角色)",
        filters: [{ name: "gltf/fbx模型文件", extensions: ["gltf", "fbx"] }],
        properties: ["openFile"]
      }); //可默认打开文件
      if (ret && ret.length === 1) {
        self.$emit("loading", true);
        let file = ret[0];
        self.Com.rootPath =
          self.Com.rootPath ||
          path.normalize(
            process.execPath.slice(
              0,
              process.execPath.lastIndexOf("node_modules")
            )
          );
        let toolPath = path.join(
          self.Com.rootPath,
          "static/system/FBX2glTF-windows-x64.exe"
        );
        let name = path.basename(file, ".fbx");
        let outDir = `static/${name}_out/${name}.gltf`;
        if (path.extname(file) === ".fbx") {
          self.runExec(`${toolPath} ${file} -o ./static/${name}`, ret_code => {
            if (ret_code !== 0) {
              self.$notify.error({
                title: "失败",
                message: "转换fbx文件失败！"
              });
              self.$emit("loading", false);
              return;
            }
            self.$emit("loadObj", outDir, obj => {
              obj.position.set(0, 10, 0);
              obj.scale.set(30, 30, 30);
            });
          });
        } else {
          let outDir = path
            .relative(self.Com.rootPath, file)
            .replace(/\\/g, "/");
          self.$emit("loadObj", outDir, obj => {
            obj.position.set(0, 0, 0);
            // obj.scale.set(30, 30, 30);
          });
        }
      }
    },
    onDeleteBtn() {
      let self = this;
      if (self.Com.pickObject) {
        self
          .$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(() => {
            console.log(self.Com.pickObject.uuid,self.Com.pickObject)
            self.$emit("delObj", self.Com.pickObject.uuid);
          });
      } else {
        self.$message({
          message: "您还未选取角色对象！",
          type: "warning"
        });
      }
    }
  },
  mounted() {},
  components: {}
};
</script>

<style scoped>
.main {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
}
.title {
  position: absolute;
  top: 10px;
  right: 12px;
  font-size: 20px;
  font-weight: bold;
}
.menu {
  position: absolute;
  top: 40px;
  right: 12px;
}
li {
  margin-top: 3px;
}
</style>
