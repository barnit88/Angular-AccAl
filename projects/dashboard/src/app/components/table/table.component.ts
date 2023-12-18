import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  inject,
  ChangeDetectorRef,
} from '@angular/core';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import * as $ from 'jquery';
import * as _ from 'lodash';
import { ReplaySubject, Subject, from, map, takeUntil } from 'rxjs';
import {
  ApiClientService,
  DialogService,
  FormControlValidators,
  FormController,
  FormModel,
  IStateDialogData,
  MaterialModule,
} from 'shared';
import { URL_INIT_MERGE_USERS } from '../../utils/constants';
import { IntegrationModel } from '../../pages/integration/interfaces';
import { TableColumnBuilderService } from '../../services/table-column-builder/table-column-builder.service';
import { ToastrService } from 'ngx-toastr';
import { UserDataService } from '../../services/user-data/user-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MergeHistoryComponent } from '../merge-history/merge-history.component';
import { UiUtilsServiceService } from '../../utils';
import { TableDataService } from '../../services/table-data/table-data.service';
import { MatCardModule } from '@angular/material/card';
import { UserData } from '../../pages/integration/interfaces';
import { FormsModule } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
// import { MergedUserInfo } from '../../store/app.state';
@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, DataTablesModule, FormsModule, HttpClientModule, MaterialModule, MatCardModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild(DataTableDirective, { static: false }) datatableElement!: DataTableDirective;

  @Input() count = 0;
  @Input() type = 'Items';
  @Input() availableIntegrations: IntegrationModel[] = [];
  @Input() isNavOpen = false;
  @Output() userClick: EventEmitter<object> = new EventEmitter();

  private api = inject(ApiClientService);
  private toastr = inject(ToastrService);
  private uiService = inject(UiUtilsServiceService);
  private destroyed$ = new Subject<boolean>();
  public loading = false; // used to show loader when data change is requested on the table.
  public isSmallScreen = false; // to show cards and tables in responsive views.
  public availableUsers: UserData[] = [];
  isTableView = false;
  selectedOption = 'table'; // defualting to table
  options = [
    {
      value: 'list',
      imagePath: 'assets/icons/list-solid.svg',
    },
    {
      value: 'table',
      imagePath: 'assets/icons/table-solid.svg',
    },
    // Add more options accordingly
  ];

  // dtOptions: DataTables.Settings = {};
  dtOptions: any = {}; // have to use any for buttons
  constructor(private dailogService: DialogService, private cdr: ChangeDetectorRef) {
    this.uiService.refreshUserTable.pipe(takeUntil(this.destroyed$)).subscribe(refreshTable => {
      if (refreshTable) {
        this.refresh();
        this.cdr.detectChanges();
      }
    });
  }

  private tableObs$ = new ReplaySubject<void>();
  private tableColumnBuilder = inject(TableColumnBuilderService);
  private userDataService = inject(UserDataService);
  private matDialog = inject(MatDialog);
  private tableData = inject(TableDataService);

  public async refresh() {
    this.loading = true;
    this.mergeList = [];
    this.userDataService.mergedUsers = [];
    this.userDataService.allUsers = [];
    // force load the data.
    await this.tableData.getAvailableUsers(true);
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload(() => {
        // dtInstance.draw(false);
        const settings = dtInstance.settings()[0];
        const data = {
          data: dtInstance.data(),
        };
        // dtInstance.draw(false);

        this.initComplete(settings, data);
        this.loading = false;
        setTimeout(() => {
          dtInstance.columns.adjust().draw();
        }, 50);
      });
    });
  }

  public mergeList: string[] = [];

  /**
   * Merge User Dailog Form
   */
  userMergeDialogFormConfig: FormModel = {
    containerTitle: 'Merge User',
    containerText: `Select the primary email address.
     After user rows are merged, this email address will be displayed on 
     the table for this user.`,
    name: '',
    slug: '',
    forward_api: '',
    type: 'add-member',
    multipart: false,
    logo: '',
    fields: [
      {
        type: 'select',
        label: 'Default Initial Email:',
        tag: 'email',
        placeholder: '',
        value: '',
        validators: [FormControlValidators.Required],
        input_type: 'select',
        option: [],
      },
    ],
  };

  AvailableApps(user: UserData): string[] {
    const imgArr: string[] = [];
    _.each(this.availableIntegrations, intg => {
      if (user[intg.slug]) {
        imgArr.push(intg.logo);
      }
    });
    return imgArr;
  }

  ngOnDestroy(): void {
    // deregister all click handlers
    this.turnOffListeners();
    this.destroyed$.next(false);
    this.destroyed$.complete();
  }

  turnOffListeners() {
    $('.more-menu-click').off('click');
    $('.acc-checkbox').off('click');
    $('.acc-multi-user').off('click');
  }

  ngOnChanges(): void {
    if (!this.datatableElement) return;
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Do something with the DataTable instance
      console.log('DataTable instance:', dtInstance);
      if (!dtInstance) {
        return;
      }
      setTimeout(() => {
        dtInstance.columns.adjust();
      }, 400);
    });
  }

  buildTable(): void {
    this.dtOptions = {
      ajax: (dataTablesParameters: any, callback: any) => {
        from(this.tableData.getAvailableUsers())
          .pipe(
            takeUntil(this.tableObs$),
            map((res: any) => {
              // indexing users so that we can use it in the click handler
              // for each integration column, kinda hacky, but works!!!
              res?.users.map((data: any, index: number) => {
                data['index'] = index;
                // we know what integrations are available, so we can index those values
                // to fetch future data
                this.availableIntegrations.forEach((integration: IntegrationModel) => {
                  if (integration.slug !== undefined) {
                    // check if this integration data is coming along for the user.
                    if (data[integration.slug]) {
                      data[integration.slug].index = index;
                    }
                  }
                });
              });
              this.userDataService.allUsers = res?.users;
              this.userDataService.mergedUsers = res?.merged_users;

              return res.users;
            }),
          )
          .subscribe(resp => {
            callback({
              // recordsTotal: resp.recordsTotal,
              // recordsFiltered: resp.recordsFiltered,
              data: resp,
            });
          });
      },
      paging: false,
      scrollY: 600,
      scrollX: true,
      stateSave: true,
      deferRender: true,
      language: {
        loadingRecords: "<img src='assets/images/loader.svg' class='loading-image'></img>",
      },

      order: [[1, 'asc']],

      /**
       * THE PLACE WHERE WE RENDER THE COLUMNS, GO TO THE COULMN BUILDER SERVICE IF YOU WANT TO VIEW/ADD COLUMNS
       */
      columns: this.tableColumnBuilder.buildTableColumns(this.availableIntegrations),
      initComplete: (settings: any, json: any) => {
        this.initComplete(settings, json);
      },

      dom: 'Bfrtip',
      buttons: [
        {
          text: 'Show/Hide Columns',
          extend: 'colvis',
          columns: ':not(.noVis)',
          className: 'dataTableAction',
        },
        {
          extend: 'excel',
          className: 'dataTableAction',
        },
        {
          extend: 'print',
          className: 'dataTableAction',
        },
      ],
    };
  }

  initComplete(settings: any, json: any) {
    // actions on three-dots click
    $('.more-menu-click').click(ev => {
      const tdElem = ev.target.closest('td');
      const userInfoElem = ev.target.closest('.more-menu-click');
      const userId = userInfoElem?.getAttribute('data-userId') ?? undefined;

      if (tdElem) {
        // Find the parent row of the 'td' element
        const parentRow = tdElem.parentElement;

        if (parentRow) {
          // Check if parentRow.parentNode.children is defined
          const parentChildren = parentRow.parentNode?.children;

          if (parentChildren && userId) {
            // Find the row index in the table
            const columnIndex = settings.aoColumns[tdElem.cellIndex].data; // get cell position, then the column position to know which system.
            // we have userId, let's get the userObject
            const userObject = _.find(json.data, { index: +userId });

            // we have column number and whole data set, we know what integration user clicked
            // let's emit the integration related data

            const isActivated =
              userObject[columnIndex]?.is_2fa_activated === true
                ? 'Active'
                : userObject[columnIndex]?.is_2fa_activated === false
                ? 'Inactive'
                : 'N/A';

            const emitObject = {
              first_name: userObject.first_name,
              last_name: userObject.last_name,
              email: userObject.merged ? userObject[columnIndex].email : userObject.email,
              full_name: userObject.full_name,
              integration_key: columnIndex,
              platform: columnIndex, //TO:DO this will come from backend so remove it. just for testing
              image: `assets/company-logos/${columnIndex}.svg`,
              type: 'operation',
              [columnIndex]: userObject[columnIndex],
              identifier: userObject[columnIndex]?.form_user_identifier,
              is_suspended: userObject[columnIndex]?.is_suspended,
              is_2fa_activated: isActivated,
            };

            this.userClick.emit(emitObject);
            // emit the whole value to build
          }
        }
      }
    });

    //actions on first-column checkbox click
    $('.acc-checkbox').click(ev => {
      const userInfoElem = ev.target.closest('.acc-checkbox');
      if (userInfoElem) {
        const email = userInfoElem.getAttribute('data-email') ?? undefined;
        const isChecked = $(userInfoElem).prop('checked');
        if (isChecked && email) {
          this.mergeList.push(email);
        }
        if (!isChecked && email) {
          this.mergeList = this.mergeList.filter(item => item !== email);
        }
      }
    });

    $('.acc-multi-user').click(ev => {
      const userInfoElem = ev.target.closest('.acc-multi-user');
      if (userInfoElem) {
        const email = userInfoElem.getAttribute('data-email') ?? undefined;
        if (email) {
          this.mergedInfo(email);
        }
      }
    });
  }

  /**
   * This method renders the merge info for a particular user.
   * @param email primary email clicked from multi icon
   */
  mergedInfo(email: string): void {
    const mergeInfo = this.userDataService.mergedUsers.find((item: any) => item.email === email);
    console.log(mergeInfo);
    this.matDialog.open(MergeHistoryComponent, { data: mergeInfo, panelClass: 'rounded-full' });
  }

  ngOnInit(): void {
    this.loading = false;
    this.buildTable(); // initalizing both services for table and
    this.isSmallScreen = window.innerWidth < 768;
    if (this.isSmallScreen) {
      this.fetchUsers(); // card views, having them preloaded helps
    }
    window.onresize = async () => {
      this.isSmallScreen = window.innerWidth < 768;
      if (this.isSmallScreen) {
        this.fetchUsers();
      }
    };
  }

  openUserAddModal() {
    alert('this will open user add modal');
  }

  async fetchUsers() {
    try {
      this.loading = true;
      const response = await this.tableData.getAvailableUsers();
      if (response?.users) {
        this.availableUsers = response?.users;
      }
      this.loading = false;
    } catch (error) {
      this.loading = false;
      console.log('Error:', error);
    }
  }

  async mergeUsers() {
    console.log(this.mergeList);
    const keyValMapping = this.mergeList.map((item, _index) => {
      return { label: item, value: item };
    });
    this.userMergeDialogFormConfig.fields[0].option = keyValMapping;

    const formDialogKey = 'MERGE_USER_FORM';
    try {
      this.dailogService.form(formDialogKey, this.userMergeDialogFormConfig, {
        autoClose: false,
        onSuccess: async (data: FormController) => {
          // get the primary user
          const primUser = data.group.value.email;
          // get the secondary users
          const secUsers = this.mergeList.filter(item => item !== primUser);
          try {
            const mergeResp: any = await this.api.post(URL_INIT_MERGE_USERS, {
              main: primUser,
              duplicates: secUsers,
            });
            console.log(mergeResp);
            this.dailogService.close();
            // let's open detail dialog now, setting mergeInit flag set to true
            // so that we can render button at the bottom.
            const mergeInfo = mergeResp.merged_user_info;
            mergeInfo.merge_id = mergeResp.merge_id;
            mergeInfo.mergeInit = true;
            this.matDialog.open(MergeHistoryComponent, { data: mergeInfo, panelClass: 'rounded-full' });
          } catch (e: any) {
            const stateDialogKey = 'MERGEFAIL_STATEDIALOG';
            const message: IStateDialogData = {
              type: 'error',
              message: e?.err,
              onAction: async () => this.dailogService.closeDialog(stateDialogKey),
            };
            this.dailogService.state(message, stateDialogKey);
            console.log(e);
          }
          // we're done, let's close this dailog.
        },
        onError: err => {
          this.toastr.error(err);
        },
      });
    } catch (error: any) {
      this.toastr.error(error?.err);
    }
  }

  onOptionChange(event: MatRadioChange) {
    if (event.value === 'table') {
      this.isSmallScreen = false;
      this.buildTable();
    } else {
      this.isSmallScreen = true;
      this.fetchUsers();
    }
  }
}
