import React from "react";
import styled from "styled-components";
import Link from "next-common/components/link";
import ErrorText from "next-common/components/ErrorText";
import {
  SystemCheckboxDisabled,
  SystemCheckboxOff,
  SystemCheckboxOn,
} from "@osn/icons/subsquare";

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

function CheckBox({ disabled, checked, setChecked, setAgreeError }) {
  return (
    <span
      className="mr-2"
      onClick={() => {
        if (disabled) {
          return;
        }
        setChecked(!checked);
        setAgreeError(null);
      }}
    >
      {disabled ? (
        <SystemCheckboxDisabled className="w-5 h-5" />
      ) : checked ? (
        <SystemCheckboxOn className="w-5 h-5 [&_rect]:fill-theme500" />
      ) : (
        <SystemCheckboxOff className="w-5 h-5" />
      )}
    </span>
  );
}

export default function UserPolicy({
  disabled,
  checked,
  setChecked,
  agreeError,
  setAgreeError,
}) {
  return (
    <Wrapper>
      <ClickWrapper>
        <CheckBox
          disabled={disabled}
          checked={checked}
          setChecked={setChecked}
          setAgreeError={setAgreeError}
        />
        <Text>
          I have read and agree to the{" "}
          <Link
            onClick={(e) => e.stopPropagation()}
            href="/terms"
            target="_blank"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            onClick={(e) => e.stopPropagation()}
            href="/privacy"
            target="_blank"
          >
            Privacy Policy
          </Link>
          .
        </Text>
      </ClickWrapper>
      {agreeError && <ErrorText>{agreeError}</ErrorText>}
    </Wrapper>
  );
}
