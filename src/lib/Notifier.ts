import { REMOTE_HOST } from "./constant";
import * as fetch from "isomorphic-fetch";
import * as fs from "fs-extra";
import * as USER_HOME from "user-home";

class Notifier {
	constructor(public opts) {
		for (const opt in opts) {
			if (opts.hasOwnProperty(opt)) {
				const val = opts[opt];
				this[opt] = val;
			}
		}
	}

	public async notify() {
		try {
			const res = await fetch(`${REMOTE_HOST}/api/notify`, {
				method: "POST"
			});
			if (res.ok) {
				console.log(res.json());
			} else {
				// throw new Error("Network response was not ok.");
				/* write local file */
				fs.writeFileSync(`${USER_HOME}/.mi-log`, JSON.stringify(this.opts), {
					flag: "a"
				});
			}
		} catch (err) {
			console.error("notify error", err.message);
			process.exit();
		}
	}
}

export default Notifier;
