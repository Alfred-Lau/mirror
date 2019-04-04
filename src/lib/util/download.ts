// // import * as download from "download-git-repo";
// import * as util from "util";
import * as home from "user-home";
import * as fs from "fs";
import * as path from "path";

// const download = util.promisify(require("download-git-repo"));
// const clone = async (
// 	repository: string,
// 	destination: string,
// 	options?: any
// ) => {
// 	return new Promise((resolve, rejects) => {
// 		download(repository, destination, options, (err: Error) => {
// 			if (!err) {
// 				resolve();
// 			}
// 			rejects(err);
// 		});
// 	});
// };

export const removeDir = (src: string) => {
	//  获取文件夹里的内容
	const arr = fs.readdirSync(src);
	//  判断是否是文件，如果是文件删除；如果是文件夹在执行相同的过程
	for (let file of arr) {
		let filePath = path.join(src, "/", file);
		let data = fs.statSync(filePath);
		// 判断每个元素是文件或者是文件夹
		if (data.isFile()) {
			fs.unlinkSync(filePath);
		} else {
			removeDir(filePath);
		}
	}
	// 删除空文件夹
	fs.rmdirSync(src);
};

// export default async (remote: string, branch: string, dest: string) => {
// 	if (fs.existsSync(dest)) {
// 		await removeDir(dest);
// 	}
// 	console.log(remote, branch, dest);
// 	await download(`direct:${remote}#${branch}`, dest, { clone: true }, err => {
// 		if (err) {
// 			console.log();
// 			console.info(`remove ${home}/.mirror path and try it again.`);
// 			process.exit(1);
// 		}
// 	});
// };

const download = require("download-git-repo");

export default async (
	repository: string,
	destination: string,
	options?: any
) => {
	if (fs.existsSync(destination)) {
		await removeDir(destination);
	}
	return new Promise((resolve, rejects) => {
		download(repository, destination, options, (err: Error) => {
			if (!err) {
				resolve();
			}
			rejects(err);
		});
	});
};
