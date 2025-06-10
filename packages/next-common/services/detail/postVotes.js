import { backendApi } from "next-common/services/nextApi";
import Cookies from "cookies";

export async function getPostVotesAndMine(detail, context) {
  let options;
  const cookies = new Cookies(context.req, context.res);
  const authToken = cookies.get("auth-token");
  if (authToken) {
    options = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
  }

  let votes = null;
  let myVote = null;
  if (detail.poll) {
    ({ result: votes } = await backendApi.fetch(
      `polls/${detail.poll._id}/votes`,
    ));
    ({ result: myVote } = await backendApi.fetch(
      `polls/${detail.poll._id}/myvote`,
      {},
      options,
    ));
  }

  return {
    votes,
    myVote,
  };
}
