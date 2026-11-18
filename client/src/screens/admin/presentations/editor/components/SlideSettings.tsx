import { useTranslation } from "react-i18next";
import type { IDeckTheme, ISlide } from "@/common/types/Deck";
import { ColorField } from "@/components/deck/fields/ColorField";
import { Button } from "@/components/ui/button";
import { themeColorVar } from "@/lib/deck/colors";
import { setSlideBackground } from "../editorCommands";

interface SlideSettingsProps {
  slide: ISlide;
  theme: IDeckTheme;
}

function handleUseTheme() {
  setSlideBackground(undefined);
}

/** Shown when nothing is selected. */
export function SlideSettings({ slide, theme }: SlideSettingsProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-3">
      <ColorField
        id="slide-background"
        label={t("decks.inspector.slideBackground")}
        value={slide.background ?? themeColorVar("background")}
        theme={theme}
        onChange={setSlideBackground}
      />
      <Button type="button" variant="outline" size="sm" onClick={handleUseTheme} disabled={slide.background === undefined}>
        {t("decks.inspector.useTheme")}
      </Button>
    </div>
  );
}
