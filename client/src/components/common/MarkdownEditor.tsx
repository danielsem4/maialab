import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { MarkdownView } from "./MarkdownView";

interface MarkdownEditorProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}

export function MarkdownEditor({ id, value, onChange, rows = 12 }: MarkdownEditorProps) {
  const { t } = useTranslation();

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };

  return (
    <Tabs defaultValue="write">
      <TabsList>
        <TabsTrigger value="write">{t("markdown.write")}</TabsTrigger>
        <TabsTrigger value="preview">{t("markdown.preview")}</TabsTrigger>
      </TabsList>
      <TabsContent value="write" className="space-y-1">
        <Textarea id={id} value={value} onChange={handleChange} rows={rows} dir="auto" />
        <p className="text-xs text-muted-foreground">{t("markdown.hint")}</p>
      </TabsContent>
      <TabsContent value="preview">
        <div className="min-h-40 rounded-md glass px-4 py-2">
          {value.trim() ? (
            <MarkdownView content={value} />
          ) : (
            <p className="py-4 text-sm text-muted-foreground">{t("markdown.emptyPreview")}</p>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
