#!/usr/bin/env node

var program = require("commander");
var path = require("path");
var chalk = require("chalk");
const { Generator } = require("../lib/Generator");
import list from "../lib/commands/list";
const pkg = require(path.resolve(__dirname, "../../package.json"));

program.version(pkg.version, "-v, --version");

program.option("-l", "list the supported template", list);

// program
// 	.command("new <page>")
// 	.option("-n, --page", "input a name for your page")
// 	.action(function(dir, cmd) {
// 		const target = path.resolve(__dirname, "..", dir);
// 		const pageName = process.argv.pop() || "demo";
// 		folders.deleteAll(target);
// 		folders.copyDir(template, pageName, `${process.cwd()}/src/routes`);
// 	});

// program.command("g <page>").action(async (dir, cmd) => {
// 	require("../lib/create")(dir, cmd);
// });

// program.command("add <module-name>").action(async (dir, cmd) => {
// 	const instance = new Generator(dir);
// 	try {
// 		await instance.init();
// 	} catch (e) {}
// });

// 不支持命令默认回调
program.arguments("<command>").action(cmd => {
	console.log(`  ` + chalk.red(`不支持该命令 ${chalk.yellow(cmd)}.`));
	program.outputHelp();
});

// 输出帮助信息
program.on("--help", () => {
	console.log();
	console.log(
		`  Run ${chalk.cyan(
			`mi <command> --help`
		)} for detailed usage of given command.`
	);
	console.log();
});

//输出单条命令帮助信息
program.commands.forEach(c => c.on("--help", () => console.log()));

program.parse(process.argv);

if (!process.argv.slice(2).length) {
	program.outputHelp();
}

process.on("unhandledRejection", err => {
	console.error(err);
});
