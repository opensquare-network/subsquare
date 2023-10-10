import { useAdmins } from "next-common/context/admin";
import { useUser } from "next-common/context/user";

export default function useIsAdmin() {
  const user = useUser();
  const admins = useAdmins();
  return admins?.includes(user?.address);
}
