const fs = require("fs-extra");
const path = require("path");

function deleteRemovedFiles(
	directory: string,
	newFiles: any,
	previousFiles: any
) {
	// get all files that are not in the new filesystem and are still existing
	const filesToDelete = Object.keys(previousFiles).filter(
		filename => !newFiles[filename]
	);

	// delete each of these files
	return Promise.all(
		filesToDelete.map(filename => {
			return fs.unlink(path.join(directory, filename));
		})
	);
}

export = async function writeFileTree(
	dir: string,
	files: any,
	previousFiles: any
) {
	if (previousFiles) {
		await deleteRemovedFiles(dir, files, previousFiles);
	}

	Object.keys(files).forEach(name => {
		const filePath = path.join(dir, name);
		fs.ensureDirSync(path.dirname(filePath));
		console.log(`creating ${filePath.split('/').pop()}`);
		fs.writeFileSync(filePath, files[name]);
	});
};
