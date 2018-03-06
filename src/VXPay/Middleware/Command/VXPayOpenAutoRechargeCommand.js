import VXPayFlow          from './../../Config/VXPayFlow'
import VXPayPaymentRoutes from './../../Config/VXPayPaymentRoutes'

class VXPayOpenAutoRechargeCommand {
	/**
	 * @param {VXPay} vxpay
	 * @return {VXPay}
	 */
	static run(vxpay) {
		vxpay.logger.log('VXPayOpenAutoRechargeCommand()');

		vxpay.paymentFrame
			.then(frame => frame
				.initSession()
				.updateUI(vxpay.config.modalConfig.getOptions())
				.sendOptions(VXPayOpenAutoRechargeCommand.PARAMS)
				.sendAdditionalOptions(vxpay.config.getAdditionalOptions())
				.changeRoute(VXPayPaymentRoutes.AUTO_RECHARGE));

		return vxpay;
	}
}

VXPayOpenAutoRechargeCommand.PARAMS = {
	flow: VXPayFlow.AUTO_RECHARGE,
	autoRechargeData: {
		data: null
	}
};

export default VXPayOpenAutoRechargeCommand;
