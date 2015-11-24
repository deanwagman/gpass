
//    __________  ___   __________
//   / ____/ __ \/   | / ___/ ___/
//  / / __/ /_/ / /| | \__ \\__ \ 
// / /_/ / ____/ ___ |___/ /__/ / 
// \____/_/   /_/  |_/____/____/  
// 
// Dean Wagman
// deanwagamn@gmail.com
// November 23rd, 2015

var argv = require('yargs')
			.command('create', 'Create an account to store', function(yargs) {
				yargs.options({
					name: {
						demand: true,
						alias: 'n',
						description: 'The name of the Account',
						type: 'string'
					},
					username: {
						demand: true,
						alias: 'u',
						description: 'The Username of the Account',
						type: 'string'
					},
					password: {
						demand: true,
						alias: 'p',
						description: 'The password of the Account',
						type: 'string'
					},
					master: {
						demand: true,
						alias: 'm',
						description: 'Your Master Password',
						type: 'string'
					}
				}).help('help')
			})
			.command('get', 'Get Account information', function(yargs) {
				yargs.options({
					name: {
						demand: true,
						alias: 'n',
						description: 'The name of the Account',
						type: 'string'
					},
					master: {
						demand: true,
						alias: 'm',
						description: 'Your Master Password',
						type: 'string'
					}
				}).help('help')
			})
			.help('help')
			.argv;
var command = argv._[0];
var storage = require('node-persist').initSync();
var crypto = require('crypto-js');

//    __________________   ___   ________________  __  ___   _____________
//   / ____/ ____/_  __/  /   | / ____/ ____/ __ \/ / / / | / /_  __/ ___/
//  / / __/ __/   / /    / /| |/ /   / /   / / / / / / /  |/ / / /  \__ \ 
// / /_/ / /___  / /    / ___ / /___/ /___/ /_/ / /_/ / /|  / / /  ___/ / 
// \____/_____/ /_/    /_/  |_\____/\____/\____/\____/_/ |_/ /_/  /____/  
function getAccounts(masterPassword) {
	
	// use getiItemSync to fetch
	var data = storage.getItemSync('accounts');
	var accounts = [];
	var bytes;

	// decrypt
	if (typeof data !== 'undefined') {
		bytes = crypto.AES.decrypt(data, masterPassword);
		accounts = JSON.parse(bytes.toString(crypto.enc.Utf8));
	}
	
	// return accounts array
	return accounts;
}

//    _____ ___ _    ________   ___   ________________  __  ___   _____________
//   / ___//   | |  / / ____/  /   | / ____/ ____/ __ \/ / / / | / /_  __/ ___/
//   \__ \/ /| | | / / __/    / /| |/ /   / /   / / / / / / /  |/ / / /  \__ \ 
//  ___/ / ___ | |/ / /___   / ___ / /___/ /___/ /_/ / /_/ / /|  / / /  ___/ / 
// /____/_/  |_|___/_____/  /_/  |_\____/\____/\____/\____/_/ |_/ /_/  /____/  
function saveAccounts(accounts, masterPassword) {
	// encrypt
	var data = crypto.AES.encrypt(JSON.stringify(accounts), masterPassword);
	
	// setItemSync
	storage.setItemSync('accounts', data.toString());

	return accounts;
}


//    __________  _________  ____________
//   / ____/ __ \/ ____/   |/_  __/ ____/
//  / /   / /_/ / __/ / /| | / / / __/   
// / /___/ _, _/ /___/ ___ |/ / / /___   
// \____/_/ |_/_____/_/  |_/_/ /_____/   
function createAccount(account, masterPassword) {
	var accounts = getAccounts(masterPassword);

	accounts.push(account);
	saveAccounts(accounts, masterPassword);

	return account;
}

//    __________________
//   / ____/ ____/_  __/
//  / / __/ __/   / /   
// / /_/ / /___  / /    
// \____/_____/ /_/                         
function getAccount(accountName, masterPassword) {
	var accounts = getAccounts(masterPassword);
	var matchedAccount;

	accounts.forEach(account => {
		if (account.name === accountName) matchedAccount = account;
	});

	return matchedAccount || null;
}

//     __  ______    _____   __
//    /  |/  /   |  /  _/ | / /
//   / /|_/ / /| |  / //  |/ / 
//  / /  / / ___ |_/ // /|  /  
// /_/  /_/_/  |_/___/_/ |_/                         
if (command === 'get') {
	var account = getAccount(argv.name, argv.master);
	if (account) {
		console.log(`Username: ${account.username} Password: ${account.password}`);
	} else {
		console.error('ACCOUNT NOT FOUND');
	}
} else if (command === 'create') {
	var newAccount = {
		name: argv.name, 
		username: argv.username,
		password: argv.password
	};
	newAccount = createAccount(newAccount, argv.master);
	if (newAccount) {
		console.log(`Account for ${newAccount.name} created. Username: ${newAccount.username} Password: ${newAccount.password}`);
	}
}


