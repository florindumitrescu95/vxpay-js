import VXPayPaymentFrame from './../../Dom/Frame/VXPayPaymentFrame'
import VXPayPaymentTab   from './../../Dom/Frame/VXPayPaymentTab'
import VXPayLogger       from './../../VXPayLogger'

/**
 * @todo function seems a bit too long, maybe refactor in future?
 * @param {VXPay} vxpay
 * @param {Function} resolve
 * @param {Boolean} load
 * @return {Function}
 * @constructor
 */
const VXPayInitPaymentMiddleware = (vxpay, resolve, load = true) => {
	vxpay.logger.log('VXPayInitPaymentMiddleware()');

	// check already initialized
	if (vxpay.state.isContentLoaded) {
		vxpay.logger.log('VXPayInitPaymentMiddleware() - already loaded, resolve ...');
		return resolve(vxpay);
	}

	// or in progress
	if (vxpay.state.isFrameInProgress && !load) {
		vxpay.logger.log('VXPayInitPaymentMiddleware() - already in progress, resolve ...');
		return resolve(vxpay);
	}

	// tab or frame?
	vxpay.state.isFrameInProgress = true;
	if (!vxpay.hasOwnProperty('_paymentFrame')) {
		vxpay._paymentFrame = vxpay.config.enableTab
			? new VXPayPaymentTab(vxpay.window.document, VXPayPaymentTab.NAME, vxpay.config)
			: new VXPayPaymentFrame(vxpay.window.document, vxpay.config.getPaymentFrameUrl(), VXPayPaymentFrame.NAME);

		// do we need logging?
		if (vxpay.config.logging) {
			vxpay._paymentFrame
				.hooks
				.onAny(msg => vxpay.logger.log(VXPayLogger.LOG_INCOMING, msg))
				.onBeforeSend(msg => vxpay.logger.log(VXPayLogger.LOG_OUTGOING, msg));
		}
	}

	if (!vxpay._paymentFrame.loaded) {
		// set resolve hook
		vxpay._paymentFrame
			.hooks
			// state updates
			.onIframeReady(vxpay.state.markFrameReady.bind(vxpay.state))
			.onContentLoaded(vxpay.state.markContentLoaded.bind(vxpay.state))
			.onTransferToken(vxpay.state.markHasToken.bind(vxpay.state))
			// functional hooks
			.onTransferToken(vxpay.config.setTokenFromMessage.bind(vxpay.config))
			.onFlowChange(vxpay.config.updateFlow.bind(vxpay.config))
			// show frame and send isVisible
			.onViewReady(vxpay._paymentFrame.setVisible.bind(vxpay._paymentFrame))
			.onViewReady(vxpay._paymentFrame.show.bind(vxpay._paymentFrame))
			.onSuccess(vxpay._paymentFrame.hide.bind(vxpay._paymentFrame))
			.onClose(vxpay._paymentFrame.hide.bind(vxpay._paymentFrame))
			.onContentLoaded(() => resolve(vxpay));

		// trigger load if not tab
		if (!vxpay.config.enableTab && load) {
			vxpay.logger.log('VXPayInitPaymentMiddleware() - not loaded yet, trigger load');
			vxpay._paymentFrame.url = vxpay.config.getPaymentFrameUrl();
			vxpay._paymentFrame.triggerLoad();
		} else {
			// resolve promise
			resolve(vxpay);
		}
	}
};

export default VXPayInitPaymentMiddleware;
