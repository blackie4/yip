'use strict';

const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');

exports.init = function() {
	inquirer.prompt([
	  {
	    type: 'list',
	    name: 'frame',
	    message: 'please choose frame: ',
	    choices: ['module-demo', 'vue-demo'],
	  },
	  {
	    type: 'input',
	    name: 'name',
	    message: '请输入项目名称: ',
	    default: 'demo',
	    filter: function(val){
	    	return val.trim();
	    }
	  },
	  {
	    type: 'input',
	    name: 'desc',
	    message: '请输入项目描述: ',
	    default: 'demo description',
	    filter: function(val){
	    	return val.trim();
	    },
	    when: function(answers) {
	    	return answers.mode != '1.0';
	    }
	  }
	]).then(function (answers) {
	  console.log(JSON.stringify(answers, null, ''));
	  createProject(answers)
	});
}


function createProject(answers) {
	try {
		let tpmFolder = answers.name + '_demo';
		exec('git clone git@github.com:blackie4/'+ answers.frame +'.git '+ answers.name);
		exec('rm -rf '+ answers.name +'/.git');
	}catch(e) {
		console.log('exec: '+ e)
	}
	try {
		let proJsonPath = path.resolve(answers.name + '/package.json');

		if (fs.existsSync(proJsonPath)) {
		  let proJsonData = require(proJsonPath);
		  proJsonData.name = answers.name;
		  proJsonData.description = answers.desc;
		  fs.writeFileSync(proJsonPath, JSON.stringify(proJsonData, null, 2));
		}
	}catch(e) {
		console.log('fs write: '+ e)
	}
}
