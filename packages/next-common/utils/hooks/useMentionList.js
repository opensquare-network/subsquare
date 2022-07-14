import React, { useEffect, useState } from "react";
import {
  getMentionList,
  getMentionName,
  getMemberId,
} from "next-common/utils/post";
import uniqBy from "lodash.uniqby";
import { useSelector } from "react-redux";
import { userSelector } from "../../store/reducers/userSlice";

export default function useMentionList(post, comments, chain) {
  const [users, setUsers] = useState([]);
  const currentUser = useSelector(userSelector);

  useEffect(() => {
    if (!post) {
      return;
    }

    const users = uniqBy(
      [...(post.author ? [post.author] : []), ...getMentionList(comments)],
      (item) => item.username
    ).filter((item) => item.username !== currentUser?.username);

    const loadSuggestions = async () => {
      return await Promise.all(
        (users || []).map(async (user) => {
          const name = await getMentionName(user, chain);
          const memberId = getMemberId(user, chain);
          return {
            name,
            value: memberId,
            isKeyRegistered: user.username.includes(`polkadot-key`),
          };
        })
      );
    };

    loadSuggestions().then((suggestions) => {
      setUsers(suggestions);
    });
  }, [chain, post, comments]);

  return users;
}
