import VXPayPaymentHooksConfig from './../../Config/VXPayPaymentHooksConfig'
import VXPayEventListener      from './../../Event/VXPayEventListener'
import VXPayIframe             from './../VXPayIframe'
import VXPayHookRouter         from './../../Message/Hooks/VXPayHookRouter'

/**
 * @link https://www.npmjs.com/package/es6-interface
 */
class VXPayPaymentTab {
	/**
	 * @param {Document} document
	 * @param {String} name
	 * @param {VXPayConfig} config
	 * @param {VXPayPaymentHooksConfig} hooks
	 */
	constructor(document, name, config, hooks) {
		this._document  = document;
		this._loaded    = false;
		this._name      = name;
		this._config    = config;
		this._hooks = hooks;
		this._route     = VXPayPaymentTab.DEFAULT_ROUTE;
		this._listening = false;
	}

	/**
	 * @return {Document}
	 */
	get document() {
		return this._document;
	}

	/**
	 * @return {String}
	 */
	get name() {
		return this._name;
	}

	/**
	 * @return {VXPayConfig}
	 */
	get config() {
		return this._config;
	}

	/**
	 * @return {boolean}
	 */
	get loaded() {
		return this._loaded;
	}

	/**
	 * @return {string}
	 */
	get route() {
		return this._route;
	}

	/**
	 * Open the window
	 */
	triggerLoad() {
		this.getNewTab()
			.then(this.startListening.bind(this))
	}

	/**
	 * @return {Promise<Window>}
	 */
	getNewTab() {
		const that = this,
		      url  = this._config.getPaymentFrameUrl() + '#' + this._route;

		return new Promise(resolve => {
			if (that.hasOwnProperty('_window') && !that._window.closed) {
				resolve(that._window);
			}

			that._window = that._document.defaultView.open(url, that._name);
			resolve(that._window);
		});
	}

	/**
	 * @return {VXPayPaymentHooksConfig}
	 */
	get hooks() {
		return this._hooks;
	}

	/**
	 * @param {Event} event
	 * @return {boolean}
	 * @private
	 */
	_routeHooks(event) {
		return VXPayHookRouter(this._hooks, event);
	}

	/**
	 * listen for incoming messages
	 * @param {Window} window
	 * @return {Window}
	 */
	startListening(window) {
		if (this._listening) {
			console.log('Already listening ... skip');
			return this._document.defaultView;
		}

		this._listening = true;

		VXPayEventListener.addEvent(
			VXPayIframe.EVENT_MESSAGE,
			this._document.defaultView,
			this._routeHooks.bind(this)
		);

		VXPayEventListener.addEvent(
			VXPayIframe.EVENT_UNLOAD,
			this._document.defaultView,
			this.stopListening.bind(this)
		);

		return this._document.defaultView;
	}

	/**
	 * Remove listeners
	 * @return {VXPayPaymentTab}
	 */
	stopListening() {
		VXPayEventListener.removeEvent(
			VXPayIframe.EVENT_MESSAGE,
			this._document.defaultView,
			this._routeHooks.bind(this)
		);

		VXPayEventListener.removeEvent(
			VXPayIframe.EVENT_UNLOAD,
			this._document.defaultView,
			this.stopListening.bind(this)
		);

		return this;
	}

	/**
	 * @return {VXPayPaymentTab}
	 */
	unload() {
		this.getNewTab().then(tab => tab.close());
		return this;
	}

	/**
	 * @param {Object} options
	 * @return {VXPayPaymentTab}
	 */
	sendOptions(options = {}) {
		this._config.merge(options);
		return this;
	}

	/**
	 * @param {Object} options
	 * @return {VXPayPaymentTab}
	 */
	sendAdditionalOptions(options = {}) {
		this._config.merge(options);
		return this;
	}

	/**
	 * @param {Object} options
	 * @return {VXPayPaymentTab}
	 */
	updateUI(options = {}) {
		this.config.modalConfig.merge(options);
		return this;
	}

	/**
	 * Not really much to do here, but should match the interface of {VXPayPaymentFrame}
	 *
	 * [@param {String|undefined} token]
	 * @return {VXPayPaymentTab}
	 */
	initSession() {
		return this;
	}

	/**
	 * @param {String} route
	 * @return {VXPayPaymentTab}
	 */
	changeRoute(route = VXPayPaymentTab.DEFAULT_ROUTE) {
		this._route = route;
		return this;
	}

	/**
	 * [@param {VXPayViewReadyMessage} message]
	 */
	setVisible() {
		this.triggerLoad();
	}

	/**
	 * @return {VXPayPaymentTab}
	 */
	show() {
		this.triggerLoad();
		return this;
	}

	/**
	 * @return {VXPayPaymentTab}
	 */
	hide() {
		if (this._window && !this._window.closed) {
			this._window.close();
		}

		return this;
	}
}

VXPayPaymentTab.NAME = 'vx-payment-tab-payment';

VXPayPaymentTab.DEFAULT_ROUTE = '/';

export default VXPayPaymentTab;
