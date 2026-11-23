import { Link, useNavigate } from "react-router-dom";
import { useLabInfo } from "@/hooks/queries/useLabInfoQueries";
import { useSecretTap } from "@/hooks/common/useSecretTap";

/** Lab logo + name, linking home. Falls back to the app logo before setup. 7 quick taps open the admin login. */
export function LabMark() {
  const { data: labInfo } = useLabInfo();
  const navigate = useNavigate();
  const logoUrl = labInfo?.logo?.url ?? "/app_logo.png";

  const handleUnlock = () => {
    navigate("/login");
  };
  const handleTap = useSecretTap(handleUnlock);

  return (
    <Link
      to="/"
      onClick={handleTap}
      className="flex min-h-11 min-w-0 items-center gap-3 rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <img src={logoUrl} alt="" className="size-9 shrink-0 object-contain" />
      <span className="truncate font-display text-lg font-bold tracking-tight sm:text-xl">{labInfo?.name ?? ""}</span>
    </Link>
  );
}
