import React, { useRef, useState } from "react";
import { useClickAway } from "react-use";
import { useDetailType } from "next-common/context/page";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import { OptionWrapper } from "next-common/components/internalDropdown/styled";
import { SystemMore } from "@osn/icons/subsquare";
import ReferendaArticleMoreMenu from "next-common/components/articleMoreMenu/referendaArticleMoreMenu";
import DiscussionArticleMoreMenu from "next-common/components/articleMoreMenu/discussionArticleMoreMenu";
import TreasuryBountyArticleMoreMenu from "next-common/components/articleMoreMenu/treasuryBountyArticleMoreMenu";
import FellowshipApplicationArticleMoreMenu from "next-common/components/articleMoreMenu/fellowshipApplicationArticleMoreMenu";
import {
  EditMenuItem,
  ReportMenu,
  LinkOrUnlinkMenu,
} from "next-common/components/articleMoreMenu/common";

export default function ArticleMoreMenu(props) {
  const postType = useDetailType();
  if (postType === detailPageCategory.GOV2_REFERENDUM) {
    return <ReferendaArticleMoreMenu {...props} />;
  }
  if (postType === detailPageCategory.POST) {
    return <DiscussionArticleMoreMenu {...props} />;
  }
  if (postType === detailPageCategory.TREASURY_BOUNTY) {
    return <TreasuryBountyArticleMoreMenu {...props} />;
  }
  if (postType === detailPageCategory.FELLOWSHIP_APPLICATION) {
    return <FellowshipApplicationArticleMoreMenu {...props} />;
  }
  return <_ArticleMoreMenu {...props} />;
}

function _ArticleMoreMenu({ isAuthor, editable, setIsEdit }) {
  const [show, setShow] = useState(false);
  const ref = useRef();
  useClickAway(ref, () => setShow(false));

  return (
    <div ref={ref} className="relative">
      <SystemMore
        className="w-5 h-5 [&_path]:fill-textTertiary cursor-pointer"
        onClick={() => setShow(!show)}
      />
      <OptionWrapper className={!show && "hidden"}>
        {editable && (
          <EditMenuItem
            onClick={() => {
              setIsEdit(true);
              setShow(false);
            }}
          />
        )}
        {editable && isAuthor && <LinkOrUnlinkMenu setShow={setShow} />}
        <ReportMenu setShow={setShow} />
      </OptionWrapper>
    </div>
  );
}
