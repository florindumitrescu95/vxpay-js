import VXPayEnvironment          from './VXPayEnvironment'
import VXPayLanguage             from './VXPayLanguage'
import VXPayValidator            from './VXPayValidator'
import VXPayFlow                 from './Config/VXPayFlow'
import VXPayIframe               from './Dom/VXPayIframe'
import VXPayModalConfig          from './Config/VXPayModalConfig'
import VXPayUrlHelper            from './VXPayUrlHelper'
import VXPayUserAgentHelper      from './VXPayUserAgentHelper'
import VXPayConfigChangedMessage from './Message/VXPayConfigChangedMessage'

class VXPayConfig {
	/**
	 * @param {Window} window
	 * @param {VXPayModalConfig} modalConfig
	 */
	constructor(window, modalConfig = undefined) {
		this._env      = VXPayEnvironment.getDefault();
		this._logging  = false;
		this._flow     = VXPayFlow.getDefault();
		this._language = VXPayLanguage.getDefault();
		this._urls     = {
			abg:     VXPayConfig.ABG_DEFAULT.replace('{language}', this._language),
			privacy: VXPayConfig.PRIVACY_DEFAULT.replace('{language}', this._language),
			ruri:    '',
			suri:    '',
			purl:    ''
		};

		this._pfm        = '';
		this._enableTab  = (new VXPayUserAgentHelper(window.navigator.userAgent || '')).isMobile();
		this._host       = '';
		this._token      = '';
		this._promoCode  = '';
		this._wmId       = '';
		this._wmSubRef   = '';
		this._wmToken    = '';
		this._adtv       = '';
		this._subRef     = '';
		this._apiVersion = 3;

		this._modalConfig = typeof modalConfig === 'undefined'
			? new VXPayModalConfig()
			: modalConfig;

		this._window = window;
		this._helper = new VXPayUrlHelper(window.URL);
	}

	/**
	 * @return {string}
	 */
	getCurrentOrigin() {
		return this._window.location.protocol + '//' + this._window.location.host;
	}

	/**
	 * @return {string}
	 */
	get ruri() {
		return this._urls.ruri;
	}

	/**
	 * @param value
	 */
	set ruri(value) {
		this._urls.ruri = value;
	}

	/**
	 * @return {string}
	 */
	get suri() {
		return this._urls.suri;
	}

	/**
	 * @param value
	 */
	set suri(value) {
		this._urls.suri = value;
	}

	/**
	 * @return {string}
	 */
	get purl() {
		return this._urls.purl;
	}

	/**
	 * @param value
	 */
	set purl(value) {
		this._urls.purl = value;
	}

	/**
	 * @return {Window|*}
	 */
	get window() {
		return this._window;
	}

	/**
	 * @example https://www.visit-x.net/VXPAY-V3/?pfm=1502&lang=en&environment=vxone&flow=login&sview=&lazy=1&mc[login]=1&mc[showHeader]=1&mc[showTeaser]=1&mc[showFooter]=1&mc[neutralHeader]=1&mc[teaserBonus]=0&mc[support]=1&mc[showOAuth]=1&mc[showNL]=1&mc[showThank]=0&mc[showLogo]=1&mc[showTeaserBar]=1&mc[parentInFrame]=0
	 * @return {string}
	 */
	getPaymentFrameUrl() {
		return this._helper.generate(
			VXPayIframe.ORIGIN_VX + '/VXPAY-V' + this._apiVersion + '/',
			this.getOptions(),
			this._modalConfig.getOptions()
		);
	}

	/**
	 * @return {Object}
	 */
	getOptions() {
		return {
			agbUrl:      this.abgUrl,
			privacyUrl:  this.privacyUrl,
			environment: this._env,
			flow:        this._flow,
			lang:        this._language,
			pfm:         this._pfm,
			w:           this._wmId,
			ws:          this._wmSubRef,
			wt:          this._wmToken,
			adtv:        this._adtv,
			sub:         this._subRef,
			enableTab:   this._enableTab ? VXPayModalConfig.YES : VXPayModalConfig.NO,
			option:      '',
			pc:          this._promoCode,
			tt:          this._token,
			ruri:        this._urls.ruri,
			host:        this._host
		};
	}

	/**
	 * @return {Object}
	 */
	getAdditionalOptions() {
		const urls = {
			ref:   this._wmId,
			ruri:  this._urls.ruri,
			surl:  this._urls.suri,
			aurl:  this.abgUrl,
			prurl: this.privacyUrl,
			purl:  this._urls.purl
		};

		return Object.assign(
			{},
			urls,
			this.modalConfig.getOptions()
		);
	}

	/**
	 * @return {String}
	 */
	get abgUrl() {
		return this._urls.abg;
	}

	/**
	 * @param {String} url
	 */
	set abgUrl(url) {
		if (!VXPayValidator.isUrl(url)) {
			throw new Error('Invalid URL provided: ' + url);
		}

		this._urls.abg = url;
	}

	/**
	 * @return {String}
	 */
	get privacyUrl() {
		return this._urls.privacy;
	}

	/**
	 * @param {String} url
	 */
	set privacyUrl(url) {
		if (!VXPayValidator.isUrl(url)) {
			throw new Error('Invalid URL provided: ' + url);
		}

		this._urls.privacy = url;
	}

	/**
	 * @return {String}
	 */
	get env() {
		return this._env;
	}

	/**
	 * @param {String} value
	 */
	set env(value) {
		if (!VXPayValidator.isEnvironmentSupported(value)) {
			throw new TypeError('Environment ' + value + ' is not supported. Please select one of ' + VXPayEnvironment.getAvailable())
		}

		this._env = value;
	}

	/**
	 * @return {Boolean}
	 */
	get logging() {
		return this._logging;
	}

	/**
	 * @param {Boolean} value
	 */
	set logging(value) {
		this._logging = value;
	}

	/**
	 * @return {String}
	 */
	get language() {
		return this._language.toUpperCase();
	}

	/**
	 * @param {String} value
	 */
	set language(value) {
		if (!VXPayValidator.isLanguageSupported(value)) {
			const msg = 'Unsupported language: ' + value.toString() + '. Allowed: ' + VXPayLanguage.getAvailable().join(', ');
			throw new TypeError(msg);
		}

		this._language = value;

		// send post message to current window indicating config has changed
		this._window.postMessage(
			new VXPayConfigChangedMessage(this.toString()).toString(),
			this._window.location.origin
		);
	}

	/**
	 * @return {String}
	 */
	get flow() {
		return this._flow;
	}

	/**
	 * @param {String} value
	 * @see VXPayFlow
	 */
	set flow(value) {
		if (!VXPayValidator.isFlowAllowed(value)) {
			const msg = 'Flow not allowed: ' + value.toString()
				+ '. Select one of: ' + VXPayFlow.getAllowed().join(', ');
			throw new TypeError(msg);
		}

		this._flow = value;
	}

	/**
	 * @return {String|int}
	 */
	get host() {
		return this._host;
	}

	/**
	 * @param {String|int} value
	 */
	set host(value) {
		this._host = value;
	}

	/**
	 * @return {String}
	 */
	get token() {
		return this._token;
	}

	/**
	 * @param {String} value
	 */
	set token(value) {
		this._token = value;
	}

	/**
	 * @param {VXPayTransferTokenMessage} message
	 */
	setTokenFromMessage(message) {
		this._token = message.token;
	}

	/**
	 * @return {String}
	 */
	get promoCode() {
		return this._promoCode;
	}

	/**
	 * @param {String} value
	 */
	set promoCode(value) {
		this._promoCode = value;
	}

	/**
	 * @return {String|int}
	 */
	get wmId() {
		return this._wmId;
	}

	/**
	 * @param {String|int} value
	 */
	set wmId(value) {
		this._wmId = value;
	}

	/**
	 * @return {String|int}
	 */
	get wmSubRef() {
		return this._wmSubRef;
	}

	/**
	 * @param {String|int} value
	 */
	set wmSubRef(value) {
		this._wmSubRef = value;
	}

	/**
	 * @return {String}
	 */
	get wmToken() {
		return this._wmToken;
	}

	/**
	 * @param {String} value
	 */
	set wmToken(value) {
		this._wmToken = value;
	}

	/**
	 * @return {*}
	 */
	get adtv() {
		return this._adtv;
	}

	/**
	 * @param value
	 */
	set adtv(value) {
		this._adtv = value;
	}

	/**
	 * @return {*}
	 */
	get subRef() {
		return this._subRef;
	}

	/**
	 * @param value
	 */
	set subRef(value) {
		this._subRef = value;
	}

	/**
	 * @return {number}
	 */
	get apiVersion() {
		return this._apiVersion;
	}

	/**
	 * @param {number} value
	 */
	set apiVersion(value) {
		this._apiVersion = parseInt(value, 10);
	}

	/**
	 * @return {VXPayModalConfig}
	 */
	get modalConfig() {
		return this._modalConfig;
	}

	/**
	 * @param {VXPayModalConfig} value
	 */
	set modalConfig(value) {
		if (!(value instanceof VXPayModalConfig)) {
			throw new TypeError('Modal config value should be instance of VXPayModalConfig!');
		}

		this._modalConfig = value;
	}

	/**
	 * @return {string}
	 */
	get pfm() {
		return this._pfm;
	}

	/**
	 * @param {string} value
	 */
	set pfm(value) {
		this._pfm = value;
	}

	/**
	 * @return {boolean}
	 */
	get enableTab() {
		return this._enableTab;
	}

	/**
	 * @param {boolean} value
	 */
	set enableTab(value) {
		this._enableTab = value;
	}

	/**
	 * @param {Object} options
	 */
	merge(options = {}) {
		const that = this;

		Object
			.keys(that.getOptions())
			.forEach(key => {
				const valid = options.hasOwnProperty(key) && typeof options[key] !== 'undefined';

				// map
				if (key === 'lang' && options.hasOwnProperty('language')) {
					that[key] = options['language'];
				}
				// normal flow
				else if (valid) {
					that[key] = options[key];
				}
			});
	}

	/**
	 * @param {VXPayFlowChangedHookMessage} message
	 */
	updateFlow(message) {
		this._flow = message.newFlow;
	}

	/**
	 * @return {string}
	 */
	toString() {
		return JSON.stringify(
			Object.assign(
				{},
				this.getOptions(),
				{modalConfig: this.modalConfig.getOptions()}
			)
		);
	}
}

VXPayConfig.ABG_DEFAULT     = 'https://www.visit-x.net/CAMS/{language}/Info/Zentrum.html?submod=AGB&track=Account';
VXPayConfig.PRIVACY_DEFAULT = 'https://www.visit-x.net/CAMS/{language}/Info/Zentrum.html?submod=Datenschutz&track=Index';

export default VXPayConfig;
