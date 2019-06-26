const path = require('path');
const fs = require('fs');
const child_process = require('child_process');
const { devToolPath, weakupDevTool } = require('../utils/');

const buildpath = path.join(__dirname, '../../');
const rootpath = path.join(__dirname, '../../miniprogram/');
const packageConfig = rootpath + 'package.json';
const moduleDir = rootpath + 'node_modules';
const buildedDir = rootpath + 'miniprogram_npm';


/** 打开开发者工具方法 */
const openDevTool = function (...args) {
    const devTool = devToolPath(...args);

    if (devTool.code === -1) {
        return console.log(devTool.msg);
    } else if (devTool.code === 0) {
        weakupDevTool(...devTool.params);
    }
}

/** 判断是否存在npm依赖包 */
let packages = null;
if (fs.existsSync(packageConfig)) {
    packages = JSON.parse(
        fs.readFileSync(packageConfig, 'utf-8')
    ).dependencies;
}

module.exports = function () {
    console.log('>start compile less to wxss...')
    let gulpwxss = child_process.execSync(`cd ${buildpath} && gulp wxss`);
    console.log(gulpwxss.toLocaleString())

    if (!packages || (packages && fs.existsSync(buildedDir))) {
        openDevTool('-o');// 仅打开
    }
    /** 存在npm组件，但是没有node_modules包 */
    if (packages && !fs.existsSync(moduleDir)) {
        console.log(`>start install packages...\n\n`)
        child_process.execSync(`cd ${rootpath} && cnpm i`, (error, stdout, stderr) => {
            console.dir(stdout);
        });
    }

    /** 存在module，但是没有构建 */
    if (fs.existsSync(moduleDir) && !fs.existsSync(buildedDir)) {
        openDevTool('--build-npm');
    }

    let gulpwatch = child_process.exec(`cd ${buildpath} && gulp dev`);
    gulpwatch.stdout.on('data', chunk => { console.log(chunk) });
    gulpwatch.stderr.once('data', chunk => { console.error(chunk) });
}