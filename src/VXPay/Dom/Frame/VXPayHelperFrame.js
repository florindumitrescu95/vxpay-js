import VXPayIframe                  from './../VXPayIframe'
import VXPayHasSessionCookieMessage from './../../Message/VXPayHasSessionCookieMessage'
import VXPayMessageFactory          from './../../Message/VXPayMessageFactory'
import VXPayEventListener           from './../../Event/VXPayEventListener'
import VXPayHelperHooksConfig       from './../../Config/VXPayHelperHooksConfig'
import VXPayHooksConfig             from './../../Config/VXPayHooksConfig'

class VXPayHelperFrame extends VXPayIframe {
	/**
	 * @param {Document} document
	 * @param {String} url
	 * @param {String} id
	 * @param {CSSStyleDeclaration} style
	 */
	constructor(document, url, id = VXPayHelperFrame.NAME, style = VXPayHelperFrame.STYLE_DEFAULT) {
		// init the frame
		super(document, url, id, style);
		this._cookieMsg = null;
		this._frame.name = 'vxpay-helper';
		this._hooks = new VXPayHelperHooksConfig();
	}

	/**
	 * @param {Function} resolve
	 * @param {Function} reject
	 * @param {MessageEvent} event
	 * @return {boolean}
	 * @private
	 */
	_cookieMessageHandler(resolve, reject, event) {
		// origin check
		if (event.origin && VXPayIframe.ORIGIN_VX.indexOf(event.origin) === -1) {
			reject('Event origin does not match: ' + event.origin);
		}

		try {
			this._cookieMsg = VXPayMessageFactory.fromJson(event.data);
		} catch (e) {
			this._cookieMsg = new VXPayHasSessionCookieMessage();
		}

		// trigger hook
		this._hooks.trigger(VXPayHooksConfig.ON_ANY, [this._cookieMsg]);

		// otherwise - not logged in
		resolve(this._cookieMsg);
	}

	/**
	 * @return {Promise<VXPayHasSessionCookieMessage>}
	 */
	getLoginCookie() {
		return new Promise((resolve, reject) => {
			if (null !== this._cookieMsg) {
				resolve(this._cookieMsg);
			}

			VXPayEventListener.addEvent(
				VXPayIframe.EVENT_MESSAGE,
				this._frame.ownerDocument.defaultView,
				this._cookieMessageHandler.bind(this, resolve, reject)
			)
		})
	}

	_markLoaded() {
		super._markLoaded();
		this._hooks.trigger(VXPayHelperHooksConfig.ON_LOAD);
	}

	/**
	 * Override to add a before send hook
	 * @param {String|VXPayMessage} message
	 * @param {String} origin
	 */
	postMessage(message, origin = '*') {
		this._hooks.trigger(VXPayHelperHooksConfig.ON_BEFORE_SEND, [message]);
		super.postMessage(message, origin);
	}

	triggerLoad() {
		if (this._loaded) {
			return;
		}

		this._frame
			.ownerDocument
			.getElementsByTagName('body')
			.item(0)
			.appendChild(this._frame);
	}

	/**
	 * @return {VXPayHelperHooksConfig}
	 */
	get hooks() {
		return this._hooks;
	}
}

VXPayHelperFrame.STYLE_DEFAULT = {display: 'none'};

VXPayHelperFrame.NAME = 'vx-helper-frame-payment';

export default VXPayHelperFrame
