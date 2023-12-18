import { Component, inject } from '@angular/core';
import { EnvironmentVarService, ApiClientService } from 'shared';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public bruceServer: string | null = null;

  private api = inject(ApiClientService);
  private env = inject(EnvironmentVarService);

  constructor() {
    this.bruceServer = this.api.baseUrl;
    console.log(this.bruceServer);
  }

  updateServer() {
    const serverInput = prompt('Enter server url (eg: `http://localhost:8080/`)', this.env.BRUCE_URL || '');

    if (serverInput) {
      this.api.updateAxiosClient(serverInput);
      this.bruceServer = serverInput;
    }
  }
}
