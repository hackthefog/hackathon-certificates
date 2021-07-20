// Salt required for process.env.SALT
module.exports = function hash(name, role, type) {
	let correctHash = 0;
	const params = [`name|${name}`, `role|${role}`, `type|${type}${process.env.SALT||""}`];

	for(const paramInput of params) {
		correctHash += Number(hashParam(paramInput)) / 6;
	}

	return hashParam(correctHash);
};

function hashParam(input) {
	input = input.toString();
	let output = 0;
	for(const char of input) {
		output = (output << 5) - output + char.charCodeAt(0);
		output &= output;
	}
	return output;
}