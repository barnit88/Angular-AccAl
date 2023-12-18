import { Component, Input } from '@angular/core';
import type { OnInit } from '@angular/core';

/* @figmaId 1183:1415 */
@Component({
  selector: 'acc-text-content',
  templateUrl: './text-content.component.html',
  styleUrls: ['./text-content.component.scss'],
})
export class TextContentComponent implements OnInit {
  @Input() login: boolean | undefined;
  constructor() {
    // test
  }
  ngOnInit(): void {
    // test
  }
}
