import { useTranslation } from "react-i18next";
import type { IDemoTaskProps } from "@/common/types/Demo";
import { ChoiceButton } from "../../components/ChoiceButton";
import { TaskLayout } from "../../components/TaskLayout";
import { ShapeIcon } from "../../components/ShapeIcon";
import { FOLLOW_SHAPES, useFollowInstructions } from "../hooks/useFollowInstructions";

export function FollowInstructionsTask({ onComplete }: IDemoTaskProps) {
  const { t } = useTranslation();
  const { taps, handleSelect } = useFollowInstructions(onComplete);

  return (
    <TaskLayout instruction={t("demos.hitber.tasks.follow.instruction")}>
      <div className="flex size-full items-center justify-center pb-8">
        <div className="grid grid-cols-3 gap-8">
          {FOLLOW_SHAPES.map((shape) => {
            const order = taps.indexOf(shape.id);
            return (
              <ChoiceButton
                key={shape.id}
                value={shape.id}
                onSelect={handleSelect}
                aria-label={t(`demos.hitber.tasks.follow.${shape.id}`)}
                aria-pressed={order >= 0}
                className="relative flex size-40 items-center justify-center p-6"
              >
                <ShapeIcon kind={shape.kind} shapeClassName={shape.fillClassName} />
                {order >= 0 && (
                  <span className="absolute -end-3 -top-3 flex size-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                    {order + 1}
                  </span>
                )}
              </ChoiceButton>
            );
          })}
        </div>
      </div>
    </TaskLayout>
  );
}
