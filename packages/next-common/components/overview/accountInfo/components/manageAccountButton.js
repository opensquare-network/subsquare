import Link from "next/link";
import useAccountUrl from "next-common/hooks/account/useAccountUrl";

export default function ManageAccountButton() {
  const link = useAccountUrl();

  return (
    <div className="flex items-end justify-end !mt-2">
      <Link href={link || ""} className="text14Medium text-theme500">
        Manage Account
      </Link>
    </div>
  );
}
