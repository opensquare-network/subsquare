import React from "react";
import { useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import Header from "./header";
import Options from "./options";
import VoteButton from "./voteButton";
import nextApi from "../../services/nextApi";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { useDispatch } from "react-redux";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export default function Poll({ chain, poll, votes, myVote }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [selectedOption, setSelectedOption] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!poll || !votes) {
    return null;
  }

  const disabled = !selectedOption || selectedOption === myVote?.option;
  const expired = Date.now() > poll.expiresTime;

  const onVote = async () => {
    setIsSubmitting(true);
    try {
      const { result, error } = await nextApi.put(`polls/${poll._id}/vote`, {
        option: selectedOption,
      });
      if (result) {
        router.replace(router.asPath);
      }
      if (error) {
        dispatch(newErrorToast(error.message));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Wrapper>
      <Header {...poll} />
      <Options
        {...poll}
        votes={votes}
        myVote={myVote}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        selectable={!expired}
        chain={chain}
      />
      {!expired && (
        <VoteButton
          onClick={onVote}
          disabled={disabled}
          isSubmitting={isSubmitting}
        />
      )}
    </Wrapper>
  );
}
