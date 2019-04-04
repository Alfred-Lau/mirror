import * as path from "path";
import * as ejs from "ejs";
import FileGenerator from "./FileGenerator";
import writeFileTree from "./util/writeFileTree";
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

		try {
			const api = new FileGenerator(this);
			api.render(`${this.tmpTemplateSrc}`, this.promptData);
		} catch (err) {
			console.error("fileMaker", err);
		}
	}

	async generateMockFile(file: string, content) {}

	async make() {
		const dest = path.join(
			this.context,
			"src/routes",
			this.promptData.className
		);
		const initialFiles = Object.assign({}, this.files);
		await this.resolveFiles();
		await writeFileTree(dest, this.files, initialFiles);

		// console.log("mock file");
	}

	async resolveFiles() {
		const files = this.files;
		for (const middleware of this.fileMiddleWares) {
			await middleware(files, ejs.render);
		}
	}
}

export default FileMaker;
