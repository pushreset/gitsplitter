const exec = require('child_process').exec;
const format = require('util').format;
const moment = require('moment');
const async = require('async');
const chalk = require('chalk');
const randomstring = require('randomstring');
const argv = require('minimist')(process.argv.slice(2));
const log = require('./logger').log;

let verbose = argv.verbose ? argv.verbose : false;
let folder, branch, forcePush, sourceOrigin, targetOrigin;
let tmpFolder, cleanFolder, gitCloneCmd, gitLogCmd, gitCheckoutCmd, gitSplitCmd, gitOriginCmd, gitPushCmd, cleanCmd;
let spinners;


function clone(callback) {
	log(chalk.blue.bold('Cloning repository...'));

	exec(gitCloneCmd, function(error, stdout, stderr) {
		if (error) return callback(error);
		if (stdout) log(chalk.green(stdout));

		callback();
	});
}

function checkout(callback) {
	log(chalk.blue.bold('Checkout repository...'));

	exec(gitCheckoutCmd, function(error, stdout, stderr) {
	  	if (error) return callback(error);
		if (stdout) log(chalk.green(stdout));

		callback();
	});
}

function filterBranch(callback) {
	log(chalk.blue.bold('Splitting repository...'));

	exec(gitSplitCmd, function(error, stdout, stderr) {
	  	if (error) return callback(error);
		if (stdout) log(chalk.green(stdout));

		callback();
	});
}

function changeOrigin(callback) {
	log(chalk.blue.bold('Update repository origin...'));

	exec(gitOriginCmd, function(error, stdout, stderr) {
	  	if (error) return callback(error);
		if (stdout) log(chalk.green(stdout));

		callback();
	});
}

function push(callback) {
	log(chalk.blue.bold('Push repository...'));
	log(chalk.blue.yellow(gitPushCmd));

	//TODO: control remote before push force
	exec(gitPushCmd, function(error, stdout, stderr) {
	  	if (error) return callback(error);
		if (stdout) log(chalk.green(stdout));

		callback();
	});
}

//TODO: delete temp folder on process ending/error
function clean(callback) {
	if (!cleanFolder) return callback();

	log(chalk.blue.bold('Clean temp folder'));

	exec(cleanCmd, function (error, stdout) {
		if (error) return callback(error);
		if (stdout) log(chalk.green(stdout));

		callback();
	});
}


function run(mainCallback) {
	//TODO: delete temp folder on process ending/error
	async.waterfall([
	    clone,
	    checkout,
	    filterBranch,
	    changeOrigin,
	    push,
	    clean
	], function (err) {
	    if (err) {
	    	log(chalk.bold.red(err));
	    	if (!verbose) spinners.error(folder);
	    } else {
	    	if (!verbose) spinners.success(folder);
	    }

	    mainCallback(err);
	});
}

function split(source, target, fld, brch, fPush, tmpFld, cleanFld, spnn, mainCallback) {
	folder = fld;
	branch = brch;
	forcePush = fPush;
	sourceOrigin = source;
	targetOrigin = target;
	spinners = spnn;
	cleanFolder = cleanFld;

	tmpFolder = format('%s/%s-%s/', tmpFld, moment().valueOf(), randomstring.generate());
	gitCloneCmd = format('git clone %s %s', sourceOrigin, tmpFolder);
	gitLogCmd = format('git -C %s log', tmpFolder);
	gitCheckoutCmd = format('git -C %s checkout %s', tmpFolder, branch);
	gitSplitCmd = format('git -C %s filter-branch --force --prune-empty --subdirectory-filter %s %s', tmpFolder, folder, branch);
	gitOriginCmd = format('git -C %s remote set-url origin %s', tmpFolder, targetOrigin)
	cleanCmd = format('rm -r %s', tmpFolder);

	if (forcePush) {
		gitPushCmd = format('git -C %s push -u -f origin %s', tmpFolder, branch);
	} else {
		gitPushCmd = format('git -C %s push -u origin %s', tmpFolder, branch);
	}

	log(chalk.bold.bgGreen(format('Splitting: %s', sourceOrigin)));
	log(chalk.yellow(format('folder: %s', folder)));
	log(chalk.yellow(format('branch: %s', branch)));
	log(chalk.yellow(format('target: %s', targetOrigin)));
	log(chalk.yellow(format('tmp: %s', tmpFolder)));

	if (sourceOrigin !== targetOrigin) {
		run(mainCallback);
	} else {
		mainCallback(new Error('Source and target origin are equals'));
	}
}

module.exports = {
	split: split
};
