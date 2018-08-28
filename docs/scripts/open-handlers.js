document.addEventListener('DOMContentLoaded', function() {
	/** Open login click handler */
	document.getElementById('open-login').onclick = function(e) {
		console.log('Open login ...');
		e.preventDefault();
		vxpay.openLogin().then(function() {
			console.log('Login opened')
		});
	};

	/** Open registration */
	document.getElementById('open-signup').onclick = function(e) {
		e.preventDefault();
		vxpay.openSignUp().then(function() {
			console.log('SignUp opened')
		});
	};

	/** Open registration or login */
	document.getElementById('open-login-or-signup').onclick = function(e) {
		e.preventDefault();
		vxpay.openSignUpOrLogin().then(function() {
			console.log('Opened')
		});
	};

	/** Password reset */
	document.getElementById('reset-password').onclick = function(e) {
		e.preventDefault();
		vxpay.resetPassword().then(function() {
			console.log('Opened password reset')
		});
	};

	/** Password lost */
	document.getElementById('lost-password').onclick = function(e) {
		e.preventDefault();
		vxpay.lostPassword().then(function() {
			console.log('Opened password lost')
		});
	};

	document.getElementById('open-voice-call').onclick = function(e) {
		e.preventDefault();
		vxpay.openVoiceCall().then(function() {
			console.log('Open voice call')
		});
	};

	document.getElementById('open-payment').onclick = function(e) {
		e.preventDefault();
		vxpay.openPayment().then(function() {
			console.log('Open payment')
		});
	};

	document.getElementById('open-limited').onclick = function(e) {
		e.preventDefault();
		vxpay.limitPayment().then(function() {
			console.log('Open payment (limited)')
		});
	};

	document.getElementById('open-limited').onclick = function(e) {
		e.preventDefault();
		vxpay.limitPayment().then(function() {
			console.log('Open payment (limited)');
		});
	};

	document.getElementById('open-abo').onclick = function(e) {
		e.preventDefault();
		vxpay.openAbo().then(function() {
			console.log('Open abo');
		});
	};

	document.getElementById('open-abo-trial').onclick = function(e) {
		e.preventDefault();
		vxpay.vipAboTrial().then(function() {
			console.log('Open abo (trial)');
		});
	};

	document.getElementById('open-abo-premium').onclick = function(e) {
		e.preventDefault();
		vxpay.premiumAbo().then(function() {
			console.log('Open abo (premium)');
		});
	};

	document.getElementById('open-settings').onclick = function(e) {
		e.preventDefault();
		vxpay.openSettings().then(function() {
			console.log('Open settings');
		});
	};

	document.getElementById('open-settings').onclick = function(e) {
		e.preventDefault();
		vxpay.openSettings().then(function() {
			console.log('Open settings');
		});
	};

	document.getElementById('open-avs').onclick = function(e) {
		e.preventDefault();
		vxpay.openAVS().then(function() {
			console.log('Open age verification');
		});
	};

	document.getElementById('open-avs').onclick = function(e) {
		e.preventDefault();
		vxpay.openAVS().then(function() {
			console.log('Open age verification');
		});
	};

	document.getElementById('open-promo-code').onclick = function(e) {
		e.preventDefault();
		vxpay.openPromoCode().then(function() {
			console.log('Open promo code');
		});
	};

	document.getElementById('open-scratch-card').onclick = function(e) {
		e.preventDefault();
		vxpay.openScratchCard().then(function() {
			console.log('Open scratch card');
		});
	};

	document.getElementById('open-one-click').onclick = function(e) {
		e.preventDefault();
		vxpay.openOneClick().then(function() {
			console.log('Open one click');
		});
	};

	document.getElementById('open-auto-recharge').onclick = function(e) {
		e.preventDefault();
		vxpay.openAutoReCharge().then(function() {
			console.log('Open one auto re-charge');
		});
	};

	document.getElementById('open-balance').onclick = function(e) {
		e.preventDefault();
		vxpay.openBalance().then(function() {
			console.log('Open `open balance`');
		});
	}
});