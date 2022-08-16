# klee-helper README

## Requirements

LLVM、KLEE、clang、grpc(for python)

## Extension Settings

* `klee-helper.kleePath`
* `klee-helper.clangPath`

![自定义KLEE、clang安装路径](https://foruda.gitee.com/images/1660157531758584404/extension-settings-for--klee-helper.png)


## Usage

![演示视频](https://pic.imgdb.cn/item/62f49c6816f2c2beb13e2c96.gif)

启动服务器：grpc文件夹下使用python server.py

插件使用：新建C/C++源码，于控制台（ctrl + shift + p）输入KLEE helper: generate test cases（热键：ctlr + alt + k）调用klee生成测试样例；
KLEE helper: show one test case（热键：ctlr + alt + l），在文本框输入需要的序号，展示对应样例。

## Todo

- 🔸展示单个样例的弹窗显示改成整个窗口或者新文件
- 如果多个文件共同编译，server里的写死了怎么搞，需要扩展吗
- klee自个的提示信息就挺好的，但是都打印到服务器里了，截取点也发过去？
- 小问题，固定输入六位序号改一下，前面0不够自动加
- 小问题，如果uri获取失败会因为获得null弹窗报错，但==Untitled-x==不会，而是到了server开始编译发现没有，怎么解决
  （由于返回的样例个数是通过对klee-last中文件计数得到，不一定和当此请求对应。但是又不知道该什么时候可以清空，可以新增个kleeClear命令）

## Release Notes

### v0.0.1

满足基本使用
