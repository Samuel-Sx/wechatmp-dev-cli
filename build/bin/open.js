const { devToolPath, weakupDevTool } = require('../utils/');


module.exports = function (...args) {
    const devTool = devToolPath(...args);

    if (devTool.code === -1) {
        return console.log(devTool.msg);
    } else if (devTool.code === 0) {
        weakupDevTool(...devTool.params);
    }
}
