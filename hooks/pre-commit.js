// #!/usr/bin/env node

// /**
//  * 在 git push 命令完成之前做一些事
//  * > 1. 校验 npm_package_name，必须和所在项目目录名称保持一致
//  * > 2. 校验 npm_package_version，必须和当前所在Git分支版本号保持一致
//  * > 3. 推送 branch、推送 tag之前运行用户在npm_package_scripts配置的prepushtag、prepushbranch命令行
//  * > 4. push tag成功之后自动合并代码至远端master分支并删除远端对应开发分支
//  */

// 'use strict';

// const fs = require('fs');
// const path = require('path');
// const Q = require('q');
// const exec = require('child_process').exec;
// const chalk = require('chalk');
// const yargs = require('yargs');
// const shell = require('shelljs');

// const regTag = /^[v]{1}\d+\.\d+\.\d+$/; // tag格式，例：v1.0.0
// const regBranch =/^[d]{1}\d+\.\d+\.\d+$/; // branch格式，例：d1.0.0
// const regMaster = /^master$/; // master分支
// const regVersion = /\d+\.\d+\.\d/; // 获取tag、branch版本号

// /**
//  * 构造器函数
//  */
// function PreCommit() {
//   this.init();
// }

// /**
//  * 初始化方法
//  */
// PreCommit.prototype.init = function() {
//   this.checkPkgName();
//   this.checkPkgVersion();
// };

// /**
//  * 检测package项目名称和当前项目目录名称是否一致
//  */
// PreCommit.prototype.checkPkgName = function() {
//   let pkgName = process.env.npm_package_name;
//   let projectName = path.basename(path.resolve(__dirname, '..'));

//   if (pkgName !== projectName) {
//     let pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
//     pkg.name = projectName;
//     fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
//     console.log(chalk.yellow('npm_package_name 字段与当前所在项目名称不一致，已自动修改为：' + projectName));
//     process.exit(1);
//   }
// };

// /**
//  * 检测package版本号和当前Git分支版本号是否一致
//  * @param {Object} data 分支数据
//  */
// PreCommit.prototype.checkPkgVersion = function(data) {
//   if (data.isMaster) return; // master分支不在进行版本号校验

//   let pkgVersion = process.env.npm_package_version;

//   if (pkgVersion !== data.branchVersion) {
//     let pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
//     pkg.version = data.branchVersion;
//     fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
//     console.log(chalk.yellow('npm_package_version 字段与当前所在Git分支版本号不一致，已自动修改为：' + data.branchVersion));
//     process.exit(1);
//   }



//   // https://git-scm.com/book/zh/v1/Git-%E5%86%85%E9%83%A8%E5%8E%9F%E7%90%86-Git-References
//   // http://stackoverflow.com/questions/27615126/print-symbolic-name-for-head
//   // https://stackoverflow.com/questions/6245570/how-to-get-the-current-branch-name-in-git
//   // git symbolic-ref --short HEAD
//   // git symbolic-ref -q --short HEAD || git name-rev --name-only HEAD
//   // git symbolic-ref -q --short HEAD || git describe --all --always HEAD
//   // git symbolic-ref HEAD
//   // git rev-parse --abbrev-ref HEAD
//   // git branch | sed -n '/\* /s///p'
//   // git describe --all
//   // git branch | grep \* | cut -d ' ' -f2-
//   // git branch | sed -n '/\* /s///p'
//   // git reflog HEAD | grep 'checkout:' | head -1 | awk '{print $NF}'
//   // git reflog | awk '$3=="checkout:" {print $NF; exit}'
//   // git status | head -1
//   // git status | head -1 | awk '{print $NF}'
//   // 上面的方法亲测，除最后一个方法没有测出问题之外，其它方法或多或少都有问题
//   exec("git status | head -1 | awk '{print $NF}'", (error, stdout, stderr) => {
//     if (!error) {
//       let branchName = (stdout || '').trim();
//       let branchVersion = branchName.match(regVersion) ? branchName.match(regVersion)[0] : '';
//       let isTag = regTag.test(branchName);
//       let isBranch = regBranch.test(branchName);
//       let isMaster = regMaster.test(branchName);
//     } else {
//       console.log(chalk.red(error));
//     }
//   });
// };



// // let results = null;

// // // ref：https://github.com/zwhu/blog/issues/31
// // try {
// //   // git grep 命令会执行 perl 的正则匹配所有满足冲突条件的文件
// //   let results = execSync(`git grep -n -P "${isConflictRegular}"`, {
// //     encoding: 'utf-8'
// //   });
// // } catch (e) {
// //   console.log('没有发现冲突，等待 commit');
// //   process.exit(0);
// // }

// // if (results) {
// //   console.error('发现冲突，请解决后再提交，冲突文件：');
// //   console.error(results.trim());
// //   process.exit(1);
// // }

// // process.exit(0);


// return new PreCommit();
