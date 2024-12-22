import { Dialog, DialogContent } from '@shared/components/ui/dialog';
import { env } from '@shared/constants/env.constant';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceId: string;
}

export function InvoiceModal({
  isOpen,
  onClose,
  invoiceId,
}: InvoiceModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-h-[85vh] min-w-[80vw]">
        <iframe
          src={`${env.apiBaseUrl}/getInvoice?invoiceId=${invoiceId}`}
          className="h-[calc(85vh-50px)] w-full"
          title="Invoice Details"
        />
      </DialogContent>
    </Dialog>
  );
}
