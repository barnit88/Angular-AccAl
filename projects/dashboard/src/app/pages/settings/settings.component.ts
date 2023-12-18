import { Component, OnInit } from '@angular/core';
import { TabItem } from '../../components/tabs/tab.interfaace';
import { FormField } from '../../components/form-component/form-component.component';
import { ConfigService } from '../../initializer/app-intializer.service';
import { Company, User } from '../../models/CompanyAndUser';
import { ApiClientService, AuthService } from 'shared';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  constructor(
    private configService: ConfigService,
    private apiService: ApiClientService,
    private toastr: ToastrService,
    private authService: AuthService,
  ) {}
  ngOnInit(): void {
    this.configService.companyInfoSubject$.subscribe({
      next: (data: Company | null) => {
        if (data) {
          console.log('Settings component received data:', JSON.stringify(data));
          this.companyNameInput.value = data.name;
          this.profileFormConfig = [
            this.companyNameInput,
            this.workEmailInput,
            this.nameInput,
            this.submitButton,
            this.clearButton,
          ];
        }
      },
    });
    this.configService.userInfoSubject$.subscribe({
      next: (data: User | null) => {
        if (data) {
          console.log('Settings component received data:', JSON.stringify(data));
          this.workEmailInput.value = data.email;
          this.nameInput.value = data.full_name ?? '';

          this.profileFormConfig = [
            this.companyNameInput,
            this.workEmailInput,
            this.nameInput,
            this.submitButton,
            this.clearButton,
          ];
        }
      },
    });
  }

  /**
   *
   * Navigation Tab Items
   *
   */
  tabItems: TabItem[] = [
    {
      item: 'Profile',
      active: true,
      title: 'Profile',
      detail: 'Please verify your details and make changes if necessary.',
    },
    {
      item: 'Password',
      active: false,
      title: 'Password',
      detail: 'Please enter your current password to change password.',
    },
  ];
  /** End */

  /**
   *
   * Profile Detail Form Config
   *
   */
  companyNameInput: FormField = {
    type: 'input',
    subtype: 'text',
    key: 'company-name',
    label: 'Company Name',
    value: '',
    disabled: true,
    class: '!text-[1.25rem]',
    placeholder: 'Your Company Name',
    validators: {},
  };
  workEmailInput: FormField = {
    type: 'input',
    subtype: 'email',
    key: 'work-email',
    label: 'Work Email',
    value: '',
    disabled: true,
    class: '!text-[1.25rem]',
    placeholder: 'Work Email Placeholder',
    validators: {},
  };

  nameInput: FormField = {
    type: 'input',
    subtype: 'text',
    key: 'name',
    label: 'Name',
    value: '',
    class: '!text-[1.25rem]',
    placeholder: 'Name Place Holder',
    validators: {
      required: true,
    },
  };
  submitButton: FormField = {
    type: 'submit',
    label: 'Save Changes',
    class: 'w-[162px] h-min text-[16px] float-right',
    submit: data => this.updateUserFullName(data),
  };
  clearButton: FormField = {
    type: 'clear',
    label: 'Clear',
    class: 'w-[110px] h-min text-[16px] float-right',
  };
  profileFormConfig: FormField[] = [
    this.companyNameInput,
    this.workEmailInput,
    this.nameInput,
    this.submitButton,
    this.clearButton,
  ];
  /** End */

  /**
   *
   * Password Update Form Config
   *
   */
  passwordFormConfig: FormField[] = [
    {
      type: 'input',
      subtype: 'password',
      key: 'newPassword',
      label: 'New Password',
      value: '',
      placeholder: 'New Password',
      validators: {
        required: true,
      },
    },
    {
      type: 'input',
      subtype: 'password',
      key: 'confirmNewPassword',
      label: 'Confirm New Password',
      value: '',
      placeholder: 'Confirm New Password',
      validators: {
        required: true,
      },
    },
    {
      type: 'submit',
      label: 'Update Password',
      class: 'w-[200px] h-min text-[16px] float-right',
      submit: val => this.changePassword(val),
    },
    {
      type: 'clear',
      label: 'Clear',
      class: 'w-[110px] h-min text-[16px] float-right',
    },
  ];
  /** END */

  async updateUserFullName(data: { name: string }) {
    try {
      const user = await this.apiService.post<User>('user/update/', { name: data.name });
      this.configService.userInfoSubject$.next(user);
    } catch (e) {
      this.toastr.error('Something went wrong.Please try again.');
    }
    return data;
  }

  async changePassword(data: { newPassword: string; confirmNewPassword: string }) {
    if (data.newPassword === data.confirmNewPassword) {
      try {
        const response = await this.apiService.post<{ token: string }>('user/change-password/', {
          password: data.confirmNewPassword,
        });
        // this.authService.setCookies(response.token);
        await this.authService.signInwithCustomToken(response.token);
        this.toastr.success('Password updated succesfully.');
      } catch (e: any) {
        this.toastr.error(e);
      }
    } else {
      this.toastr.error("New Password and Confirm New Password doesn't match.");
    }
    return data;
  }

  public activeTab!: string;
  get active(): string {
    if (this.activeTab) {
      return this.activeTab;
    } else {
      const item = this.tabItems.find(x => x.active);
      if (item) return item.item;
      return 'default';
    }
  }

  getActiveTab(event: string) {
    this.activeTab = event;
  }
}
