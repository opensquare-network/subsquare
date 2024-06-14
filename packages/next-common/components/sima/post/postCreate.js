import React, { useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import Input from "../../input";
import nextApi from "../../../services/nextApi";
import { Label, LabelWrapper } from "../../post/styled";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import ErrorText from "next-common/components/ErrorText";
import PrimaryButton from "next-common/lib/button/primary";
import { TitleContainer } from "../../styled/containers/titleContainer";
import { useUser } from "../../../context/user";
import { NeutralPanel } from "../../styled/containers/neutralPanel";
import Editor from "../../editor";
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";
import { useSignMessage } from "next-common/hooks/useSignMessage";
import { getCookieConnectedAccount } from "next-common/utils/getCookieConnectedAccount";

const Wrapper = styled(NeutralPanel)`
  color: var(--textPrimary);
  border: 0;
  box-shadow: none;
  textarea:read-only,
  div.ql-disabled {
    background-color: var(--neutral200) !important;
  }

  div + textarea {
    border-color: var(--neutral400);
  }
  input {
    color: var(--textPrimary);
  }

  @media screen and (max-width: 768px) {
    margin-left: -16px;
    margin-right: -16px;
    border-radius: 0;
    padding: 24px;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 32px;

  > :not(:first-child) {
    margin-left: 12px;
  }
`;

export default function SimaPostCreate() {
  const user = useUser();
  const router = useRouter();
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [creating, setCreating] = useState(false);
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState(
    user?.preference?.editor || "markdown",
  );
  const [errors, setErrors] = useState();
  const { ensureConnect } = useEnsureLogin();
  const signMessage = useSignMessage();

  const createPost = async () => {
    setCreating(true);

    try {
      if (!(await ensureConnect())) {
        return;
      }

      const connectedAccount = getCookieConnectedAccount();
      const contentFormat = contentType === "html" ? "HTML" : "subsquare_md";
      const entity = {
        action: "new_discussion",
        title,
        content,
        content_format: contentFormat,
        timestamp: Date.now(),
      };
      const address = connectedAccount.address;
      const signerWallet = connectedAccount.wallet;
      const signature = await signMessage(
        JSON.stringify(entity),
        address,
        signerWallet,
      );
      const data = {
        entity,
        address,
        signature,
        signerWallet,
      };
      const { result, error } = await nextApi.post("sima/discussions", data);
      if (error) {
        if (error.data) {
          setErrors(error);
        } else {
          dispatch(newErrorToast(error.message));
        }
      } else {
        const { postUid } = result;
        router.push(`/posts/${postUid}`);
      }
    } finally {
      setCreating(false);
    }
  };

  const isDisableCreate = !title || !content;

  return (
    <Wrapper>
      <TitleContainer className="!px-0">New Post</TitleContainer>
      <LabelWrapper>
        <Label>Title</Label>
      </LabelWrapper>
      <Input
        disabled={creating}
        placeholder="Please fill the title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {errors?.data?.title?.[0] && (
        <ErrorText>{errors?.data?.title?.[0]}</ErrorText>
      )}

      <LabelWrapper>
        <Label>Issue</Label>
      </LabelWrapper>

      <Editor
        value={content}
        onChange={setContent}
        contentType={contentType}
        setContentType={setContentType}
        loadSuggestions={() => []}
        minHeight={300}
        setQuillRef={() => {}}
      />
      {errors?.data?.content?.[0] && (
        <ErrorText>{errors?.data?.content?.[0]}</ErrorText>
      )}

      <ButtonWrapper>
        <PrimaryButton
          loading={creating}
          onClick={createPost}
          disabled={isDisableCreate}
        >
          Create
        </PrimaryButton>
      </ButtonWrapper>
    </Wrapper>
  );
}
