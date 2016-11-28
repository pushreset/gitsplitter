const exec = require('child_process').exec;
const format = require('util').format;
const moment = require('moment');
const async = require('async');
const chalk = require('chalk');
const randomstring = require('randomstring');
const log = console.log;

var folder, branch, sourceOrigin, targetOrigin;
var tmpFolder, gitCloneCmd, gitLogCmd, gitCheckoutCmd, gitSplitCmd, gitOriginCmd, gitPushForceCmd;

function clone(callback) {
	log(chalk.blue.bold('Cloning repository...'));

	exec(gitCloneCmd, function(error, stdout, stderr) {
		if (error) throw new Error(error);
		if (stdout) log(chalk.green(stdout));

		callback(null);
	});
}

function checkout(callback) {
	log(chalk.blue.bold('Checkout repository...'));

	exec(gitCheckoutCmd, function(error, stdout, stderr) {
	  	if (error) throw new Error(error);
		if (stdout) log(chalk.green(stdout));

		callback(null);
	});
}

function filterBranch(callback) {
	log(chalk.blue.bold('Splitting repository...'));

	exec(gitSplitCmd, function(error, stdout, stderr) {
	  	if (error) throw new Error(error);
		if (stdout) log(chalk.green(stdout));

		callback(null);
	});
}

function changeOrigin(callback) {
	log(chalk.blue.bold('Update repository origin...'));

	exec(gitOriginCmd, function(error, stdout, stderr) {
	  	if (error) throw new Error(error);
		if (stdout) log(chalk.green(stdout));

		callback(null);
	});
}

function pushForce(callback) {
	log(chalk.blue.bold('Push --force repository...'));

	//TODO: control remote before push force
	exec(gitPushForceCmd, function(error, stdout, stderr) {
	  	if (error) throw new Error(error);
		if (stdout) log(chalk.green(stdout));

		callback(null);
	});
}

function run(mainCallback) {
	//TODO: delete temp folder on process ending/error
	async.waterfall([
	    clone,
	    checkout,
	    filterBranch,
	    changeOrigin,
	    pushForce
	], function (err) {
	    if (err) log(chalk.bold.red(err));

	    mainCallback(err);
	});
}

function split(source, target, folder, branch, mainCallback) {
	folder = folder;
	branch = branch;
	sourceOrigin = source;
	targetOrigin = target;

	tmpFolder = format('/tmp/gitsplitter/%s/%s/', moment().valueOf(), randomstring.generate());
	gitCloneCmd = format('git clone %s %s', sourceOrigin, tmpFolder);
	gitLogCmd = format('git -C %s log', tmpFolder);
	gitCheckoutCmd = format('git -C %s checkout %s', tmpFolder, branch);
	gitSplitCmd = format('git -C %s filter-branch --force --prune-empty --subdirectory-filter %s %s', tmpFolder, folder, branch);
	gitOriginCmd = format('git -C %s remote set-url origin %s', tmpFolder, targetOrigin)
	gitPushForceCmd = format('git -C %s push -u -f origin %s', tmpFolder, branch);

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