import { Link } from "react-router-dom";
import { useLabInfo } from "@/hooks/queries/useLabInfoQueries";

/** Lab logo + name, linking home. Falls back to the app logo before setup. */
export function LabMark() {
  const { data: labInfo } = useLabInfo();
  const logoUrl = labInfo?.logo?.url ?? "/app_logo.png";

  return (
    <Link to="/" className="flex items-center gap-3 rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
      <img src={logoUrl} alt="" className="size-9 object-contain" />
      <span className="font-display text-xl font-bold tracking-tight">{labInfo?.name ?? ""}</span>
    </Link>
  );
}
