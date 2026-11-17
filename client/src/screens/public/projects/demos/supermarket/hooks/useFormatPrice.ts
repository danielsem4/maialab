import { useTranslation } from "react-i18next";
import { formatPrice } from "@/common/utils/supermarketUtils";

/** Formats shekel prices in the current UI language. */
export function useFormatPrice() {
  const { i18n } = useTranslation();
  return function format(amount: number) {
    return formatPrice(amount, i18n.language);
  };
}
