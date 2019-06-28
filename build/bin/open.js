const path = require('path');
const fs = require('fs');
const child_process = require('child_process');
const { runCliCommand } = require('../utils')


const buildpath = path.join(__dirname, '../../');
const rootpath = path.join(__dirname, '../../miniprogram/');
const packageConfig = rootpath + 'package.json';
const moduleDir = rootpath + 'node_modules';
const buildedDir = rootpath + 'miniprogram_npm';

let opened, downloaded = false;
let packages = null;




/** 判断是否存在npm依赖包 */
if (fs.existsSync(packageConfig)) {
    packages = JSON.parse(
        fs.readFileSync(packageConfig, 'utf-8')
    ).dependencies;
}

module.exports = async function () {
    console.log('>start compile less to wxss...')
    let gulpwxss = child_process.execSync(`cd ${buildpath} && gulp wxss`);
    console.log(gulpwxss.toLocaleString())

    /** 存在npm组件，但是没有node_modules包 */
    if (packages && !fs.existsSync(moduleDir)) {
        console.log(`>start install packages...\n\n`)
        downloaded = child_process.execSync(`cd ${rootpath} && npm i`);
    }

    // if (!packages || packages && fs.existsSync(buildedDir))) {
    opened = await runCliCommand('-o');// 仅打开
    // }
    

    if (opened && opened.code === 40000) {
        return console.error('请先手动登录开发者工具后，重新执行命令...')
    }

    /** 存在module，但是没有构建 */
    if (fs.existsSync(moduleDir) && !fs.existsSync(buildedDir)) {
        opened = await runCliCommand('--build-npm');
    }


    let gulpwatch = child_process.exec(`cd ${buildpath} && gulp dev`);
    gulpwatch.stdout.on('data', chunk => { console.log(chunk) });
    gulpwatch.stderr.once('data', chunk => { console.error(chunk) });
}