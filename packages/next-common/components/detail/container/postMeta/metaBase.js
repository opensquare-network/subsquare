import User from "../../../user";
import { usePost } from "../../../../context/post";
import clsx from "clsx";
import { Children } from "react";

export default function PostMetaBase({ children, state }) {
  const post = usePost();

  return (
    <div className="flex justify-between items-center">
      <div className="flex">
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
              "before:content-['·'] before:last:hidden before:mx-2 before:text-textTertiary",
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
