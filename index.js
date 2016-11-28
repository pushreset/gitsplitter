const async = require('async');
const jsonfile = require('jsonfile');
const log = require('./logger').log;
const chalk = require('chalk');
const argv = require('minimist')(process.argv.slice(2));
const splitter = require('./splitter').split;
const Multispinner = require('multispinner');
const _ = require('lodash');

var file = 'gitsplit.json';
var verbose = argv.verbose ? argv.verbose : false;
var branch = argv.branch ? argv.branch : 'master';
var conf, mode, spinners;

function setup(callback) {
	jsonfile.readFile(file, function(err, data) {
		conf = data;

		var folders = _.map(conf.folders, 'name');

		if (!verbose) {
			spinners = new Multispinner(folders, {
				autoStart: true,
				color: {
					incomplete: 'white',
					success: 'green',
					error: 'red'
				}
			});
		}

		callback();
	});
}

function split(callback) {
	async.eachSeries(conf.folders, function(folder, callbackEach) {

		splitter(
			conf.source_repository,
			folder.target_repository,
			folder.name,
			branch,
			spinners,
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