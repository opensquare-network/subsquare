// Used when proposal author has not edited the auto generated post content.

import React from "react";
import styled from "styled-components";
import PostEdit from "./PostEdit";
import PostLink from "./PostLink";
import User from "../../user";
import { useIsPostAuthor } from "../../../context/post/useIsPostAuthor";
import { GreyPanel } from "../../styled/containers/greyPanel";
import NoData from "next-common/components/noData";

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

function WhoCanEdit({ authors = [] }) {
  return (
    <GreyWrapper>
      <span style={{ marginRight: 12 }}>Who can edit?</span>
      {authors.map((author) => (
        <GreyItem key={author}>
          <User add={author} showAvatar={false} fontSize={12} />
        </GreyItem>
      ))}
    </GreyWrapper>
  );
}

export default function NonEdited({ setIsEdit, authors, setShowLinkPopup }) {
  const isAuthor = useIsPostAuthor();
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

      <WhoCanEdit authors={authors} />
    </>
  );
}
