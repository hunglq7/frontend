import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tsconfigPath = path.join(__dirname, "node_modules", "xlsx", "types", "tsconfig.json");

try {
	if (fs.existsSync(tsconfigPath)) {
		let content = fs.readFileSync(tsconfigPath, "utf8");

		// Check if ignoreDeprecations is already present
		if (!content.includes("\"ignoreDeprecations\"")) {
			// Add ignoreDeprecations to compilerOptions with proper indentation
			content = content.replace(
				"\"compilerOptions\": {",
				"\"compilerOptions\": {\n        \"ignoreDeprecations\": \"5.0\",",
			);

			fs.writeFileSync(tsconfigPath, content, "utf8");
			process.stdout.write("✓ Fixed xlsx tsconfig.json: added ignoreDeprecations\n");
		}
		else {
			process.stdout.write("✓ xlsx tsconfig.json already has ignoreDeprecations\n");
		}
	}
}
catch (error) {
	process.stderr.write(`⚠ Could not fix xlsx tsconfig.json: ${error.message}\n`);
}
