import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import type { IDeck } from "@/common/types/Deck";
import { useCreateDeck } from "@/hooks/queries/useDeckQueries";

export const BLANK_TEMPLATE = "blank";

export function useNewDeckDialog() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [templateId, setTemplateId] = useState(BLANK_TEMPLATE);
  const [showError, setShowError] = useState(false);

  const handleCreated = (deck: IDeck) => {
    navigate(`/admin/presentations/${deck.id}/edit`);
  };

  const create = useCreateDeck(handleCreated);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) return;
    setTitle("");
    setTemplateId(BLANK_TEMPLATE);
    setShowError(false);
  };

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = title.trim();
    setShowError(!trimmed);
    if (!trimmed) return;
    create.mutate({ title: trimmed, templateId: templateId === BLANK_TEMPLATE ? undefined : Number(templateId) });
  };

  return {
    open,
    title,
    templateId,
    titleError: showError && !title.trim() ? "decks.titleRequired" : undefined,
    isSubmitting: create.isPending,
    handleOpenChange,
    handleTitleChange,
    handleTemplateChange: setTemplateId,
    handleSubmit,
  };
}
