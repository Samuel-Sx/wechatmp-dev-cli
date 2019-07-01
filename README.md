# wechatmp-dev-cli

#### 一个简单的小程序开发手脚架工具

> 使用方法

>+ 安装微信开发者工具(RC 开发版)

>+ windows 系统需要在 `autoBuildConfig.json` 文件中填写开发者工具安装路径 (注意：开发者工具安装路径中不能存在空格，否则部分功能将无法使用)

>+ 打开开发者工具，登录并开启服务端口  `(服务端口位置：设置 -> 安全设置 -> 安全)`

>+ 将小程序代码放入 `miniprogram` 目录下

>+ 在根目录运行 `npm start`

>+ 可以使用 `npm run commit` 提交

##### `暂不支持cmd运行`

> 已支持

- `npm start` 运行开发工具时，自动检测并构建npm依赖包

- `npm run upload` 上传项目

- 使用less编写样式文件，实时编译为.wxss样式文件

- autoprefixer

- 标准化的commit message提交



> 持续补充其他功能
