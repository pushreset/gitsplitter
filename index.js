const async = require('async');
const jsonfile = require('jsonfile');
const log = console.log;
const chalk = require('chalk');
var argv = require('minimist')(process.argv.slice(2));
const splitter = require('./splitter').split;

var file = 'gitsplit.json';
var conf, branch;

function setup(callback) {
	branch = argv.branch ? argv.branch : 'master';

	jsonfile.readFile(file, function(err, data) {
		conf = data;
		callback(null);
	});
}

function split(callback) {
	async.eachSeries(conf.folders, function(folder, callbackEach) {

		splitter(
			conf.source_repository,
			folder.target_repository,
			folder.name,
			branch,
			callbackEach
		);

	}, function(err){
	    if( err ) {
	      console.error(err);
	    } else {
	      log(chalk.bold.bgGreen('All folders have been splitted successfully'));
	    }

	    callback();
	});
}

function run() {
	async.waterfall([
	    setup,
	    split
	], function (err, result) {
	    if (err) log(chalk.bold.red(err));
	});
}

run();