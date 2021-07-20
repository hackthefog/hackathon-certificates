require("dotenv").config();
const hasher = require("./hasher.js");

// Use the command with [npm run generate "<name>" "<role>" "<type>"]
function generate(name, role, type) {
	return `${process.env.BASE_URL || ""}/?name=${name}&role=${role}&type=${type}&key=${hasher(name, role, type)}`;
}

if (require.main === module) {
	const name = process.argv[2];
	const role = process.argv[3];
	const type = process.argv[4];

	console.log(generate(name, role, type));
}

module.exports = generate;