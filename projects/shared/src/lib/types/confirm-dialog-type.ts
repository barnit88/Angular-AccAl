export interface IConfirmationDialogData {
  title?: string;
  message: string;
  onConfirm?: () => Promise<void>;
}
