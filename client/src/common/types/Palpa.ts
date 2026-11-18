/** A picture answer option. `labelKey` is an i18n key, used as the accessible name. */
export interface IPictureOption {
  id: string;
  emoji: string;
  labelKey: string;
}

/** A letter string in the lexical-decision task: a real word or a made-up one. `textKey` is an i18n key. */
export interface ILexicalItem {
  id: string;
  textKey: string;
  isWord: boolean;
}
