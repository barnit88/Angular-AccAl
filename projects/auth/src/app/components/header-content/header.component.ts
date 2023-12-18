import { Component } from '@angular/core';
import type { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EnvironmentVarService } from 'shared';

/* @figmaId 1186:1404 */
@Component({
  selector: 'acc-auth-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  logoSrc = 'assets/officialLogo.svg';

  constructor(private env: EnvironmentVarService, private router: Router) {
    // nothing here
  }

  ngOnInit(): void {
    // nothing here
  }

  navToHome() {
    // nothing here
    window.location.href = this.env.LAND_BASE;
  }

  contactUs() {
    window.open('https://airtable.com/shrtNZdeX5ToT9kJT', '_blank');
  }
}
