const child_process = require('child_process');

module.exports = function (platform, path, filename, params) {
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
    const subProcess = new Promise((resolve, reject) => {
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

    subProcess.then(resp => {
        console.log(resp)
    }).catch(err => {
        let code = err.error.code
        switch (code) {
            case 127:
                console.log(`未能成功运行，请检查开发者工具路径配置是否正确。`);
                break;
            case 255:
                console.log(`开发者工具未登录，或者您不是当前小程序的开发者。`);
                break;
            default:
                console.log(err.error)
                break;
        }
    })
}