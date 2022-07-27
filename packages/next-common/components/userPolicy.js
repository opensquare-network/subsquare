import React from "react";
import styled from "styled-components";
import Link from "next/link";
import ErrorText from "next-common/components/ErrorText";
import CheckBoxOn from "../assets/imgs/icons/check-box-on.svg";
import CheckBoxOff from "../assets/imgs/icons/check-box-off.svg";

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

const CheckBoxWrapper = styled.span`
  margin-top: 3px;
  margin-right: 8px;
  cursor: pointer;
`;

const Text = styled.div`
  font-size: 14px;
  line-height: 140%;
  color: ${(props) => props.theme.textTertiary};
  a {
    font-weight: bold;
    color: ${(props) => props.theme.primaryPurple500};
  }
`;

function CheckBox({ checked, setChecked, setAgreeError }) {
  return (
    <CheckBoxWrapper
      onClick={() => {
        setChecked(!checked);
        setAgreeError(null);
      }}
    >
      {checked ? <CheckBoxOn /> : <CheckBoxOff />}
    </CheckBoxWrapper>
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
