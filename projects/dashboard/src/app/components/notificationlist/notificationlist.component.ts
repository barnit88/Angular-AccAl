import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UiUtilsServiceService } from '../../utils';

@Component({
  selector: 'app-notificationlist',
  templateUrl: './notificationlist.component.html',
  styleUrls: ['./notificationlist.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class NotificationlistComponent {
  constructor(private uiTilService: UiUtilsServiceService) {
    this.uiTilService.notificationBar.subscribe(val => (this.isNotificationOpen = val));
  }
  isNotificationOpen!: boolean;

  notifications: { imgUrl: string; text: string }[] = [
    {
      imgUrl: 'assets/company-logos/slack.svg',
      text: 'Jeena Dahal role was changed from User to Workspace admin in Slack',
    },
    {
      imgUrl: 'assets/company-logos/slack.svg',
      text: 'Jeena Dahal role was changed from User to Workspace admin in Slack',
    },
    {
      imgUrl: 'assets/company-logos/slack.svg',
      text: 'Jeena Dahal role was changed from User to Workspace admin in Slack',
    },
    {
      imgUrl: 'assets/company-logos/slack.svg',
      text: 'Jeena Dahal role was changed from User to Workspace admin in Slack',
    },
    {
      imgUrl: 'assets/company-logos/slack.svg',
      text: 'Jeena Dahal role was changed from User to Workspace admin in Slack',
    },
    {
      imgUrl: 'assets/company-logos/slack.svg',
      text: 'Jeena Dahal role was changed from User to Workspace admin in Slack',
    },
    {
      imgUrl: 'assets/company-logos/slack.svg',
      text: 'Jeena Dahal role was changed from User to Workspace admin in Slack',
    },
  ];

  toggleNotification(event: Event) {
    event.stopPropagation();
    this.isNotificationOpen = !this.isNotificationOpen;
  }
}
