import { Component, inject } from '@angular/core';
//example.component.ts
import { MatDialog } from '@angular/material/dialog';
import { HelpPopupComponent } from '../../components/help-popup/help-popup.component';
import { DomSanitizer } from '@angular/platform-browser';

export type HelpObject = {
  category: string; // top level categories: Accally Management, User Management. etc
  title: string; // title of the help
  description: string; // explanation of what help does
  tangoUrl: string; // full url of tango link
  iconName: string; // material icon name from material library
  index: string[]; // list of keywords we want to match with search.
};
@Component({
  selector: 'app-help',
  templateUrl: './help-page.component.html',
  styleUrls: ['./help-page.component.scss'],
})
export class HelpPageComponent {
  private dialog = inject(MatDialog);
  private sanitizer = inject(DomSanitizer);
  helpObjects: HelpObject[] = [
    {
      category: 'Accally Management',
      title: 'SignUp, Login and Logout',
      description: 'Click here to learn more about how to signup, login and logout from Accally Ecosystem.',
      tangoUrl: 'https://app.tango.us/app/embed/d7b8afb5-1a13-43c8-a873-b4afe9c145ba',
      iconName: 'login',
      index: [],
    },
    {
      category: 'Accally Management',
      title: 'Add/Remove Integrations',
      description: 'Click here to learn more about how to integrate various platforms into accally.',
      tangoUrl: 'https://app.tango.us/app/embed/866b15b5df4242928dd5ee80302b99d7',
      iconName: 'post_add',
      index: [],
    },
    {
      category: 'User Management',
      title: 'User Operation',
      description: 'Click here to learn more about user provisioning',
      tangoUrl: 'https://app.tango.us/app/embed/a9768a34430f4e00910d41bc388d42c4',
      iconName: 'manage_accounts',
      index: [],
    },
    {
      category: 'Accally Help',
      title: 'Add new user, remove user and change roles',
      description: 'Click here to learn more about how to view access reviews and reports.',
      tangoUrl: 'https://app.tango.us/app/embed/12e9408f34d5466cacb3ab7e97b67efd',
      iconName: 'rate_review',
      index: [],
    },
  ];

  openDialog(help: HelpObject) {
    const iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(help.tangoUrl);
    this.dialog.open(HelpPopupComponent, {
      data: {
        url: iframeUrl,
      },
    });
  }
}
