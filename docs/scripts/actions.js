isLoggedInAction = function() {
	vxpay.isLoggedIn()
		.then(function(msg) {
			confirm('Logged in: ' + (msg.loggedIn === true ? 'YES' : 'NO'))
		})
};

getAvsStatus = function() {
	vxpay.getAVSStatus()
		.then(function(msg) {
			confirm('AVS status: ' + (msg.status.fsk18 === true ? 'FSK18' : '<unknown>'))
		})
};

getBalance = function() {
	vxpay.getBalance()
		.then(function(msg) {
			confirm('Current balance: ' + msg.balance.toString())
		});
};

getAbos = function() {
	vxpay.getActiveAbos()
		.then(function(msg) {
			var abos = '';

			msg.abos.forEach(function(abo) {
				abos += abo.name + ' (' + abo.amount + '), ';
			});

			confirm('Active abos: ' + abos)
		});
};

logout = function() {
	vxpay.logout().then(function(msg) {
		alert('User logged out');
	});
};