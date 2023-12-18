import { Component, OnInit, inject } from '@angular/core';
import { TabItem } from '../../components/tabs/tab.interfaace';
import {
  DialogService,
  FormController,
  FormModel,
  IConfirmationDialogData,
  ApiClientService,
  FormControlValidators,
  FormFieldModel,
} from 'shared';
import { ToastrService } from 'ngx-toastr';
import { FormField } from '../../components/form-component/form-component.component';
import { from } from 'rxjs';
import * as _ from 'lodash';
import { ConfigService } from '../../initializer/app-intializer.service';
import { Company, CompanyAndUserInfo, User } from '../../models/CompanyAndUser';
import { Pagination } from '../../components';

@Component({
  selector: 'app-menu-setting',
  templateUrl: './menu-setting.component.html',
  styleUrls: ['./menu-setting.component.scss'],
})
export class MenuSettingComponent implements OnInit {
  /**
   * Injected Services
   */
  private dialogService = inject(DialogService);
  private toastr = inject(ToastrService);
  private apiService = inject(ApiClientService);
  private configService = inject(ConfigService);

  /** URL */
  private INVITE_MEMBER_URL = '/company/invite-user/';
  private EDIT_MEMBER_ROLE_URL = '/user/role/';
  private REMOVE_MEMBER_URL = 'company/remove-user/';

  /** Variables */
  public activeTab!: string;
  public companyAndUserInfo!: CompanyAndUserInfo;
  public users: UserSetting[] = [{ imgSrc: 'assets/images/profile-image.jpeg', name: 'Jeena Dahal', role: 'Owner' }];
  public currentUserList!: UserSetting[];
  public userCount!: number;

  async ngOnInit(): Promise<void> {
    let tempUpdateCompanyNameFormConfig: FormField[] = [];
    this.updateCompanyNameFormConfig = [this.companyName, this.saveButton];
    this.configService.companyInfoSubject$.subscribe({
      next: (data: Company | null) => {
        if (data) {
          this.companyName.value = data.name;
          tempUpdateCompanyNameFormConfig = [this.companyName, this.saveButton];
          this.updateCompanyNameFormConfig = _.cloneDeep(tempUpdateCompanyNameFormConfig);
        }
      },
      error: error => {
        this.toastr.error(error.err);
        console.log(error);
      },
    });

    this.GetMembers();
  }

  /**
   * @description
   * Handles the page change event from pagination component
   */
  onPageChange(data: Pagination) {
    if (data) {
      const skip = data.page_number === 1 ? 0 : data.page_number - 1 * data.take;
      this.currentUserList = this.users.slice(skip, data.take);
    }
  }

  /**
   * @description
   * Queries Memeber Data from Server
   */
  private async GetMembers() {
    try {
      const users = await this.apiService.get<User[]>('/company/users/');
      if (users) {
        this.users = users.map((x: User) => {
          return {
            imgSrc: 'assets/images/profile-image.jpeg',
            name: x.email,
            role: x.role,
          };
        });
        this.userCount = users.length;
        this.currentUserList = this.users.slice(0, 5);
      }
    } catch (e) {
      this.toastr.error('Error retreiving users.');
    }
  }

  /**
   * @description
   * Company Name Update Form Configs
   */
  updateCompanyNameFormConfig: FormField[] = [];
  companyName: FormField = {
    type: 'input',
    subtype: 'text',
    key: 'companyName',
    label: 'Company name',
    value: '',
    disabled: false,
    placeholder: 'Select',
    class: '!text-[1.5rem]',
    validators: {
      required: true,
    },
  };
  saveButton: FormField = {
    type: 'submit',
    label: 'Save Changes',
    submit: data => this.updateCompanyName(data),
  };
  /** */

  /**
   * @description
   * Navigation Tab Items
   */
  tabItems: TabItem[] = [
    {
      item: 'General Setting',
      active: true,
      title: 'General Setting',
      detail: 'Edit and make changes to your company related credentials.',
    },
    {
      item: 'User And Permisson',
      active: false,
      title: 'User And Permisson',
      detail: 'Add user and manage permisson roles.',
    },
  ];
  /** */

  /**
   * @todo
   * Should Remove Getter Function
   * @description
   * Gets Active Navigation Tab
   */
  get active(): string {
    if (this.activeTab) {
      return this.activeTab;
    } else {
      const item = this.tabItems.find(x => x.active);
      if (item) return item.item;
      return 'default';
    }
  }
  /** */

  /**
   * @description
   * Sends the Updated Company name to server
   * @param form Company Name Update Form
   */
  private updateCompanyName(form: any) {
    this.dialogService.progress();
    const request = { company_name: form.companyName };
    from(this.apiService.post<Company>('company/edit/', request)).subscribe({
      next: (data: Company) => {
        this.configService.companyInfoSubject$.next(data);
        const message = `Company name updated successfully to ${data.name}`;
        this.dialogService.close();
        this.toastr.success(message);
      },
      error: error => {
        this.dialogService.close();
        this.toastr.error(error.err);
        console.log(error);
      },
    });
  }

  /**
   *
   * @description
   * Receives Active Tab Name from Navigation Tab Component and stores in activeTab variable
   * @param event Active Tab Name
   */
  getActiveTab(event: string) {
    this.activeTab = event;
  }

  /**
   * @description
   * Add Member Dialog Form Config
   */
  addMemberDialogFormConfig: FormModel = {
    name: 'Invite Member',
    slug: '',
    forward_api: '',
    type: 'add-member',
    multipart: false,
    logo: '',
    fields: [
      {
        type: 'text_field',
        label: 'Email',
        tag: 'email',
        placeholder: '',
        value: '',
        validators: [FormControlValidators.Required],
        input_type: 'text',
      },
      {
        type: 'select',
        label: 'Roles',
        tag: 'role',
        placeholder: '',
        value: '',
        validators: [FormControlValidators.Required],
        input_type: 'select',
        option: [
          { label: 'Owner', value: 'owner' },
          { label: 'Editor', value: 'editor' },
          { label: 'Viewer', value: 'viewer' },
        ],
      },
    ],
  };

  /**
   * @description
   * Handles Add Member Event
   */
  onAddMember() {
    const formDialogKey = 'ADDMEMBER_FORM';
    try {
      this.dialogService.form(formDialogKey, this.addMemberDialogFormConfig, {
        autoClose: false,
        onSuccess: (data: FormController) => this.addMemberConfirmDialog(data),
        onError: err => {
          this.toastr.error(err);
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * @description
   * Shows confirmation dialog to add memeber and proceds with memeber addition after dialog confirmed
   * @param formController Contains All Form Related Data
   */
  async addMemberConfirmDialog(formController: FormController) {
    if (!formController?.group.value || formController?.group.value == '') {
      this.toastr.error('Empty Form Data');
      return;
    }
    const addMemberConfirmDialogKey = 'ADDMEMBER_CONFIRM_DIALOG';
    const confirmDialogData: IConfirmationDialogData = {
      title: 'Add Member',
      message: `Are you sure you want to add member. Member will be added after the requst has confirmed by memeber.`,
      onConfirm: async () => {
        this.dialogService.closeDialog(addMemberConfirmDialogKey);
        this.addMemberCall(formController.group.value);
      },
    };
    this.dialogService.confirm(confirmDialogData, addMemberConfirmDialogKey);
  }

  /**

   * @description
   * Sends Add Memeber Request To Server
   * @param payload Member Data
   */
  async addMemberCall(payload: { [key: string]: any }) {
    const addMemberDialogKey = 'ADDMEMBER_DIALOG';
    this.dialogService.progress(addMemberDialogKey);
    try {
      const response: any = await this.apiService.post(this.INVITE_MEMBER_URL, payload);
      this.GetMembers();
      this.toastr.success(response.message);
      this.dialogService.closeDialog(addMemberDialogKey);
      this.dialogService.close();
    } catch (error: any) {
      this.dialogService.closeDialog(addMemberDialogKey);
      this.toastr.error(error.err);
      console.log(error.err);
    }
  }

  /**
   * @description
   * Edit Member Dialof Form Configs
   */
  private editMemberFormConfig: FormModel = {
    name: 'string',
    slug: 'string',
    forward_api: 'string',
    type: 'edit-member',
    multipart: false,
    logo: 'string',
    fields: [],
  };
  private editMemberRoleFormControl: FormFieldModel = {
    type: 'select',
    label: 'Roles',
    tag: 'role',
    placeholder: '',
    value: '',
    input_type: 'select',
    option: [
      { label: 'Owner', value: 'owner' },
      { label: 'Editor', value: 'editor' },
      { label: 'Viewer', value: 'viewer' },
    ],
  };
  private editMemberUserRemoveFormControl: FormFieldModel = {
    type: 'user-remove',
    label: 'user-remove',
    tag: null,
    placeholder: '',
    value: '',
    input_type: '',
    label_user: 'Jeena Dahal',
    label_user_img_src: 'assets/images/profile-image.jpeg',
  };
  /** */

  /**
   * @description
   * Opens confirmation dialog, and removes the user on confirm
   * @param email Email of the member
   */
  private removeUserConfirmDialog(email: string) {
    const removeUserConfirmDialogKey = 'REMOVEUSER_CONFIRM_DIALOG';
    const payload = { email };
    const confirmDialogData: IConfirmationDialogData = {
      title: 'Remove Member',
      message: `Are you sure you want to remome this member.`,
      onConfirm: async () => {
        this.dialogService.closeDialog(removeUserConfirmDialogKey);
        this.removeMember(payload);
      },
    };
    this.dialogService.confirm(confirmDialogData, removeUserConfirmDialogKey);
  }

  /**
   * @description
   * Makes api call to remove the member
   * @param payload Information of the member to remove
   */
  private removeMember(payload: any) {
    const removeUserProgressDialogKey = 'REMOVEUSER_PROGRESS';
    this.dialogService.progress(removeUserProgressDialogKey);
    from(this.apiService.delete(this.REMOVE_MEMBER_URL, payload)).subscribe({
      next: async (data: any) => {
        await this.GetMembers();
        this.toastr.success(data.message);
        this.dialogService.closeDialog(removeUserProgressDialogKey);
        this.dialogService.close();
      },
      error: error => {
        this.dialogService.closeDialog(removeUserProgressDialogKey);
        this.toastr.error(error.err);
        console.log(error.err);
      },
    });
  }

  /**
   * @description
   * Handles Edit Member Event
   * @param memberEmail
   * @param userRole
   */
  onEditMember(memberEmail: string, userRole: string) {
    console.log(userRole);
    const editMemberFormDialogKey = 'EDITMEMEBER_FORM';
    const editForm = _.clone(this.editMemberFormConfig);
    const removeUserFormControl = _.clone(this.editMemberUserRemoveFormControl);
    removeUserFormControl.label_user = memberEmail;
    removeUserFormControl.onClick = async () => this.removeUserConfirmDialog(memberEmail);
    const memberRoleFormControl = _.clone(this.editMemberRoleFormControl);
    memberRoleFormControl.value = userRole;
    this.editMemberRoleFormControl;
    editForm.fields = [removeUserFormControl, memberRoleFormControl];
    try {
      this.dialogService.form(editMemberFormDialogKey, editForm, {
        autoClose: false,
        onSuccess: (data: FormController) => this.editMemberConfirmDialog(data, memberEmail),
        onError: err => {
          this.toastr.error(err);
          console.log(err);
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * @description
   * Opens Confirmation Dialog to edit member and updates the member on confirmation
   * @param formController Form Data
   * @param memberEmail Member Email
   */
  private editMemberConfirmDialog(formController: FormController, memberEmail: string) {
    const editMemberFormDialogKey = 'EDITMEMEBER_CONFIRM_DIALOG';
    const payload: { [key: string]: any } = formController?.group.value;
    const updateMemeberDialogData: IConfirmationDialogData = {
      title: 'Confirmation',
      message: `Are you sure you want to update this user role?`,
      onConfirm: async () => {
        this.dialogService.closeDialog(editMemberFormDialogKey);
        this.editMember(payload, memberEmail);
      },
    };
    this.dialogService.confirm(updateMemeberDialogData, editMemberFormDialogKey);
  }

  /**
   * @description
   * Makes the api call to update the member info
   * @param data Member Data
   * @param email Member Email
   */
  private async editMember(data: any, email: string) {
    const editMemberProgressDialog = 'EDITMEMBER_PROGRESS_DIALOG';
    try {
      this.dialogService.progress(editMemberProgressDialog);
      const payload = { ...data, email };
      const response: any = await this.apiService.post(this.EDIT_MEMBER_ROLE_URL, payload);
      this.dialogService.closeDialog(editMemberProgressDialog);
      this.toastr.success(response.message);
      window.location.reload();
    } catch (error: any) {
      this.dialogService.closeDialog(editMemberProgressDialog);
      this.toastr.error(error.err);
      console.log(error.err);
    }
  }
}

export interface UserSetting {
  imgSrc: string;
  name: string;
  role: string;
}
