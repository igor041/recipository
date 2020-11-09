import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '@root/app/auth/_services';
import { LoggerService } from '@root/app/services/logger.service';
import { MessageService } from '@root/app/services/message.service';
import { AppService } from 'src/app/app.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {
  public caption: string = "sign-in";
  public environment = environment;

  constructor(public appService: AppService,
    private router: Router,
    private accountService: AccountService,
    private messageService: MessageService,
    private logger: LoggerService ) { }

  ngOnInit() {
    if(this.accountService.userValue){ 
      this.caption = this.accountService.userValue.lastName + ", " + this.accountService.userValue.firstName;
    }
    // Subscribe to messages
    this.messageService.onMessage().subscribe(
      e => {
        this.logger.log("UserMenuComponent.onMessage() event handler triggered! e: " + JSON.stringify(e))
        let login = JSON.parse(e.text);
        this.caption = login.lastName + ", " + login.firstName;
      },
    );
  }

  public signOut() {
    this.logger.log("UserMenuComponent.signOut");
    this.accountService.logout();
  }

  navigateToLogin() {
    if (!this.accountService.userValue) {
      this.router.navigate(['/pages/login']);
    }
  }
}
