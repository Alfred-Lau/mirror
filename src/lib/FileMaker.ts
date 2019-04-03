import * as path from "path";
import debug from 'debug'
const ejs = require("ejs");
const FileGenerator = require("./FileGenerator");
const writeFileTree = require("./util/writeFileTree");
import { IPromptData } from "./interfaces/list";

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

		const api = new FileGenerator(this);
		api.render(`${this.tmpTemplateSrc}`, this.promptData);
	}

	async make() {
		const dest = path.join(this.context, "src/routes", this.promptData.className);
		const initialFiles = Object.assign({}, this.files);
		await this.resolveFiles();
		await writeFileTree(dest, this.files, initialFiles);
		debug('create mocker file')
	}

	async resolveFiles() {
		const files = this.files;
		for (const middleware of this.fileMiddleWares) {
			await middleware(files, ejs.render);
		}
	}
}

export default FileMaker;
