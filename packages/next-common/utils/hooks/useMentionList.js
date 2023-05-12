import { useEffect, useState } from "react";
import {
  getMemberId,
  getMentionList,
  getMentionName,
} from "next-common/utils/post";
import uniqBy from "lodash.uniqby";
import { useUser } from "../../context/user";
import { useChain } from "../../context/chain";
import { isKeyRegisteredUser } from "..";

export default function useMentionList(post, comments) {
  const chain = useChain();
  const [users, setUsers] = useState([]);
  const currentUser = useUser();

  useEffect(() => {
    if (!post) {
      return;
    }

    //combine post author(s) and comment authors but exclude current user
    const users = uniqBy(
      [...(post.author ? [post.author] : []), ...getMentionList(comments)],
      (item) => item.username,
    )
      .concat(
        (post.authors ?? []).map((address) => ({
          username: address,
          address,
          isKeyRegistered: true,
        })),
      )
      .filter((item) => item.username !== currentUser?.username);

    const loadSuggestions = async () => {
      return await Promise.all(
        (users || []).map(async (user) => {
          const name = await getMentionName(user, chain);
          const memberId = getMemberId(user, chain);

          return {
            name,
            value: memberId,
            isKeyRegistered: user.isKeyRegistered ?? isKeyRegisteredUser(user),
          };
        }),
      );
    };

    loadSuggestions().then((suggestions) => {
      setUsers(suggestions);
    });
  }, [chain, post, comments]);

  return users;
}
