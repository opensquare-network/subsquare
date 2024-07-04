import { useConnectedAccount } from "../connectedAccount";
import { useUser } from "../user";
import { usePost } from "./index";

export function useMyUpVote() {
  const post = usePost();
  const user = useUser();
  const connectedAccount = useConnectedAccount();

  if (!user && !connectedAccount) {
    return false;
  }

  return post?.reactions?.find(
    (r) =>
      r.user?.username === user?.username ||
      r.proposer === connectedAccount.address,
  );
}
