import VXPayMessage from './../VXPayMessage'

export default class VXPayViewReadyMessage extends VXPayMessage {
	constructor() {
		super(VXPayMessage.TYPE_VIEW_READY);
	}
}
