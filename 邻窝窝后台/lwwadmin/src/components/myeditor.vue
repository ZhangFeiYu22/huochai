<template>
  <div class="publish-box">
    <!-- 富文本 -->
    <div class="publish-box-wrap">
      <div class="publish-toolbar" id="publishToolbar">
        <div
          class="tooltip"
          title="撤销"
          :class="[toolStates.undo == 1 ? 'tool-bar-selected' : '', toolStates.undo == -1 ? 'tool-bar-disabled' : '' ]"
        >
          <i class="public-icon icon-701bianjiqi_chexiao" @click="execCommand('undo')"></i>
        </div>

        <div
          class="tooltip"
          title="标题"
          :class="[toolStates.Paragraph == 1 ? 'tool-bar-selected' : '', toolStates.Paragraph == -1 ? 'tool-bar-disabled' : '' ]"
        >
          <i class="public-icon icon-725bianjiqi_biaoti" @click="execCommand('Paragraph')"></i>
        </div>

        <div
          class="tooltip"
          title="加粗"
          :class="[toolStates.bold == 1 ? 'tool-bar-selected' : '', toolStates.bold == -1 ? 'tool-bar-disabled' : '' ]"
        >
          <i class="public-icon icon-bold" @click="execCommand('bold')"></i>
        </div>

        <div
          class="tooltip"
          title="清空"
          :class="[toolStates.cleardoc == 1 ? 'tool-bar-selected' : '', toolStates.bold == -1 ? 'tool-bar-disabled' : '' ]"
        >
          <i class="public-icon icon-721bianjiqi_qingkongwendang" @click="execCommand('cleardoc')"></i>
        </div>

        <div
          class="tooltip"
          title="无序列表"
          :class="[toolStates.insertunorderedlist == 1 ? 'tool-bar-selected' : '', toolStates.insertunorderedlist == -1 ? 'tool-bar-disabled' : '' ]"
        >
          <i
            class="public-icon icon-719bianjiqi_wuxuliebiao"
            @click="execCommand('insertunorderedlist')"
          ></i>
        </div>

        <div
          class="tooltip"
          title="有序列表"
          :class="[toolStates.insertorderedlist == 1 ? 'tool-bar-selected' : '', toolStates.insertorderedlist == -1 ? 'tool-bar-disabled' : '' ]"
        >
          <i
            class="public-icon icon-718bianjiqi_youxuliebiao"
            @click="execCommand('insertorderedlist','decimal')"
          ></i>
        </div>

        <div
          class="tooltip"
          title="插入图片"
          :class="[toolStates.insertImage == 1 ? 'tool-bar-selected' : '', toolStates.insertImage == -1 ? 'tool-bar-disabled' : '' ]"
        >
          <i class="public-icon icon-745bianjiqi_tupianshangchuan" @click="imgUpload"></i>
        </div>

        <div
          class="tooltip"
          title="插入视频"
          :class="[toolStates.insertvideo == 1 ? 'tool-bar-selected' : '', toolStates.insertvideo == -1 ? 'tool-bar-disabled' : '' ]"
        >
          <i class="public-icon icon-748bianjiqi_shipin" @click="videoUpload"></i>
        </div>
      </div>
      <div ref="editor"></div>
    </div>

    <!-- 图片上传 -->
    <el-dialog title="上传图片" :visible.sync="dialogImageVisible" width="40%">
      <div class="view-content">
        <div class="clearfix">
          <div class="view-list" v-for="(item, index) in filepath" :key="index">
            <span class="cancel-btn" @click="delImg(index)">x</span>
            <img :src="item" />
          </div>
          <div class="addbox">
            <input type="file" @change="getImage" ref="fileImage" />
            <div class="addbtn">+</div>
          </div>
        </div>
        <span class="tips">{{warnText}}</span>
      </div>
      <div slot="footer">
        <el-button type="primary" @click="insertImages">确 定</el-button>
        <el-button @click="dialogImageVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 视频上传 -->
    <el-dialog
      title="上传视频"
      :visible.sync="dialogVideoVisible"
      width="40%"
      v-model="dialogVideoVisible"
    >
      <div class="view-content">
        <div class="clearfix" v-loading="loading">
          <div class="view-list" v-for="(item, index) in videopath" :key="index">
            <span class="cancel-btn" @click="delVideo(index)">x</span>
            <video :src="item" width="100" height="100"></video>
          </div>
          <div class="addbox">
            <input type="file" @change="getVideo" ref="fileVideo" />
            <div class="addbtn">+</div>
          </div>
        </div>
        <span class="tips">{{warnInfo}}</span>
      </div>
      <div slot="footer">
        <el-button type="primary" @click="insertVideos">确 定</el-button>
        <el-button @click="dialogVideoVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import axios from "axios";
import "../../static/neditor/neditor.config.js";
import "../../static/neditor/neditor.all.js";
import "../../static/neditor/i18n/zh-cn/zh-cn.js";
import "../assets/fonts/iconfont.css"; // 富文本编辑器的图标
// 手动引入codemirror.js ZeroClipboard.js--解决ZeroClipboard is not defined的问题
import "../../static/neditor/third-party/codemirror/codemirror"
import "../../static/neditor/third-party/zeroclipboard/ZeroClipboard"
export default {
  props: ["content"],
  data () {
    return {
      id: Math.random(10) + "ueditorId",
      url: `${process.env.BASE_API}/file/upload-static`,
      config: {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      },
      filepath: [],
      videopath: [],
      warnText: "支持绝大多数图片格式，单张图片最大支持3MB",
      warnInfo: "暂时只支持Mp4格式的视频",
      loading: false,
      dialogImageVisible: false,
      dialogVideoVisible: false,
      publishModal: {
        content: this.content,
        images: [],
        videos: []
      },
      // 工具烂的状态
      toolStates: {
        bold: 0,
        cleardoc: 0,
        Paragraph: 0,
        insertImage: 0,
        insertvideo: 0,
        insertunorderedlist: 0,
        insertorderedlist: 0,
        undo: 0,
        removeFormate: 0
      },
      // 编辑器的初始化
      config: {
        toolbars: [[]],
        initialFrameWidth: null,
        initialFrameHeight: 400
      }
    };
  },
  watch: {
    content: function (val, oldVal) {
      //  一
      // this.publishModal.content = val
      // if (val != null && this.publishModal.content) {
      //   this.editor = UE.getEditor(this.id, this.config);
      //   this.editor.setContent(val);
      // }

      //  二
      // this.editor = UE.getEditor(this.id, this.config);
      // if (val != null) {
      //   this.editor.setContent(val);
      // }

      //  三
      this.editor.setContent(val);
      
    }
  },
  created () {
    // if (window.addEventListener) {
    //   window.addEventListener("scroll", self.toolbarScroll, false);
    // } else if (window.attachEvent) {
    //   window.attachEvent("onscroll", self.toolbarScroll);
    // } else {
    //   window["onscroll"] = self.toolbarScroll;
    // }
    this.$nextTick(() => {
      this.$refs.editor.id = this.id;
      this.editor = UE.getEditor(this.id, this.config);
      let timer = setInterval(() => {
        if (this.content) {
          this.editor.setContent(this.content);
          clearInterval(timer);
        }
      }, 200);
      this.editor.addListener("contentChange", () => {
        const wordCount = this.editor.getContentLength(true);
        this.publishModal.content = this.editor.getContent();
        const plainTxt = this.editor.getPlainTxt();
        this.$emit("getContent", this.editor.getContent());
      });
      this.editor.addListener("selectionchange", () => {
        const stateList = Object.keys(this.toolStates);
        let i = -1;
        while (i++ < stateList.length - 1) {
          this.toolStates[stateList[i]] = this.editor.queryCommandState(
            stateList[i]
          );
          if (stateList[i] === "Paragraph") {
            if (this.editor.queryCommandValue(stateList[i]) == "h2") {
              this.toolStates[stateList[i]] = 1;
            } else {
              this.toolStates[stateList[i]] = 0;
            }
          }
        }
      });
    });
  },
  methods: {
    // toolbarScroll() {
    //   let IO = document.getElementById("publishToolbar"),
    //     Y = IO,
    //     H = 0;
    //   if (IO) {
    //     while (Y) {
    //       H += Y.offsetTop;
    //       Y = Y.offsetParent;
    //     }
    //     const s = Math.max(
    //       document.documentElement.scrollTop,
    //       document.body.scrollTop
    //     );
    //     if (s > 230 && s < 780) {
    //       IO.style.cssText = "top:0px;position:fixed;";
    //     } else {
    //       IO.style.cssText = "";
    //     }
    //   }
    // },
    execCommand (name, state) {
      if (name == "Paragraph") {
        this.toolStates.Paragraph
          ? this.editor.execCommand("Paragraph", "p")
          : this.editor.execCommand("Paragraph", "h2");
      } else {
        this.editor.execCommand(name, state);
      }
    },
    // 图片上传展示
    imgUpload () {
      this.dialogImageVisible = true;
      this.filepath = []; //清除上次上传图片显示
    },
    // 显示图片
    getImage (e) {
      if (/jpeg|jpg|gif|png$/.test(e.target.files[0].type)) {
        this.warnText = "支持绝大多数图片格式，单张图片最大支持3MB";
        var file = e.target.files[0]
        let formData = new FormData();
        formData.append('id', file);
        formData.append('name', file.name);
        formData.append('type', file.type);
        formData.append('lastModifiedDate', file.lastModified);
        formData.append('size', file.size);
        formData.append('file', file);
        this.$axios.post('/file/upload-static', formData, this.config).then(res => {
          console.log('tupian----', res)
          this.filepath.push(process.env.BASE_API + res.data.result);
        });
        this.$refs.fileImage.value = null;
      } else {
        this.warnText = "请选择正确的图片格式";
        this.$refs.fileImage.value = null;
      }
    },
    // 插入图片
    insertImages () {
      let imageHtml = "";
      for (let i in this.filepath) {
        imageHtml +=
          '<p class="insertImg"><img src="' +
          this.filepath[i] +
          '" data-src="' +
          this.filepath[i] +
          '"></p>';
        this.publishModal.images.push(this.filepath[i]);
      }
      this.editor.execCommand("inserthtml", imageHtml);
      this.dialogImageVisible = false;
    },
    // 删除图片
    delImg (index) {
      this.filepath.splice(index, 1);
      this.warnText = "支持绝大多数图片格式，单张图片最大支持3MB";
    },
    // 视频上传展示
    videoUpload () {
      this.dialogVideoVisible = true;
      this.videopath = []; //清除上次上传视频显示
    },
    // 显示视频
    getVideo (e) {
      if (e.target.files[0].type == "video/mp4") {
        this.warnInfo = "视频上传较慢，请耐心等待";
        this.loading = true;
        var file = e.target.files[0]
        let formData = new FormData();
        formData.append('id', file);
        formData.append('name', file.name);
        formData.append('type', file.type);
        formData.append('lastModifiedDate', file.lastModified);
        formData.append('size', file.size);
        formData.append('file', file);
        this.$axios.post(`/file/upload-static`, formData, this.config).then(res => {
          this.videopath.push(process.env.BASE_API + res.data.result);
          this.warnInfo = "视频上传完成";
          this.loading = false;
        });
        this.$refs.fileVideo.value = null;
      } else {
        this.warnInfo = "请选择正确的视频格式";
        this.$refs.fileVideo.value = null;
      }
    },
    // 插入视频
    insertVideos () {
      let videoHtml = "";
      for (let i in this.videopath) {
        videoHtml +=
          '<p><video width="100%" height="100%" src="' +
          this.videopath[i] +
          '" data-src="' +
          this.videopath[i] +
          '"></video></p>';
        this.publishModal.videos.push(this.videopath[i]);
      }
      this.editor.execCommand("inserthtml", videoHtml);
      this.dialogVideoVisible = false;
    },
    // 删除视频
    delVideo (index) {
      this.videopath.splice(index, 1);
      this.warnInfo = "暂时只支持Mp4格式的视频";
    }
  }
};
</script>
<style lang="scss">
/* 隐藏字数提示 */
.publish-box .edui-editor-toolbarbox,
.publish-box .edui-default .edui-editor,
.publish-box .edui-editor-bottomContainer {
  display: none;
}

/* 富文本 */
.publish-box {
  width: 80%;
  .publish-box-wrap {
    position: relative;
    border: 1px solid #e9e9e9;
  }
}
.edui-editor {
  height: 400px;
  overflow-y: auto;
}
// 富文本按钮
.publish-toolbar {
  width: 100%;
  padding: 5px 0;
  border-bottom: 1px solid #e9e9e9;
  background: #eee;
  .tooltip {
    display: inline-block;
    height: 30px;
  }
  .public-icon {
    display: inline-block;
    height: 30px;
    width: 36px;
    line-height: 30px;
    text-align: center;
    vertical-align: top;
    color: #999;
    /* 字体抗锯齿 */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-family: "iconfont" !important;
    font-size: 20px;
    font-style: normal;
    cursor: pointer;
    &:hover {
      background: rgba(0, 0, 0, 0.2);
    }
  }
  // 选中的时的颜色
  .tool-bar-selected {
    height: 30px;
    background: rgba(255, 255, 255, 0.8);
  }
  // 禁用时的颜色
  .tool-bar-disabled .public-icon {
    color: #ccc;
  }
  // 颜色选择器
  .el-color-picker {
    position: relative;
    top: 7px;
  }
}

/* 上传 */
.el-dialog__wrapper .view-content {
  position: relative;
  width: 100%;
  min-height: 320px;
  max-height: 400px;
  padding: 15px;
  text-align: center;
  border: 2px dashed #b5b5b5;
  overflow: auto;
  .tips {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
  }
}

.view-list {
  position: relative;
  float: left;
  height: 100px;
  width: 100px;
  margin: 10px 10px 0 0;
  img {
    width: 100%;
    height: 100%;
  }
  .cancel-btn {
    position: absolute;
    right: -5px;
    top: -5px;
    z-index: 99999;
    display: block;
    width: 20px;
    height: 20px;
    color: #fff;
    line-height: 18px;
    text-align: center;
    background: #c40000;
    border-radius: 50%;
    cursor: pointer;
  }
}

.addbox {
  float: left;
  position: relative;
  height: 100px;
  width: 100px;
  margin-top: 10px;
  text-align: center;
  input {
    position: absolute;
    left: 0;
    height: 100px;
    width: 100px;
    opacity: 0;
  }
  .addbtn {
    float: left;
    height: 100px;
    width: 100px;
    line-height: 95px;
    color: #00b38a;
    font-size: 40px;
    background: #f2f2f2;
    border-radius: 10px;
  }
}
.insertImg {
  width: 200px;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>