import * as home from "user-home";
import * as _ from "lodash";
import * as inquirer from "inquirer";
import chalk from "chalk";
import * as path from "path";
import * as fs from "fs-extra";
import fileMaker from "../FileMaker";
import Notifier from "../Notifier";
import { IListMeta, IRes } from "../interfaces/list";
import { choosePort, prepareUrls } from "react-dev-utils/WebpackDevServerUtils";
import * as clearConsole from "react-dev-utils/clearConsole";
import clone from "../util/download";
import getUser from "../util/getUser";
const ora = require("ora");

const HOME_DEST = home;
const DEFAULT_PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8082;
const HOST = process.env.HOST || "0.0.0.0";
const protocol = process.env.HTTPS === "true" ? "https" : "http";

const _camelize = arr => {
	const [small, ...rest] = arr;
	const res = rest.map(item => {
		return `${item[0].toUpperCase()}${item.slice(1)}`;
	});
	return [small, ...res].join("");
};

/* AaaBbb */
export const formatMate = (name: string, label) => {
	/* aaaBbb */
	const origin = name.match(/[A-Z][a-z]*/g).map(item => {
		return item.toLowerCase();
	});
	const namespace = _camelize(origin);
	/* AaaBbb */
	const className = name;
	/* /api/aaa-bbb/list */
	const serviceApi = `${origin.join("-")}`;
	/* /aaa-bbb/list */
	const url = `/${origin.join("-")}`;
	/* /api/aaa-bbb/list */
	const mockUrl = serviceApi;
	return {
		name,
		namespace,
		className,
		serviceApi,
		url,
		mockUrl,
		label
	};
};

export default async function list(dir, cmd) {
	/* 判断是否在项目目录 */
	// const port = await choosePort(HOST, DEFAULT_PORT);
	let port;

	try {
		port = require(`${process.cwd()}/config/index.js`).dev.port || DEFAULT_PORT;
	} catch (error) {
		console.error("请确保在项目根目录执行操作");
		process.exit(0);
	}

	const urls = prepareUrls(protocol, HOST, port);
	const choices = [
		{
			name: "简单列表(覆盖中台40%列表页面)",
			value: {
				label: "BasicList",
				remote: "git@git.cai-inc.com:paas-front/zcy-bestPractice-front.git"
			}
		},
		{
			name: "详情",
			value: {
				label: "BasicDetail",
				remote: "git@git.cai-inc.com:paas-front/zcy-bestPractice-front.git"
			}
		},
		{
			name: "简单列表+详情",
			value: {
				label: "BasicComb",
				remote: "git@git.cai-inc.com:paas-front/zcy-bestPractice-front.git"
			}
		},
		{
			name: "复杂列表(覆盖中台60%列表页面)",
			value: {
				label: "ComplexList",
				remote: "git@git.cai-inc.com:paas-front/zcy-bestPractice-front.git"
			}
		},
		{
			name: "复杂列表+详情",
			value: {
				label: "ComplexComb",
				remote: "git@git.cai-inc.com:paas-front/zcy-bestPractice-front.git"
			}
		}
	];

	const questions = [
		{
			type: "input",
			name: "name",
			message: "请输入模块名称",
			validate: name => {
				if (/^[A-Z]+/.test(name)) {
					return true;
				} else {
					return "模块名称必须以大写字母开头";
				}
			}
		}
	];

	const res: IRes = await inquirer.prompt([
		{
			type: "list",
			message: "请选择开发模板",
			name: "template",
			choices
		}
	]);
	const meta: IListMeta = await inquirer.prompt(questions);

	/*  检测是否存在同名目录，处理冲突 */

	const targetDir = path.resolve(process.cwd(), "src/routes", meta.name || ".");

	if (fs.existsSync(targetDir)) {
		const {
			action
		}: {
			action?: string | boolean;
		} = await inquirer.prompt([
			{
				name: "action",
				type: "list",
				message: `页面 ${chalk.cyan(meta.name)} 已经存在. 您可以:`,
				choices: [
					{ name: "合并", value: "merge" },
					{ name: "覆盖", value: "overwrite" },
					{ name: "我再想想", value: false }
				]
			}
		]);
		if (!action) {
			return;
		} else if (action === "overwrite") {
			console.log(`\移除 ${chalk.cyan(meta.name)}...`);
			await fs.remove(targetDir);
		}
	}

	const promptData = formatMate(meta.name, res.template.label);

	await clone(
		`direct:${res.template.remote}#feature/template`,
		`${HOME_DEST}/.mirror`,
		{
			clone: true
		}
	);

	const tmpTemplateSrc = path.resolve(
		HOME_DEST,
		".mirror/src/routes",
		res.template.label
	);

	const maker = new fileMaker({
		context: process.cwd(),
		promptData,
		tmpTemplateSrc
	});

	const spinner = ora();
	spinner.text = "正在生成页面...";
	spinner.color = "magenta";
	spinner.start();
	await maker.make();
	spinner.stopAndPersist();

	/* notify */
	const { name, email } = await getUser();

	const notifier = new Notifier({
		name,
		email,
		time: new Date(),
		cmd: "list",
		args: ["-l"]
	});

	await notifier.notify();

	clearConsole();

	if (urls.lanUrlForTerminal) {
		console.log(
			`  ${chalk.bold("Local:")}            ${urls.localUrlForTerminal}#${
				promptData.url
			}/list`
		);
		console.log(
			`  ${chalk.bold("On Your Network:")}  ${urls.lanUrlForTerminal}#${
				promptData.url
			}/list`
		);
	} else {
		console.log(`  ${urls.localUrlForTerminal}#${promptData.url}/list`);
	}
}
