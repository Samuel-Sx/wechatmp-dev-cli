const fs = require('fs');
const path = require('path');

/**
 * 获取json文件中的内容
 * @param { string } paths 目标JSON文件路径， 默认查找根目录autoBuildConfig.json文件
 */
module.exports.getJSON = function (paths) {
    paths || (paths = path.join(__dirname, '../../autoBuildConfig.json'))
    let json = fs.readFileSync(paths);
    return JSON.parse(json);
}

/**
 * 向json文件中写入内容
 * @param { string } paths 目标JSON文件路径
 * @param { json } json 要写入的json对象
 */
module.exports.writeJSON = function (paths, json) {
    if (typeof json !== 'object') {
        console.error('请传入正确的json对象');
        return false;
    }
    json = JSON.stringify(json, null, '\t');
    try {
        let results = fs.writeFileSync(paths, json);
        return results;
    } catch (e) {
        console.log(e);
        return false;
    }
}

/**
 * Map to object
 */
module.exports.map2obj = function (strMap) {
    let obj = Object.create(null);
    for (let [k, v] of strMap) {
        obj[k] = v;
    }
    return obj;
}

/**
 * object to Map
 */
module.exports.obj2map = function (obj) {
    let strMap = new Map();
    for (let k of Object.keys(obj)) {
        strMap.set(k, obj[k]);
    }
    return strMap;
}