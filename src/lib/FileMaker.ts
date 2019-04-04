import * as path from "path";
import * as fs from "fs-extra";
import * as ejs from "ejs";
import FileGenerator from "./FileGenerator";
import writeFileTree from "./util/writeFileTree";
import { IPromptData } from "./interfaces/list";
import * as home from "user-home";

const HOME_DEST = home;

class FileMaker {
	private context: string;
	private tmpTemplateSrc: string;
	private files: {};
	private promptData: IPromptData;
	private fileMiddleWares: any[];

	constructor(opts = {}) {
		for (const opt in opts) {
			this[opt] = opts[opt];
		}
		this.fileMiddleWares = [];
		this.files = {};

		try {
			const api = new FileGenerator(this);
			api.render(`${this.tmpTemplateSrc}`, this.promptData);
		} catch (err) {
			console.error("fileMaker", err);
		}
	}

	async generateMockFile(file: string, content) {
		fs.ensureFileSync(file);
		return new Promise((resolve, reject) => {
			fs.writeFile(
				file,
				content,
				{
					encoding: "utf-8"
				},
				err => {
					if (err) {
						reject(err);
					}
					resolve("mock succeed");
				}
			);
		});
	}

	async make() {
		const dest = path.join(
			this.context,
			"src/routes",
			this.promptData.className
		);
		const initialFiles = Object.assign({}, this.files);
		const source = path.resolve(
			HOME_DEST,
			".mirror",
			`mockData/${this.promptData.label}.js`
		);
		const target = `${this.context}/mockData/${this.promptData.namespace}.js`;

		const content = ejs.render(fs.readFileSync(source, "utf-8"), {
			mockUrl: this.promptData.mockUrl
		});

		await this.resolveFiles();
		await writeFileTree(dest, this.files, initialFiles);

		await this.hack();
		await this.generateMockFile(target, content);

		setTimeout(() => {
			fs.writeFileSync(target, "/* data */", {
				flag: "a"
			});
		}, 5000);
	}

	async hack() {
		const configFilePath = path.resolve(this.context, "src/router-config.js");
		fs.removeSync(configFilePath);
	}

	async resolveFiles() {
		const files = this.files;
		for (const middleware of this.fileMiddleWares) {
			await middleware(files, ejs.render);
		}
	}
}

export default FileMaker;
