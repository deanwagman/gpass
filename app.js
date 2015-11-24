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
					}
				}).help('help')
			})
			.help('help')
			.argv;

var command = argv._[0];

var storage = require('node-persist');
storage.initSync();

// Create 
//		--name	
//		--username
//		--password

function createAccount(name, username, password) {
	var accounts = storage.getItemSync('accounts');
	var newAccount = {};

	if (typeof accounts === 'undefined') {
		accounts = [];
	}

	if (name && username && password) {
		newAccount = {
			name,
			username,
			password
		};
		accounts.push(newAccount);
		storage.setItemSync('accounts', accounts);

		return newAccount;
	}

	return false;
}


// Get
// 		--name

function getAccount(accountName) {
	var accounts = storage.getItemSync('accounts');
	var matchedAccount;

	if (!accountName || !accounts || typeof accounts !== 'object') {
		return console.error('There was a problem accessing accounts');
	}

	accounts.forEach(account => {
		if (account.name === accountName) matchedAccount = account;
	});

	return matchedAccount || null;
}

if (command === 'get') {
	var account = getAccount(argv.name);
	if (account) console.log(`Username: ${account.username} Password: ${account.password}`);
} else if (command === 'create') {
	var newAccount = createAccount(argv.name, argv.username, argv.password);
	if (newAccount) console.log(`Account for ${newAccount.name} created. Username: ${newAccount.username} Password: ${newAccount.password}`);
}


