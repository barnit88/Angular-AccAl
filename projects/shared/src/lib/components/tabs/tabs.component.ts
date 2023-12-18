import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TabItem } from './tab.interfaace';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent {
  @Input() tabItems!: TabItem[];
  @Output() activeTab: EventEmitter<string> = new EventEmitter<string>();
  @Input() hideTabSpacing!: boolean;

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
