import React, { useCallback, useState } from "react";
import Popup from "../popup/wrapper/Popup";
import { noop } from "lodash-es";
import PrimaryButton from "next-common/lib/button/primary";
import { PopupButtonWrapper } from "../popup/wrapper";
import RadioOptionGroup from "next-common/components/radioOptionGroup";
import nextApi from "next-common/services/nextApi";
import { usePost } from "next-common/context/post";
import { useDispatch } from "react-redux";
import {
  newErrorToast,
  newSuccessToast,
} from "next-common/store/reducers/toastSlice";
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";

const options = [
  {
    value: "malicious",
    label: "This proposal is malicious",
  },
  {
    value: "abusive",
    label: "This proposal includes abusive or hateful content",
  },
  {
    value: "spam",
    label: "It appears that the proposer's account is hacked",
  },
  {
    value: "duplicate",
    label: "It’s a duplicated proposal",
  },
];

export default function ReportPopup({ setShow = noop }) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState("malicious");
  const post = usePost();
  const { ensureLogin } = useEnsureLogin();

  const doReport = useCallback(async () => {
    if (!post) {
      dispatch(newErrorToast("Cannot read the current post"));
      return;
    }

    setIsLoading(true);
    try {
      if (!(await ensureLogin())) {
        return;
      }

      const reason = options.find(
        (item) => item.value === selectedOption,
      ).label;

      let postType = "post";
      let postId = post._id;

      if (post.rootPost) {
        postType = post.rootPost.postType;
        postId = post.rootPost.postId;
      }

      const { result, error } = await nextApi.post("report", {
        postType,
        postId,
        reason,
      });

      if (result) {
        dispatch(newSuccessToast("Reported successfully"));
      }

      if (error) {
        dispatch(newErrorToast(error.message));
      }

      setShow(false);
    } finally {
      setIsLoading(false);
    }
  }, [post, dispatch, ensureLogin, setShow, selectedOption]);

  return (
    <Popup title="Report" onClose={() => setShow(false)}>
      <div className="text-[14px] text-textPrimary">
        <div className="font-bold mb-[16px]">What’s the problem?</div>
        <RadioOptionGroup
          options={options}
          selected={selectedOption}
          setSelected={setSelectedOption}
        />
      </div>
      <PopupButtonWrapper>
        <PrimaryButton loading={isLoading} onClick={doReport}>
          Submit
        </PrimaryButton>
      </PopupButtonWrapper>
    </Popup>
  );
}
