import { useEffect, useState } from "react";
import {
  getMemberId,
  getMentionList,
  getMentionName,
} from "next-common/utils/post";
import { flatten, uniqBy } from "lodash-es";
import { useUser } from "../../context/user";
import { useChain } from "../../context/chain";
import { addressEllipsis, isKeyRegisteredUser, isSameAddress } from "..";
import { tryConvertToEvmAddress } from "../mixedChainUtil";
import { usePolkassemblyCommentRepliesContext } from "next-common/hooks/polkassembly/usePolkassemblyCommentReply";
import { useComments } from "next-common/context/post/comments";
import { usePost } from "next-common/context/post";

export default function useMentionList(commentsData) {
  const chain = useChain();
  const [users, setUsers] = useState([]);
  const currentUser = useUser();
  const post = usePost();
  const { polkassemblyCommentReplies } = usePolkassemblyCommentRepliesContext();
  let comments = useComments();
  comments = commentsData || comments;

  useEffect(() => {
    if (!post) {
      return;
    }

    //combine post author(s) and comment authors but exclude current user
    let userAppearances = getMentionList(comments);
    userAppearances = [
      ...userAppearances,
      ...flatten(Object.values(polkassemblyCommentReplies || {})).map(
        (reply) => reply.author,
      ),
    ];
    if (post.author) {
      userAppearances.push(post.author);
    } else if (post.proposer) {
      const exists = userAppearances.find((item) =>
        isSameAddress(item.address, post.proposer),
      );
      if (!exists) {
        const maybeEvmAddress = tryConvertToEvmAddress(post.proposer);
        userAppearances.push({
          username: addressEllipsis(maybeEvmAddress),
          address: maybeEvmAddress,
        });
      }
    }
    userAppearances = uniqBy(userAppearances, (item) => item.username);
    for (const address of post.authors ?? []) {
      const existing = userAppearances.find((item) =>
        isSameAddress(item.address, address),
      );
      if (existing) {
        continue;
      }
      const maybeEvmAddress = tryConvertToEvmAddress(address);
      userAppearances.push({
        username: addressEllipsis(maybeEvmAddress),
        address,
        isKeyRegistered: true,
      });
    }
    userAppearances = userAppearances.filter(
      (item) => item.username !== currentUser?.username,
    );

    const loadSuggestions = async () => {
      return await Promise.all(
        (userAppearances || []).map(async (user) => {
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
  }, [
    chain,
    post,
    comments,
    currentUser?.username,
    polkassemblyCommentReplies,
  ]);

  return users;
}
