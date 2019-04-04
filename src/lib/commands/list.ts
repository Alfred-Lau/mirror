import * as home from "user-home";
import * as _ from "lodash";
import * as inquirer from "inquirer";
import chalk from "chalk";
import * as path from "path";
import fileMaker from "../FileMaker";
import { IListMeta, IRes } from "../interfaces/list";
import { choosePort, prepareUrls } from "react-dev-utils/WebpackDevServerUtils";
import clone from "../util/download";

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
	const url = `/${origin.join("-")}/list`;
	/* /api/aaa-bbb/list */
	const mockUrl = serviceApi;
	return {
		namespace,
		className,
		serviceApi,
		url,
		mockUrl,
		label
	};
};

export default async function list(dir, cmd) {
	// const port = await choosePort(HOST, DEFAULT_PORT);
	const port =
		require(`${process.cwd()}/config/index.js`).dev.port || DEFAULT_PORT;
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
				label: "BasicComb2",
				remote: "git@git.cai-inc.com:paas-front/zcy-bestPractice-front.git"
			}
		},
		{
			name: "复杂列表+详情",
			value: {
				label: "BasicComb2",
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
	const promptData = formatMate(meta.name, res.template.label);

	// await clone(res.template.remote, "feature/template", `${HOME_DEST}/.mirror`);
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
	await maker.make();

	if (urls.lanUrlForTerminal) {
		console.log(
			`  ${chalk.bold("Local:")}            ${urls.localUrlForTerminal}#${
				promptData.url
			}`
		);
		console.log(
			`  ${chalk.bold("On Your Network:")}  ${urls.lanUrlForTerminal}#${
				promptData.url
			}`
		);
	} else {
		console.log(`  ${urls.localUrlForTerminal}#${promptData.url}`);
	}
}
