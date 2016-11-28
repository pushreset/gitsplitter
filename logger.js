const argv = require('minimist')(process.argv.slice(2));
var verbose = argv.verbose ? argv.verbose : false;

if (verbose) {
	var log = console.log;
} else {
	function log(){};
}

module.exports = {
	log: log
};