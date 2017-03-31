import { Injectable } from '@angular/core';

@Injectable()
export class PrintService {

    constructor() { }

    // scss file: scss/_print.scss

    print(type){
        document.body.classList.add(`print-${type}`);
        window.print();
        document.body.classList.remove(`print-${type}`);
    }

}
