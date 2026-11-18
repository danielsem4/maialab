import { ArrowDown, ArrowDownToLine, ArrowUp, ArrowUpToLine, type LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import type { LayerMove } from "@/lib/deck/deckOps";
import { moveSelectionLayer } from "../editorCommands";

const MOVES: { move: LayerMove; labelKey: string; icon: LucideIcon }[] = [
  { move: "front", labelKey: "decks.inspector.bringToFront", icon: ArrowUpToLine },
  { move: "forward", labelKey: "decks.inspector.bringForward", icon: ArrowUp },
  { move: "backward", labelKey: "decks.inspector.sendBackward", icon: ArrowDown },
  { move: "back", labelKey: "decks.inspector.sendToBack", icon: ArrowDownToLine },
];

interface LayerButtonProps {
  move: LayerMove;
  label: string;
  icon: LucideIcon;
}

function LayerButton({ move, label, icon: Icon }: LayerButtonProps) {
  const handleClick = () => {
    moveSelectionLayer(move);
  };

  return (
    <Button type="button" variant="outline" size="icon" onClick={handleClick} aria-label={label} title={label}>
      <Icon className="size-4" />
    </Button>
  );
}

export function LayerButtons() {
  const { t } = useTranslation();

  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{t("decks.inspector.layer")}</p>
      <div className="flex gap-1">
        {MOVES.map(({ move, labelKey, icon }) => (
          <LayerButton key={move} move={move} label={t(labelKey)} icon={icon} />
        ))}
      </div>
    </div>
  );
}
