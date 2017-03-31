/**
 * This service handles various aspects of interaction with the DOM. It defines several
 * DOM Observables that can be observed, such as bodyClick$ and bodyKeypress$.
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class DomService {
    private _bodyClick$ = Observable.fromEvent(document.body, 'click').subscribe(e => this.bodyClick$.next(e));
    bodyClick$ = new Subject();
    
    private _bodyKeypress$ = Observable.fromEvent(document.body, 'keypress').subscribe(e => this.bodyKeypress$.next(e));
    bodyKeypress$ = new Subject();
    bodyEnterPress$ = this.bodyKeypress$.filter(event => event['key'] === 'Enter');

    constructor() { }

    /**
     * Fires a 'next' event from a specified DOM observable for a specified target element.
     * Example: fire('bodyClick', document.getElementsByClassName('dom-mask')[0])
     */
    fire(observableName: string, targetElement) {
        this[`${observableName}$`].next({ target: targetElement });
    }

    /**
     * Calculates DOM element offset (px) from top and left of viewport
     */
    cumulativeOffset(nativeDomElement): { top: number, left: number } {
        let top = 0;
        let left = 0;
        do {
            top += nativeDomElement.offsetTop || 0;
            left += nativeDomElement.offsetLeft || 0;
            nativeDomElement = nativeDomElement.offsetParent;
        } while (nativeDomElement);

        return { top: top, left: left };
    }

    /**
     * Fixes the scroll to return an element into visibility if it is too low.
     * @param innerElement The inner native-element that possibly needs a scroll-fix.
     * @param scrollElement The native-element controlling the scroll.
     */
    scrollToElement(innerElement, scrollElement): number {
        if (!innerElement || !scrollElement) {
            return null;
        }
        const SCROLL_PADDING_IN_PX = 20;
        const visibleTop = this.cumulativeOffset(scrollElement).top + scrollElement.scrollTop;
        const visibleBottom = visibleTop + scrollElement.clientHeight;
        const innerElementTop = this.cumulativeOffset(innerElement).top;
        const innerElementBottom = innerElementTop + innerElement.clientHeight;

        // correct if element is too low
        let bottomCorrection = innerElementBottom - visibleBottom;
        if (bottomCorrection > 0) {
            let fix = bottomCorrection + SCROLL_PADDING_IN_PX;
            scrollElement.scrollTop = fix;
            return fix;
        }

        // correct if element is too high
        let topCorrection = visibleTop - innerElementTop;
        if (topCorrection > 0) {
            let fix = topCorrection + SCROLL_PADDING_IN_PX;
            scrollElement.scrollTop -= fix;
            return fix;
        }
    }

    /**
     * Resets the scroll of a given element to 0
     */
    resetScroll(nativeDomElement) {
        if (nativeDomElement) nativeDomElement['scrollTop'] = 0;
    }
}
