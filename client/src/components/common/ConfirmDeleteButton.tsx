import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ConfirmDeleteButtonProps {
  name: string;
  onConfirm: () => void;
  disabled?: boolean;
  /** Show the word "Delete" next to the icon. */
  withLabel?: boolean;
}

export function ConfirmDeleteButton({ name, onConfirm, disabled, withLabel }: ConfirmDeleteButtonProps) {
  const { t } = useTranslation();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant={withLabel ? "outline" : "ghost"}
          size={withLabel ? "default" : "icon"}
          disabled={disabled}
          aria-label={t("common.delete")}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="size-4" />
          {withLabel && t("common.delete")}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("common.confirmDeleteTitle", { name })}</AlertDialogTitle>
          <AlertDialogDescription>{t("common.confirmDeleteDesc")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>{t("common.delete")}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
