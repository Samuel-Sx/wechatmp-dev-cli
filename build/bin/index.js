const path = require('path');
const fs = require('fs');
const openDevTool = require('./open');
const child_process = require('child_process');


const gulppath = path.join(__dirname, '../gulp');
const rootpath = path.join(__dirname, '../../miniprogram/');
const packageConfig = rootpath + 'package.json';
const moduleDir = rootpath + 'node_modules';
const buildedDir = rootpath + 'miniprogram_npm';

let packages = null;


if (fs.existsSync(packageConfig)) {
    packages = JSON.parse(
        fs.readFileSync(packageConfig, 'utf-8')
    ).dependencies;
}

const runtime = async function () {
    console.log('>start compile less to wxss...')
    child_process.spawnSync(`gulp`,['wxss']);
    console.log('>wxss compiled!\n\n')

    if (!packages || (packages && fs.existsSync(buildedDir))) {
        openDevTool('-o');// 仅打开
    }
    /** 存在npm组件，但是没有node_modules包 */
    if (packages && !fs.existsSync(moduleDir)) {
        console.log(`>start install packages...\n\n`)
        child_process.execSync(`cd ${rootpath} && cnpm i`, (error, stdout, stderr)=>{
            console.dir(stdout);
        });
    }

    /** 存在module，但是没有构建 */
    if (fs.existsSync(moduleDir) && !fs.existsSync(buildedDir)) {
        await openDevTool('--build-npm');
    }

    let gulpwatch = child_process.exec(`gulp dev`);
    gulpwatch.stdout.on('data',chunk => {console.log(chunk)});
}


runtime();