import { useTranslation } from "react-i18next";
import type { IDemoTaskProps } from "@/common/types/Demo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TaskLayout } from "../../components/TaskLayout";
import { BlankCard } from "../components/BlankCard";
import { HousePicture } from "../components/HousePicture";
import { MODEL_CARD_ORIGIN, PIECE_IDS, PIECES, TARGET_CARD_ORIGIN } from "../components/housePieces";
import { ShapeIcon } from "../../components/ShapeIcon";
import { useCopyShape } from "../hooks/useCopyShape";

export function CopyShapeTask({ onComplete }: IDemoTaskProps) {
  const { t } = useTranslation();
  const { containerRef, activeId, handlersFor, handleDone } = useCopyShape(onComplete);

  return (
    <TaskLayout instruction={t("demos.hitber.tasks.copy.instruction")}>
      <div ref={containerRef} className="relative size-full">
        <HousePicture origin={MODEL_CARD_ORIGIN} label={t("demos.hitber.tasks.copy.model")} />
        <BlankCard origin={TARGET_CARD_ORIGIN} label={t("demos.hitber.tasks.copy.yours")} />
        {PIECE_IDS.map((id) => {
          const piece = PIECES[id];
          const { style, ...handlers } = handlersFor(id);
          return (
            <div
              key={id}
              {...handlers}
              role="img"
              aria-label={t(`demos.hitber.tasks.copy.${id}`)}
              className={cn(
                "absolute -translate-x-1/2 -translate-y-1/2 cursor-grab drop-shadow-md",
                activeId === id && "z-10 cursor-grabbing drop-shadow-xl",
              )}
              style={{ ...style, width: piece.width, height: piece.height }}
            >
              <ShapeIcon kind={piece.kind} shapeClassName={piece.fillClassName} />
            </div>
          );
        })}
        <Button size="lg" className="absolute end-8 bottom-6 h-14 px-10 text-lg" onClick={handleDone}>
          {t("demos.common.next")}
        </Button>
      </div>
    </TaskLayout>
  );
}
