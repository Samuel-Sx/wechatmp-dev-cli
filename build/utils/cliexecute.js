const child_process = require('child_process');
const getCliPath = require('./getclipath');

const runCliCommand = function (platform, path, filename, params) {
    params || (params = []);
    let command, runFunc, funcParam;

    /** 判断系统类型，按规则生成参数 */
    if (platform === 'mac') {
        command = params ? `${path}${filename} ${params.join(' ')}` : `${path}${filename}`;
        runFunc = child_process.exec;
        funcParam = [command]
    } else if (platform === 'win') {
        command = `${path}${filename}`;
        runFunc = child_process.execFile;
        funcParam = [command, params];
    }

    /** 调用子进程执行 */
    // const subProcess =
    return new Promise((resolve, reject) => {
        runFunc(...funcParam, function (err, stdout, stderr) {
            if (err || stderr) {
                let code = err ? 1000 : 1001; // 1000 子进程启动错误 1001 子进程执行抛错
                let error = err ? err : stderr;
                reject({ code, error })
            }
            if (stdout) {
                resolve(stdout)
            }
        })
    })
}

/** 打开开发者工具方法 */
module.exports = async function (...args) {
    const devTool = getCliPath(...args);
    let results;
    if (devTool.code === -1) {
        return console.log(devTool.msg);
    } else if (devTool.code === 0) {
        await runCliCommand(...devTool.params)
            .then(res => {
                results = {
                    code: 0,
                    msg: 'ok'
                }
            })
            .catch(e => {
                let error = e.error.toString();
                let index = error.match(/\"\{/);
                index = index ? index.index : null;
                if (index) {
                    let errobj = JSON.parse(JSON.parse([].slice.call(error, index, error.length).join('')))
                    results = {
                        code: errobj.code,
                        msg: errobj.error
                    }
                } else {
                    results = {
                        code: -1,
                        msg: 'unkown'
                    }
                    return console.log(error)
                }
            })
    }
    return results;
}