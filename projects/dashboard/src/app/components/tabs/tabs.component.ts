/**
 * REMOVE this component after few iteration, this has been moved to shared.
 */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TabItem } from './tab.interfaace';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class TabsComponent {
  @Input() tabItems!: TabItem[];
  @Output() activeTab: EventEmitter<string> = new EventEmitter<string>();

  activeItem!: string;

  get active(): string {
    if (!this.activeItem) {
      const item = this.tabItems.find(x => x.active);
      if (item) return item.item;
      return 'default';
    } else {
      return this.activeItem;
    }
  }

  public tabChange(item: TabItem): void {
    const activatedItem = this.tabItems.find(x => x.active);
    if (activatedItem) activatedItem.active = false;
    const itemToActivate = this.tabItems.find(x => x.item == item.item);
    if (itemToActivate) {
      itemToActivate.active = true;
      this.activeItem = itemToActivate.item;
    } else {
      throw Error('Unexpected operation.');
    }
    this.activeTab.emit(this.active);
  }
}
