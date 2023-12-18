import { Component } from '@angular/core';
import { ICard } from '../../components/card/card.component';
import { TabItem } from '../../components/tabs/tab.interfaace';
import { FormField } from '../../components/form-component/form-component.component';

@Component({
  selector: 'app-access-review',
  templateUrl: './access-review-page.component.html',
  styleUrls: ['./access-review-page.component.scss'],
})
export class AccessReviewPageComponent {
  public tabItems: TabItem[] = [
    {
      item: 'Review Report',
      active: true,
      title: 'Review Report',
      detail: 'Please enter details accordingly.',
    },
    {
      item: 'Results',
      active: false,
      title: 'Results',
      detail: 'Review all the results from here.',
    },
  ];

  fieldJson: FormField[] = [
    {
      type: 'select',
      subtype: 'select',
      key: 'review-scope',
      label: 'Review Scope',
      value: '',
      placeholder: 'Select',
      data: [
        { label: 'Slack', value: 'Slack' },
        { label: 'Github', value: 'Github' },
        { label: 'Teams', value: 'Teams' },
        { label: 'Jira', value: 'Jira' },
        { label: 'Clockify', value: 'Clockify' },
        { label: 'Azure', value: 'Azure' },
      ],
      validators: {
        required: true,
      },
    },
    {
      type: 'date',
      subtype: 'daterangewithchips',
      key: { start: 'StartDate', end: 'EndDate' },
      label: 'Review by (Date Range)',
      value: { start: '', end: '' },
      validators: {
        required: true,
      },
      placeholder: { start: 'Select Date Range', end: '' },
      errorMessage: { start: 'Start Date is required.', end: 'End date is required.' },
    },
    {
      subtype: 'select',
      type: 'select',
      key: 'review-criteria',
      label: 'Review Criteria',
      placeholder: 'Select',
      data: [
        { label: 'Slack', value: 'Slack' },
        { label: 'Github', value: 'Github' },
      ],
      validators: {
        required: true,
      },
    },
    {
      subtype: 'select',
      type: 'select',
      key: 'reviewer',
      label: 'Reviewer',
      placeholder: 'Select',
      data: [
        { label: 'Slack', value: 'Slack' },
        { label: 'Github', value: 'Github' },
      ],
      validators: {
        required: true,
      },
    },
    {
      type: 'submit',
      label: 'Generate',
      class: 'w-full',
      submit: val => {
        alert(val.toString());
        alert('cancel clicked');
      },
    },
  ];

  cardData: ICard[] = [
    {
      cardType: 'accessReview',
      accessReviewCard: {
        header: 'Access Review Result for Slack',
        period: 6,
        createdDate: '16th April, 2023',
        reviewer: 'Anil Shah',
        imgSrc: 'assets/company-logos/slack.svg',
      },
    },
    {
      cardType: 'accessReview',
      accessReviewCard: {
        header: 'Access Review Result for Slack',
        period: 6,
        createdDate: '16th April, 2023',
        reviewer: 'Anil Shah',
        imgSrc: 'assets/company-logos/slack.svg',
      },
    },
    {
      cardType: 'accessReview',
      accessReviewCard: {
        header: 'Access Review Result for Slack',
        period: 6,
        createdDate: '16th April, 2023',
        reviewer: 'Anil Shah',
        imgSrc: 'assets/company-logos/slack.svg',
      },
    },
  ];

  activeTab!: string;

  get active(): string {
    if (this.activeTab) return this.activeTab;
    else {
      const item = this.tabItems.find(x => x.active);
      if (item) return item.item;
    }
    return 'default';
  }

  getActiveTab(event: any) {
    this.activeTab = event;
  }
}
