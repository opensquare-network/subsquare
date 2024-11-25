import { useUser } from "../user";
import { usePost } from "./index";
import { useDetailType } from "../page";
import { useEffect, useState } from "react";
import { isSameAddress } from "next-common/utils";
import { detailPageCategory } from "next-common/utils/consts/business/category";

export function useIsPostAuthor() {
  const user = useUser();
  const post = usePost();
  const type = useDetailType();
  const [isAuthor, setIsAuthor] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsAuthor(false);
    } else if (type === detailPageCategory.POST) {
      if (post.dataSource === "sima") {
        setIsAuthor(isSameAddress(post.proposer, user.address));
      } else {
        setIsAuthor(post.author?.username === user.username);
      }
    } else {
      setIsAuthor(
        post?.authors?.some((address) => isSameAddress(address, user.address)),
      );
    }
  }, [user, type, post]);

  return isAuthor;
}
