import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor() { 
    if(!environment.production){
      this.log("LoggerService started. DEBUG=true.");
    }else{
      this.log("LoggerService started. DEBUG=false. No logging will be performed.");
    }
  }

  log(message: any) {
    if (!environment.production) {
      console.log("**logger**: " + message);
    }
  }
}
