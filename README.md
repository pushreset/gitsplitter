# GITSPLITTER

A nodejs cli tool to split monolithic GIT repository


For more information on monolithic repositories :

* https://gist.github.com/arschles/5d7ba90495eb50fa04fc
* http://gregoryszorc.com/blog/2014/09/09/on-monolithic-repositories/
* https://danluu.com/monorepo/
* http://www.thedotpost.com/2016/05/fabien-potencier-monolithic-repositories-vs-many-repositories

See https://www.npmjs.com/package/gitsplitter

# Requirements

* Git ~1.8
* NodeJS ~6.0.0

## Installation

```
npm install -g gitsplitter
```

On unix system you have to re-define file type with dos2unix tool (will be fixed soon :innocent:):

```
wich gitsplitter
dos2unix /path/to/gitsplitter/exec
```

Create a **gitsplit.json** configuration file in root of you monolithic repository :

```
{
	"temp_path": "/tmp/gitsplitter/",
	"clean_temp_folder": true,
	"source_repository": "git@github.com:pushreset/my_monolithic_repo.git",
	"master_branch": "master",
	"default_branch": "master",
	"allow_push_force": true,
	"push_force_on_master": false,
	"folders" : {
		"folder_a": {
			"name": "folder_a",
			"target_repository": "git@github.com:pushreset/my_splitted_repo_folder_a.git"
		},
		"folder_b": {
			"name": "folder_b",
			"target_repository": "git@github.com:pushreset/my_splitted_repo_folder_b.git"
		}
	}
}
```

## Usage

:exclamation: **BE CAREFUL THIS TOOL IS MAKING GIT PUSH FORCE ON DESTINATION REPOSITORIES** :exclamation:

On root of you monolithic repository :

```
gitsplitter
```

or

```
gitsplitter --branch=feat/awesome --folders=folder_a,folder_b --verbose
```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D


## Credits
Julien Duvignau


## License
[ISC](https://spdx.org/licenses/ISC)


