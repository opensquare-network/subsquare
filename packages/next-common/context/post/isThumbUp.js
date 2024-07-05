import { useConnectedAccount } from "../connectedAccount";
import { useUser } from "../user";
import { usePost } from "./index";

export function useIsThumbUp() {
  const user = useUser();
  const post = usePost();
  const connectedAccount = useConnectedAccount();

  if (!user && !connectedAccount) {
    return false;
  }

  return (
    post?.reactions?.findIndex(
      (r) =>
        r.user?.username === user.username ||
        r.proposer === connectedAccount.address,
    ) > -1
  );
}
