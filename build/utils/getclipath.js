const config = require('./getconfig');
const path = require('path');

const rootpath = path.join(__dirname, '../../miniprogram');

module.exports = function (...args) {
    if(args[0].indexOf('--quit') === -1 || args[0].indexOf('-u') === -1){
        args.push(rootpath);
    }
    let result = {
        code: -1,
        params: [],
        msg: 'error'
    };
    switch (process.platform) {
        case 'darwin':  /* mac OS */
            result.params = ['mac', '/Applications/wechatwebdevtools.app/Contents/MacOS/', 'cli', args]
            result.code = 0;
            msg = 'ok';
            break;
        case 'win32':  /* Win */
            result.params = ['win', config.weDevToolPath, 'cli.bat', args];
            result.code = 0;
            msg = 'ok';
            break;
        default:
            result.msg = '微信开发者工具仅支持mac系统和windows系统。';
            break;
    }
    return result
}