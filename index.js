#!/usr/bin/env node

const path = require('path');
const readline = require('readline');
const async = require('async');
const jsonfile = require('jsonfile');
const log = require('./logger').log;
const chalk = require('chalk');
const argv = require('minimist')(process.argv.slice(2));
const splitter = require('./splitter').split;
const Multispinner = require('multispinner');
const _ = require('lodash');
const conf = require(path.join(process.cwd(), 'gitsplit.json'));

let verbose = argv.verbose ? argv.verbose : false;
let branch = argv.branch ? argv.branch : conf.defaultBranch;
let selectedFolders = argv.folders ? argv.folders : null;
let mode, spinners, folders;
let start = new Date();

function setup(callback) {
		if (selectedFolders) {
			folders = selectedFolders.split(',');
		} else {
			folders = _.map(conf.folders, 'name');
		}

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
}

function split(callback) {

	async.eachSeries(folders, function(folderName, callbackEach) {
		const folder = conf.folders[folderName];

		if (!folder) {
			throw new Error('Folder is not present in configuration: ' + folderName);
		}

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

	    	const end = new Date() - start;
			log(chalk.bold.bgGreen(`Execution time: ${end}ms`));
	    }

	    callback();
	});
}

function run() {
	async.waterfall([
	    setup,
	    split
	], function (err, result) {
	    if (err) console.error(err);
	});
}

run();