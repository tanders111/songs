import { ErrorHandler, Injectable, Injector, NgZone } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

//import { UtilService } from '@shared/util/util.service';
//import { HandledError } from './handled-error';


@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

    constructor(
        private injector: Injector,
    ) { }

    handleError(error: Error | HttpErrorResponse) {

        //let handled = HandledError.fromError(error);

        //console.error(handled);

        //if (handled.innerError) console.log('inner error', handled.innerError);

        //const util = this.injector.get(UtilService);
        //util.displayError(handled);

        console.error('unhandled error', error);
        let msg = error.message || '';
        alert('unhandled error ' + msg);
        const router = this.injector.get(Router);

        const zone = this.injector.get(NgZone);
        zone.run(() => router.navigate(['/']));
    }
}