import React from "react";
import styled from "styled-components";
import Link from "next/link";
import ErrorText from "next-common/components/ErrorText";

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

const CheckBox = styled.img`
  margin-top: 3px;
  margin-right: 8px;
  cursor: pointer;
`;

const Text = styled.div`
  font-size: 14px;
  line-height: 140%;
  color: #506176;
  a {
    font-weight: bold;
    color: #6848ff;
  }
`;

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
          src={
            checked
              ? "/imgs/icons/check-box-on.svg"
              : "/imgs/icons/check-box-off.svg"
          }
          onClick={() => {
            setChecked(!checked);
            setAgreeError(null);
          }}
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
