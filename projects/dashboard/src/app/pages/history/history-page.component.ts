import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { DynamicFormService } from '../../services';
import { ICard } from '../../components/card/card.component';
import { FormField } from '../../components/form-component/form-component.component';

@Component({
  selector: 'app-history',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.scss'],
})
export class HistoryPageComponent {
  form: FormGroup;
  @Input()
  formFields: FormField[] = [];

  navOpen = false;

  fieldJson: FormField[] = [
    {
      type: 'header',
      label: 'New Faram',
      image: 'assets/company-logos/office.svg',
    },
    {
      type: 'input',
      key: 'name',
      label: 'Name',
      value: '',
      subtype: 'text',
      validators: {
        required: true,
        minlength: 3,
      },
    },
    {
      subtype: 'email',
      type: 'input',
      key: 'email',
      label: 'Email',
      value: '',
      validators: {
        required: true,
      },
    },
    {
      type: 'button',
      class: 'bg-white hover:bg-slate-300   shadow  p-4 font-bold py-2 px-4 rounded mr-2 text-[#5B1D78]',
      label: 'Cancel',
      click: () => {
        alert('cancel clicked');
      },
    },
    {
      type: 'submit',
      label: 'Submit',
      submit: () => {
        alert('cancel clicked');
      },
    },
  ];

  cardData: ICard[] = [
    {
      cardType: 'history',
      historyCard: {
        header: 'Access Review Result for Slack',
        time: '2:41 PM',
        imgSrc: 'assets/company-logos/slack.svg',
      },
    },
    {
      cardType: 'history',
      historyCard: {
        header: 'Access Review Result for Slack',
        time: '2:41 PM',
        imgSrc: 'assets/company-logos/slack.svg',
      },
    },
    {
      cardType: 'history',
      historyCard: {
        header: 'Access Review Result for Slack',
        time: '2:41 PM',
        imgSrc: 'assets/company-logos/slack.svg',
      },
    },
  ];

  constructor(private dynamicFormService: DynamicFormService) {
    this.form = this.dynamicFormService.generateFormFromJson(this.fieldJson);
  }

  toogleNav(event: Event) {
    event.stopPropagation();
    this.navOpen = !this.navOpen;
  }

  navClose(event: Event) {
    event.stopPropagation();
    this.navOpen = false;
  }

  check() {
    console.log('Propragated');
  }
}
