/**
 * This class implements the app's CSRF strategy. The function 'configureRequest'
 * will be executed by Angular's XHR-backend every time an HTTP request is generated.
 */
import { __platform_browser_private__ } from '@angular/platform-browser';

class CSRFStrategy {
    private excludedUrls = ['iid.googleapis.com'];

    constructor() { }

    configureRequest(req) {
        let addHeader = true;
        this.excludedUrls.forEach(url => {
            if (req.url.includes(url)) {
                addHeader = false;
            }
        });
        const csrfToken = __platform_browser_private__.getDOM().getCookie('csrftoken');
        if (csrfToken && addHeader) {
            req.headers.set('X-CSRFToken', csrfToken);
        }
    };
}

export function csrfFactory() {
    return new CSRFStrategy();
}
