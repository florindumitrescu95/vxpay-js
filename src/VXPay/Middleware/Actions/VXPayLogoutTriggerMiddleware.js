import VXPayLogoutMessage from './../../Message/Actions/VXPayLogoutMessage'

/**
 * @param {VXPay} vxpay
 * @return {VXPay}
 * @constructor
 */
const VXPayLogoutTriggerMiddleware = (vxpay) => {
	if (!vxpay.state.hasToken) {
		vxpay.hooks.onTransferToken(() => vxpay.paymentFrame.postMessage(new VXPayLogoutMessage));
	} else {
		vxpay.paymentFrame.postMessage(new VXPayLogoutMessage);
	}

	return vxpay;
};

export default VXPayLogoutTriggerMiddleware;
