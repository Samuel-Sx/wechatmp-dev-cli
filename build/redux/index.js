const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

const ReduxFile = path.join(__dirname, '../../node_modules/redux/dist/redux.js');
const ReduxThunkFile = path.join(__dirname, '../../node_modules/redux-thunk/dist/redux-thunk.js');
const ProjectPath = path.join(__dirname, '../../miniprogram');
/**
 * 检查文件是否存在
 * @param {string} path 需要检查的文件/目录路径
 * @return {Boolean}  boolean 该文件/目录是否存在
 */
const isset = function (path) {
  return fs.existsSync(path)
}
/**
 * 移除部分判断，使其符合小程序模块化规则
 * @param {string} filepath 源文件路径
 * @return {string} string 按照规则重写后的文件字符串
 */
const FileFormating = function (filepath) {
  if (!isset(filepath)) {
    console.error(`\nError: The file can not be found in: ${filepath}\n`)
    return '';
  }
  let fileStrStorage = fs.readFileSync(filepath).toString();
  let contentStr = fileStrStorage.replace(/typeof\s*exports\s*===\s*'object'\s*\&\&\s*/, '');
  return contentStr;
}
/**
 * 将文件写入至小程序项目目录
 * 默认仅执行验证目录是否存在操作，如果不存在，仅创建目录
 * 返回一个匿名函数，接收(文件名, 内容)两个参数，调用返回函数执行写入文件操作
 * @param {string} dirpath 新文件保存路径
 * @return {function(string, string) => void} function 正式写入文件操作
 * @param {string} filename 写入文件名 'test.js'
 * @param {string} content 文件内容
 */
const CopyToLibs = function (dirpath) {
  if (!isset(dirpath)) {
    child_process.execSync(`cd ${ProjectPath} && mkdir libs`)
  }
  return function (filename, content) {
    if (!isset(`${dirpath}/${filename}`)) {
      fs.writeFileSync(`${dirpath}/${filename}`, content)
    }
  }
}

const inject = function () {
  let redux = FileFormating(ReduxFile);
  let reduxThunk = FileFormating(ReduxThunkFile);
  if (redux && reduxThunk) {
    let dirpath = process.platform === 'win32' ? ProjectPath + '\libs' : ProjectPath + '/libs'
    CopyToLibs(dirpath)(`redux.js`, redux);
    CopyToLibs(dirpath)(`redux-thunk.js`, reduxThunk);
  }
}
module.exports = inject;