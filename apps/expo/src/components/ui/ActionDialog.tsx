import type { ReactNode } from "react";
import { useState } from "react";

import { Button } from "./button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Text } from "./text";

type ActionDialogAsyncProps =
  | {
      onSubmit?: () => Promise<void>;
      async: true;
    }
  | {
      onSubmit?: () => void;
      async?: false;
    };

type ActionDialogProps = {
  trigger?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  closeOnSubmit?: boolean;
  destructive?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onCacel?: () => void;
} & ActionDialogAsyncProps;

export function ActionDialog({
  title,
  trigger,
  onSubmit,
  closeOnSubmit = true,
  async,
  destructive,
  description,
  ...props
}: ActionDialogProps) {
  const [_open, _setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const open = props.open ?? _open;
  const setOpen = props.onOpenChange ?? _setOpen;

  const handleSubmit = async () => {
    if (async) {
      setLoading(true);
      await onSubmit?.();
      setLoading(false);
    } else {
      onSubmit?.();
    }
    if (closeOnSubmit) {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} className="w-full">
      <DialogContent>
        <DialogTitle>{title}</DialogTitle>
        {description && <DialogDescription>{description}</DialogDescription>}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">
              <Text>Cancel</Text>
            </Button>
          </DialogClose>
          <Button
            variant={destructive ? "destructive" : "default"}
            loading={loading}
            onPress={handleSubmit}
          >
            <Text>{destructive ? "Delete" : "Submit"}</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
    </Dialog>
  );
}
