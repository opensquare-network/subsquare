import React from "react";
import styled from "styled-components";
import Link from "next/link";
import ErrorText from "next-common/components/ErrorText";
import { SystemCheckboxOff, SystemCheckboxOn } from "@osn/icons/subsquare";

const Wrapper = styled.div`
  margin-top: 16px !important;
  > :not(:first-child) {
    margin-top: 8px;
  }
`;

const ClickWrapper = styled.div`
  display: flex;
  align-items: flex-start;
`;

const Text = styled.div`
  font-size: 14px;
  line-height: 140%;
  color: var(--textTertiary);
  a {
    color: var(--theme500);
  }
`;

function CheckBox({ checked, setChecked, setAgreeError }) {
  return (
    <span
      role="checkbox"
      className="mr-2"
      onClick={() => {
        setChecked(!checked);
        setAgreeError(null);
      }}
    >
      {checked ? (
        <SystemCheckboxOn className="w-5 h-5 [&_rect]:fill-theme500" />
      ) : (
        <SystemCheckboxOff className="w-5 h-5" />
      )}
    </span>
  );
}

export default function UserPolicy({
  checked,
  setChecked,
  agreeError,
  setAgreeError,
}) {
  return (
    <Wrapper>
      <ClickWrapper>
        <CheckBox
          checked={checked}
          setChecked={setChecked}
          setAgreeError={setAgreeError}
        />
        <Text>
          I have read and agree to the{" "}
          <Link onClick={(e) => e.stopPropagation()} href="/terms">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link onClick={(e) => e.stopPropagation()} href="/privacy">
            Privacy Policy
          </Link>
          .
        </Text>
      </ClickWrapper>
      {agreeError && <ErrorText>{agreeError}</ErrorText>}
    </Wrapper>
  );
}
