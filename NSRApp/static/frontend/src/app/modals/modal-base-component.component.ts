export class ModalBaseComponent {

    modalConfirm: Function;
    modalClose: Function;
    registerBtn: Function;
    disableBtn: Function;
    labelBtn: Function;
    args: any;

    constructor(injector) {
        this.args = injector.get('args');
        this.modalConfirm = injector.get('modalConfirm');
        this.modalClose = injector.get('modalClose');
        this.registerBtn = injector.get('registerBtn');
        this.disableBtn = injector.get('disableBtn');
        this.labelBtn = injector.get('labelBtn');
    }
}