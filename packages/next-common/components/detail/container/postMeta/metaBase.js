import User from "../../../user";
import { usePost } from "../../../../context/post";
import clsx from "clsx";
import { Children } from "react";

export default function PostMetaBase({ children, state }) {
  const post = usePost();

  return (
    <div className="flex justify-between items-center flex-nowrap">
      <div className="flex items-center flex-wrap">
        <User
          user={post.author}
          add={post.proposer || post.finder}
          fontSize={12}
        />

        {Children.toArray(children).map((node, idx) => (
          <div
            key={idx}
            className={clsx(
              "flex items-center",
              "max-sm:hidden",
              "before:content-['·'] before:last:hidden before:mx-2 before:text-textTertiary",
              "empty:before:hidden",
            )}
          >
            {node}
          </div>
        ))}
      </div>

      <div className="flex items-center">{state}</div>
    </div>
  );
}
