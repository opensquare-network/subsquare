import { usePathname } from "next/navigation";

export function ProfilePageGuard({ children }) {
  const pathname = usePathname();
  if (!pathname.startsWith("/user/")) {
    return null;
  }

  return children;
}

export function AccountMultisigPageGuard({ children }) {
  const pathname = usePathname();
  if (!pathname.startsWith("/account/multisigs")) {
    return null;
  }

  return children;
}
