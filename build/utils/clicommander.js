const commander = require('commander');

commander
.option('-s, --start', 'Load & compile dependencies, open developer tools and enable less listening')
.option('-u, --upload', 'Package & upload the project to WeChat developer server')
.parse(process.argv)

module.exports = commander