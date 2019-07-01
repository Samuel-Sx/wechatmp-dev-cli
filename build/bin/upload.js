const path = require('path');
const inquirer = require('inquirer');
const { jsonFileHandle, runCliCommand } = require('../utils')

const oldVersion = jsonFileHandle.getJSON().version || '1.0.0';
let uploadData = jsonFileHandle.obj2map(jsonFileHandle.getJSON());
const projectPath = path.join(__dirname, '../../miniprogram')

const useoldversion = [
    {
        type: 'confirm',
        name: 'useOldVersion',
        message: `是否沿用之前的版本号 (${oldVersion}):`,
        default: false
    }
];

const inputversion = [
    {
        type: 'input',
        name: 'version',
        message: "请输入本次提交的版本号:",
        validate: function (value) {
            var pass = value.match(/^\d+\.{1}\d+\.{1}\d+$/);
            if (pass) {
                return true;
            }

            return '请按正确格式输入版本号 (例如: 1.0.0)。';
        }
    }
]

const inputdesc = [
    {
        type: 'input',
        name: 'desc',
        message: '请输入提交说明:',
        default: `${new Date().toLocaleString()} 提交`
    }
]

const confirm = () => inquirer.prompt(useoldversion);
const inputVersion = () => inquirer.prompt(inputversion);
const inputDesc = () => inquirer.prompt(inputdesc);

const uploadProject = async function (uploadConf) {
    let stdout = await runCliCommand('-u', uploadConf.version+'@'+projectPath, '--upload-desc', uploadConf.desc)
    if (stdout.code !== 0) {
        console.log(stdout)
    } else {
        console.log(`\n 代码上传成功！https://mp.weixin.qq.com/`)
    }
}

const openAndUpload = async function () {
    let opened = await runCliCommand('-o');
    if (opened && opened.code === 40000) {
        return console.error(`\n上传失败: ${opened.msg}...`)
    } else {
        uploadProject(jsonFileHandle.map2obj(uploadData));
        return false;
    }
}

module.exports = function () {
    confirm()
        .then(firststepdata => {
            if (firststepdata.useOldVersion) {
                uploadData.set('version', oldVersion)
                return inputDesc()
            } else {
                return inputVersion()
            }
        })
        .then(secondstepdata => {
            if (secondstepdata.version) {
                uploadData.set('version', secondstepdata.version)
                return inputDesc();
            } else if (secondstepdata.desc) {
                uploadData.set('desc', secondstepdata.desc)
            }
        }).then(thirdstepdata => {
            thirdstepdata && uploadData.set('desc', thirdstepdata.desc);
            jsonFileHandle.writeJSON(
                path.join(__dirname, '../../autoBuildConfig.json'),
                jsonFileHandle.map2obj(uploadData)
            )
            openAndUpload()
        })
}
