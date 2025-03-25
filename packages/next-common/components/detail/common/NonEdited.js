// Used when proposal author has not edited the auto generated post content.

import React, { useState } from "react";
import styled from "styled-components";
import PostEdit from "./PostEdit";
import PostLink from "./PostLink";
import { useIsPostAuthor } from "../../../context/post/useIsPostAuthor";
import { GreyPanel } from "../../styled/containers/greyPanel";
import NoData from "next-common/components/noData";
import AddressUser from "next-common/components/user/addressUser";
import { usePost } from "next-common/context/post";
import dynamicPopup from "next-common/lib/dynamic/popup";

const PostLinkPopup = dynamicPopup(() =>
  import("../../linkPost/postLinkPopup"),
);

const GreyWrapper = styled(GreyPanel)`
  flex-flow: wrap;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 22px;
  padding: 8px 12px;
  margin-top: 16px;
`;

const GreyItem = styled.div`
  display: inline-block;
  margin-right: 12px;

  > .username {
    color: var(--textSecondary);
  }
`;

function WhoCanEdit() {
  const post = usePost();

  return (
    <GreyWrapper>
      <span className="mr-3 text-textPrimary">Who can edit?</span>
      {post?.authors?.map((author) => (
        <GreyItem key={author}>
          <AddressUser
            add={author}
            showAvatar={false}
            className="text12Medium text-textPrimary"
          />
        </GreyItem>
      ))}
    </GreyWrapper>
  );
}

export default function NonEdited({ setIsEdit }) {
  const isAuthor = useIsPostAuthor();
  const [showLinkPopup, setShowLinkPopup] = useState(false);

  return (
    <>
      <NoData
        text={
          <>
            {"No context provided."}
            {isAuthor && (
              <>
                <PostEdit setIsEdit={setIsEdit} />
                {", or link a post"}
                <PostLink onClick={() => setShowLinkPopup(true)} />
              </>
            )}
          </>
        }
      />

      <WhoCanEdit />
      {showLinkPopup && <PostLinkPopup setShow={setShowLinkPopup} />}
    </>
  );
}
