import React, { useState } from "react";
import noop from "lodash.noop";
import dayjs from "dayjs";
import styled, { css } from "styled-components";
import EventTag from "../eventInfoCard/eventTag";
import FoldButton from "../eventInfoCard/foldButton";
import DeleteSVG from "./delete.svg";
import { flex, gap_x } from "../../../../styles/tailwindcss";
import Flex from "../../../styled/flex";
import DeleteEventModal from "./deleteEventModal";
import { useIsLogin } from "../../../../context/user";
import Tooltip from "next-common/components/tooltip";
import useIsAdmin from "next-common/hooks/useIsAdmin";

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  font-family: "Inter";
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  gap: 8px;

  color: var(--textPrimary);

  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

const Left = styled.div`
  flex: 1;
  word-break: break-word;
  ${flex}
  ${gap_x(4)}
`;

const Right = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
`;

const DeleteWrapper = styled(Flex)`
  cursor: pointer;
  justify-content: center;
  border: 1px solid var(--neutral400);
  border-radius: 2px;
  width: 20px;
  height: 20px;
  > svg path {
    fill: var(--textSecondary);
  }
  ${(p) =>
    p.disabled &&
    css`
      cursor: auto;
      opacity: 0.3;
    `}
`;

function getTitle(event) {
  const timeText = dayjs(event?.timestamp).format("HH:mm");

  return (
    <span>
      [{timeText}] {event.title}
    </span>
  );
}

function DeleteButton({ disabled, onClick = noop }) {
  return (
    <Tooltip content={disabled ? "Only admins can delete events" : ""}>
      <div>
        <DeleteWrapper
          disabled={disabled}
          onClick={() => {
            if (disabled) {
              return;
            }
            onClick();
          }}
        >
          <DeleteSVG />
        </DeleteWrapper>
      </div>
    </Tooltip>
  );
}

export default function Title({
  event,
  isFolded,
  setIsFolded = noop,
  refresh,
}) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const isAdmin = useIsAdmin();
  const isLogin = useIsLogin();

  return (
    <Wrapper>
      <Left>{getTitle(event)}</Left>
      <Right>
        <div>
          <EventTag event={event} />
        </div>
        {isLogin && (
          <DeleteButton
            onClick={() => setShowDeleteModal(true)}
            disabled={!isAdmin}
          />
        )}
        <div>
          <FoldButton
            onClick={() => setIsFolded(!isFolded)}
            isFolded={isFolded}
          />
        </div>
      </Right>
      {showDeleteModal && (
        <DeleteEventModal
          event={event}
          onClose={() => setShowDeleteModal(false)}
          refresh={refresh}
        />
      )}
    </Wrapper>
  );
}
