export default class VXPayState {
	constructor() {
		this._isFrameReady = false;
		this._token = undefined;
		this._isContentLoaded = false;
		this._isSessionInitialized = false;
		this._initializedWithConfig = undefined;
	}

	/**
	 * @param {VXPayConfig} config
	 * @return {boolean}
	 */
	isInitialiedWith(config) {
		return typeof this._initializedWithConfig !== 'undefined'
			&& config.toString() === this._initializedWithConfig;
	}

	/**
	 * @param {VXPayConfig} value
	 */
	set initializedWithConfig(value) {
		this._initializedWithConfig = value.toString();
	}

	/**
	 * @return {boolean}
	 */
	get isFrameReady() {
		return this._isFrameReady;
	}

	/**
	 * @param {boolean} value
	 */
	set isFrameReady(value) {
		this._isFrameReady = value;
	}

	/**
	 * @return {boolean}
	 */
	get hasToken() {
		return typeof this._token !== 'undefined';
	}

	/**
	 * @return {boolean}
	 */
	get isContentLoaded() {
		return this._isContentLoaded;
	}

	/**
	 * @param {boolean} value
	 */
	set isContentLoaded(value) {
		this._isContentLoaded = value;
	}

	/**
	 * @return {boolean}
	 */
	get isSessionInitialized() {
		return this._isSessionInitialized;
	}

	/**
	 * @param {boolean} value
	 */
	set isSessionInitialized(value) {
		this._isSessionInitialized = value;
	}

	/**
	 * @return {void}
	 */
	markFrameReady() {
		this._isFrameReady = true;
	}

	/**
	 * @return {void}
	 */
	markContentLoaded() {
		this._isContentLoaded = true;
	}

	/**
	 * @param {VXPayTransferTokenMessage} msg
	 */
	markHasToken(msg) {
		this._token = msg;
	}

	/**
	 * @return {undefined|VXPayTransferTokenMessage}
	 */
	get transferToken() {
		return this._token;
	}

	markSessionInitialized() {
		this._isSessionInitialized = true;
	}
}