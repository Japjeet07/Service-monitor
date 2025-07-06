
import { Service } from '@/types/service';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';

interface DeleteServiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  service?: Service;
  isLoading?: boolean;
}

export const DeleteServiceDialog = ({ isOpen, onClose, onConfirm, service, isLoading }: DeleteServiceDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Service</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{service?.name}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="button" 
            variant="destructive" 
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete Service'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
