import { useMyUpVote } from "./useMyUpVote";

export function useIsThumbUp() {
  const myUpVote = useMyUpVote();
  return !!myUpVote;
}
