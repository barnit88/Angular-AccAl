import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    this.pageCount = Math.ceil(this.count / 5);
  }
  @Input() count!: number;
  @Output() pageChange = new EventEmitter<Pagination>();
  // pageCount!: number;
  public pageCount!: number;
  public currentPageNumber = 1;
  private take = 5;

  public onPageNumberClick(pageNumber: number) {
    this.currentPageNumber = pageNumber;
    const pagination: Pagination = this.getPaginationObject(this.currentPageNumber);
    this.pageChange.emit(pagination);
  }

  public onPageDown() {
    if (this.currentPageNumber != 1) {
      this.currentPageNumber = this.currentPageNumber - 1;
      const pagination: Pagination = this.getPaginationObject(this.currentPageNumber);
      this.pageChange.emit(pagination);
    }
  }
  public onPageUp() {
    if (this.currentPageNumber != this.pageCount) {
      this.currentPageNumber = this.currentPageNumber + 1;
      const pagination: Pagination = this.getPaginationObject(this.currentPageNumber);
      this.pageChange.emit(pagination);
    }
  }

  private getPaginationObject(pageNumber: number): Pagination {
    const skip = pageNumber === 1 ? 0 : pageNumber - 1 * this.take;
    const pagination: Pagination = {
      skip: skip,
      take: this.take,
      page_number: pageNumber,
    };
    return pagination;
  }
}

export interface Pagination {
  skip: number;
  take: number;
  page_number: number;
}
