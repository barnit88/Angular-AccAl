export interface IStateDialogData {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  ctaLabel?: string;
  onAction?: () => Promise<any>;
}
