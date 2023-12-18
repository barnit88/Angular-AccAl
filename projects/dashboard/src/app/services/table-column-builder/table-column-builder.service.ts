import { Injectable, inject } from '@angular/core';
import { IntegrationInfoService } from '../integration-info-service/integration-info.service';
import { IntegrationModel } from '../../pages/integration/interfaces';
export interface TableColumn {
  title: string;
  data: string | null;
  render?: (data: any, _type: any, _full: any) => string;
  width?: string;
  defaultContent?: string;
  className?: string;
}

@Injectable({
  providedIn: 'root',
})

/**
 * Custom service to generate table.
 *
 * The table is a complex beast with conditional columns rendered
 * depending on what integrations user has.
 *
 * The table should support sorting, filtering, pagination, and searching.
 *
 * Additionally, the table should support click events on the rows and columns.
 *
 * Table also should support virtual scrolling and server side data loading so we can
 * load a very large number of data.
 *
 * WE DO NOT KNOW IT YET, BUT WE WILL NEED TO EXPORT DATA FROM THE TABLE AS WELL IN FUTURE.
 * ALSO WE WILL NEED TO HIDE/SHOW COLUMNS BASED ON USER PREFERENCE.
 *
 *
 *
 * For all the reasons mentioned above, we're using datatable to render and operate over table related
 * operations. We will find a nice replacement once we've figured out what we're supporting.
 */
export class TableColumnBuilderService {
  integrationInfo = inject(IntegrationInfoService);

  firstName: TableColumn = {
    title: 'First Name',
    data: 'first_name',
    className: 'sticky-column',
  };

  checkBox: TableColumn = {
    title: '',
    data: null,
    defaultContent: '',
    className: 'select-checkbox sticky-column noVis',
    render: (data: any, _type: any, _full: any) => {
      if (data.merged) {
        return `<div class="flex flex-row">
                    <div class="relative group flex flex-row">
                            <label class="inline-flex items-center">
                <input data-email=${data.email}  type="checkbox" class="acc-checkbox cursor-pointer text-primary-600 z-10 border-1 border-primary-300 rounded focus:ring-0" />

  </div>
                                  <div  class="h-5 w-5 ml-2 mt-1">
                <div data-email=${data.email} class="acc-multi-user cursor-pointer"><img src="assets/icons/mergedUsers.svg"></div>
                </div>
        </div>`;
      } else {
        return `<div class="flex flex-row"><label class="inline-flex items-center">
                    <div class="relative group">
                <input data-email=${data.email}  type="checkbox" class="acc-checkbox cursor-pointer text-primary-600 z-10 border-1 border-primary-300 rounded focus:ring-0" />

                                                 
  </div>
        </div>`;
      }
    },
  };

  lastName: TableColumn = {
    title: 'Last Name',
    data: 'last_name',
    className: 'sticky-column',
  };

  email: TableColumn = {
    title: 'Email',
    data: 'email',
  };

  /**
   * Where the magic of table columns happens.
   * We're supporting N numbers of integration. The philosophy behind the table view
   * is the system should itself know what systems are integreated and build the table
   * columns accordingly. Those columns should have all the bells and whistle of navigating into details
   * adding/removing/onboarding of users and everything
   *
   * All the static user info(viz name, email, favorite pokemon, toppings of pizzah) are plain and simple and are cherry picked from the objects defined above.
   * The dynamic part will be the one where we'll fetch the integrations and build columns accordingly.
   * As of now, we just need the plain function to
   *   a. check what is integreated ( we have this info already in service)
   *   b. build the columns accordingly
   *
   * @returns a list of table columns.
   */
  public buildTableColumns(availableIntegrations: IntegrationModel[]): TableColumn[] {
    const primaryColumns = [this.checkBox, this.firstName, this.lastName, this.email];
    const statusColumn = this.renderStatus(availableIntegrations);
    primaryColumns.push(statusColumn);
    const integrationColumns = this.renderColumnsForIntegrations(availableIntegrations);

    return [...primaryColumns, ...integrationColumns];
  }

  private renderStatus(integrations: IntegrationModel[]): TableColumn {
    const rendStat: TableColumn = {} as TableColumn;
    rendStat.title = 'Status';
    rendStat.data = 'status';
    rendStat.render = (_data: any, _type: any, full: any) => {
      return this.buildStatus(full, integrations);
    };
    return rendStat;
  }

  buildStatus(full: any, integrations: IntegrationModel[]): string {
    let stateFlag = false;
    integrations.forEach(integration => {
      if (full[integration.slug] && !full[integration.slug].is_suspended) {
        stateFlag = true;
        if (stateFlag) {
          return;
        }
      }
    });

    if (stateFlag) {
      return `<div class="bg-green-500 rounded-full h-7 w-[7rem] flex items-center justify-center text-black">
          <svg class="w-4 h-4 mr-2 fill-white" viewBox="0 0 20 20">
            <path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/>
          </svg>
          Active
        </div>
        `;
    } else {
      return `<div class="bg-red-200  rounded-full h-7 w-[7rem] flex items-center justify-center text-black">
          <svg class="w-4 h-4 mr-2 fill-orange-800" viewBox="0 0 20 20">
          <path d="M 10 0 L 20 10 L 10 20 L 0 10 Z" />
        </svg>
          Inactive
        </div>`;
    }
  }

  /**
   * Takes the list of available integrations and builds the table columns accordingly.
   * @param integrations
   * @returns TableColumn[]
   */

  private renderColumnsForIntegrations(integrations: IntegrationModel[]): TableColumn[] {
    const dynamicArray: TableColumn[] = [];
    integrations.forEach(integration => {
      const integrationColumn: TableColumn = {} as TableColumn;
      integrationColumn.title = `<div class="relative flex group align-middle justify-center w-8 h-8 bg-white rounded-xl  text-white">
        <img class='h-6 w-6 mt-1' src=${integration.logo}>
             <div class="tooltip z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible absolute bg-amber-300 text-center text-primary-700 py-1 px-3 rounded-lg right-full w-20 -bottom-full mb-6 mr-1">
          ${integration.name}
        </div>
      </div>`;
      integrationColumn.data = integration.slug;
      integrationColumn.width = '65px';
      integrationColumn.render = (data: any, _type: any, _full: any) => {
        return this.renderCheckBoxes(data);
      };
      dynamicArray.push(integrationColumn);
    });
    return dynamicArray;
  }

  /***
   * This method renders the checkboxes for the table columns.
   * This method injects three dots with properties that helps to fetch the user form details
   * for this specific user.
   * This method is also responsibe for the tooltips that are shown on hover of the checkboxes.
   * // TO: DO : Tie a click function on the checkbox and enable/disable the user behind a modal.
   */

  renderCheckBoxes(data: any): string {
    if (!data) {
      // if user is addable, leave empty input, if not disbale the darn thing.
      return `<div class="flex flex-row"><label class="inline-flex items-center">
                    <div class="relative group">
                <input type="checkbox" class="text-green-500 z-10 border-1 border-green-300 rounded focus:ring-0" disabled />
                                                  ${this.tooltipBody(data)}
  </div>
        </div>`;
    }

    if (!data?.is_suspended) {
      return `<div class="flex flex-row"><label class="inline-flex items-center">
                <div class="relative group">
                <input type="checkbox" class="text-green-500 z-10 border-1 border-green-300 rounded focus:ring-0" checked disabled />
  ${this.tooltipBody(data)}
  </div>
        </label>
        <div data-userId=${data.index} class="flex more-menu-click flex-col ml-2 hover:scale-110">
        <div class="h-1 w-1 rounded-full bg-gray-500 m-0.5"></div>
        <div class="h-1 w-1 rounded-full bg-gray-500 m-0.5"></div>
        <div class="h-1 w-1 rounded-full bg-gray-500 m-0.5"></div>
        </div>
        </div>`;
    } else {
      return `<div class="flex flex-row"><label class="inline-flex items-center">
        <div class="relative group">
                <input type="checkbox" class="text-gray-500 z-10 border-1 border-red-300 rounded focus:ring-0" checked disabled />
  ${this.tooltipBody(data)}
  </div>
        </label>
        <div data-userId=${data.index} class="flex more-menu-click flex-col ml-2 hover:scale-110">
        <div class="h-1 w-1 rounded-full bg-gray-500 m-0.5"></div>
        <div class="h-1 w-1 rounded-full bg-gray-500 m-0.5"></div>
        <div class="h-1 w-1 rounded-full bg-gray-500 m-0.5"></div>
        </div>
        </div>`;
    }
  }

  tooltipBody(data: any): string {
    if (!data) {
      return `<div class="tooltip z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible absolute bg-amber-300 text-center  text-primary-700 py-1 px-3 rounded-lg right-full w-32 -bottom-full mb-3 mr-1"">
    No Acount
  </div>`;
    }

    if (!data?.is_suspended) {
      return `<div class="tooltip z-50 arrow-topleft opacity-0 invisible group-hover:opacity-100 group-hover:visible absolute bg-amber-300 text-center  text-primary-700 py-2 px-3 rounded-lg right-full w-32 -mt-7 mb-3 mr-1"">
    <div class="font-bold font-['Inter-Bold']">User Active</div>
    <div class='mt-2'>Last Active:</div>
    <div>${this.localDate(data.last_active)}</div>
  </div>`;
    } else {
      return `<div class="tooltip z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible absolute bg-amber-300 text-center  text-primary-700 py-1 px-3 rounded-lg right-full w-32 -bottom-full mb-3 mr-1">
    User Suspended
  </div>`;
    }
  }

  localDate(dateString: string): string {
    if (!dateString) {
      return 'N/A';
    }
    return new Date(dateString).toLocaleDateString();
  }
}
