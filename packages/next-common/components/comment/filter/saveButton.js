import { useState } from "react";
import { useDispatch } from "react-redux";
import { SystemSetting } from "@osn/icons/subsquare";
import { useDetailType } from "next-common/context/page";
import { usePost } from "next-common/context/post";
import { useIsPostAuthor } from "next-common/context/post/useIsPostAuthor";
import useIsAdmin from "next-common/hooks/useIsAdmin";
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";
import nextApi from "next-common/services/nextApi";
import { gov2ReferendumsCommentFilterSettingApi } from "next-common/services/url";
import SecondaryButton from "next-common/lib/button/secondary";
import Tooltip from "next-common/components/tooltip";
import {
  newErrorToast,
  newSuccessToast,
} from "next-common/store/reducers/toastSlice";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import { emptyFilterValues } from ".";
import { useCommittedCommentFilterParams } from "./utils";

// Save the current filter state as the default comment filter of the
// referenda, applied to all visitors. Only available to the referenda
// proposer (author) and admins.
export default function SaveReferendaCommentFilterButton() {
  const dispatch = useDispatch();
  const detailType = useDetailType();
  const post = usePost();
  const isAdmin = useIsAdmin();
  const isPostAuthor = useIsPostAuthor();
  const { ensureLogin } = useEnsureLogin();
  const [filterParams] = useCommittedCommentFilterParams();
  const [saving, setSaving] = useState(false);

  if (detailType !== detailPageCategory.GOV2_REFERENDUM) {
    return null;
  }
  if (!isAdmin && !isPostAuthor) {
    return null;
  }

  const referendumIndex =
    post?.referendumIndex ?? post?.onchainData?.referendumIndex;
  if (referendumIndex === undefined || referendumIndex === null) {
    return null;
  }

  async function saveAsDefaultFilter() {
    if (!(await ensureLogin())) {
      return;
    }

    setSaving(true);
    try {
      // Save the full filter state, not only the values different from the
      // empty filter, so that the false values are saved as well
      const filter = { ...emptyFilterValues, ...filterParams };
      const { error } = await nextApi.put(
        gov2ReferendumsCommentFilterSettingApi(referendumIndex),
        { filter },
        { credentials: "include" },
      );

      if (error) {
        dispatch(newErrorToast(error.message));
        return;
      }

      dispatch(
        newSuccessToast("Saved as the default comment filter for all visitors"),
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Tooltip content="Save the current filter settings as the default for all visitors of this proposal">
      <SecondaryButton
        size="small"
        className="!px-[5px]"
        aria-label="Save as default comment filter"
        loading={saving}
        onClick={saveAsDefaultFilter}
      >
        <SystemSetting className="w-4 h-4" />
      </SecondaryButton>
    </Tooltip>
  );
}
