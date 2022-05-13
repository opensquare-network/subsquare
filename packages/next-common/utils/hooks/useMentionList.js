import React, { useEffect, useState } from "react";
import { getMentionList, getMentionName, getMemberId } from "next-common/utils/post";
import uniqBy from "lodash.uniqby";

export default function useMentionList(post, comments, chain) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!post) {
      return;
    }

    const users = uniqBy(
      [
        ...(post.author ? [post.author] : []),
        ...getMentionList(comments),
      ],
      (item) => item.username
    );

    const loadSuggestions = async () => {
      return await Promise.all(
        (users || []).map(async (user) => {
          const name = await getMentionName(user, chain);
          const memberId = getMemberId(user, chain);
          return {
            name,
            value: memberId,
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
