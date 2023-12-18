import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class CardComponent {
  @Input() data!: ICard;
}

export interface ICard {
  cardType: string;
  accessReviewCard?: IAccessReviewCard;
  historyCard?: IHistoryCard;
}
export interface IAccessReviewCard {
  header: string;
  period: number;
  reviewer: string;
  createdDate: string;
  imgSrc: string;
}
export interface IHistoryCard {
  header: string;
  time: string;
  imgSrc: string;
}
