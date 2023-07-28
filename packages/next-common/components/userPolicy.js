import React, { useState } from "react";
import styled from "styled-components";
import ErrorText from "next-common/components/ErrorText";
import { SystemCheckboxOff, SystemCheckboxOn } from "@osn/icons/subsquare";
import Popup from "./popup/wrapper/Popup";
import termsMd from "./pages/terms/terms-of-service.md";
import policyMd from "./pages/privacy/privacy-policy.md";
import { MarkdownPreviewer } from "@osn/previewer";
import clsx from "clsx";

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
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [md, setMd] = useState("");

  const valueMap = {
    terms: {
      title: "Terms of Service",
      md: termsMd,
    },
    policy: {
      title: "Privacy Policy",
      md: policyMd,
    },
  };

  return (
    <>
      <Wrapper>
        <ClickWrapper>
          <CheckBox
            checked={checked}
            setChecked={setChecked}
            setAgreeError={setAgreeError}
          />
          <Text>
            I have read and agree to the{" "}
            <span
              role="button"
              className="text-theme500"
              onClick={() => {
                setOpen(true);
                setTitle(valueMap.terms.title);
                setMd(valueMap.terms.md);
              }}
            >
              Terms of Service
            </span>{" "}
            and{" "}
            <span
              role="button"
              className="text-theme500"
              onClick={() => {
                setOpen(true);
                setTitle(valueMap.policy.title);
                setMd(valueMap.policy.md);
              }}
            >
              Privacy Policy
            </span>
            .
          </Text>
        </ClickWrapper>
        {agreeError && <ErrorText>{agreeError}</ErrorText>}
      </Wrapper>

      {open && (
        <Popup
          title={<h3 className="text16Bold">{title}</h3>}
          className="w-[960px]"
          onClose={() => {
            setOpen(false);
          }}
        >
          <div className={clsx("[&_h2]:text14Bold [&_h2]:my-4", "[&_p]:my-4")}>
            <MarkdownPreviewer content={md} />
          </div>
        </Popup>
      )}
    </>
  );
}
