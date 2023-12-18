import { Injectable, ErrorHandler, Injector } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private toastr!: ToastrService;

  constructor(private injector: Injector) {}

  private getToastr(): ToastrService {
    if (!this.toastr) {
      this.toastr = this.injector.get(ToastrService);
    }
    return this.toastr;
  }

  handleError(error: any): void {
    // if it is in our vocabulary, show it to the user, else console it.
    // const toastr = this.getToastr();
    // toastr.error(error);

    console.log(error);
  }
}
