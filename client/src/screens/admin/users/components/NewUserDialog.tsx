import { Plus } from "lucide-react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormField } from "@/components/common/FormField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/LoadingButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useNewUserForm } from "../hooks/useNewUserForm";
import { RoleSelect } from "./RoleSelect";

export function NewUserDialog() {
  const { t } = useTranslation();
  const { open, form, isSubmitting, handleOpenChange, handleSubmit } = useNewUserForm();
  const { register, control, formState } = form;
  const { errors } = formState;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          {t("users.newUser")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("users.newUser")}</DialogTitle>
          <DialogDescription className="sr-only">{t("users.title")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <FormField id="user-name" label={t("users.fields.name")} error={errors.name?.message}>
            <Input id="user-name" dir="auto" autoComplete="off" {...register("name")} />
          </FormField>
          <FormField id="user-email" label={t("users.fields.email")} error={errors.email?.message}>
            <Input id="user-email" type="email" dir="ltr" autoComplete="off" {...register("email")} />
          </FormField>
          <FormField id="user-role" label={t("users.fields.role")}>
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <RoleSelect id="user-role" value={field.value} onChange={field.onChange} className="w-full" />
              )}
            />
          </FormField>
          <FormField id="user-password" label={t("users.fields.password")} error={errors.password?.message}>
            <Input id="user-password" type="password" dir="ltr" autoComplete="new-password" {...register("password")} />
          </FormField>
          <DialogFooter>
            <LoadingButton type="submit" loading={isSubmitting} loadingText={t("common.saving")}>
              {t("common.create")}
            </LoadingButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
