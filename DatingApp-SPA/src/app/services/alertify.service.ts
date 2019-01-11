import { Injectable } from '@angular/core';
declare let alertify: any;

@Injectable({
  providedIn: 'root'
})
export class AlertifyService {

  constructor() { }

  public confirm(message: string, okCallBack: () => any) {
    alertify.confirm(message, function(e: any) {
      if (e) {
        okCallBack();
      } else {}
    });
  }

  public success(message: string) {
    alertify.success(message);
  }

  public warning(message: string) {
    alertify.warning(message);
  }

  public error(message: string) {
    alertify.error(message);
  }

  public message(message: string) {
    alertify.message(message);
  }
}
