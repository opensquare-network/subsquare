import React from "react";
import styled from "styled-components";
import NextHead from "next-common/components/nextHead";
import privacyMd from "./privacy-policy.md";
import { MarkdownPreviewer } from "@osn/previewer";
import {
  ProjectIconSubsquareDark,
  ProjectIconSubsquareLight,
} from "@osn/icons/subsquare";

const Content = styled.div`
  margin-top: 16px;
  background: var(--neutral100);
  border: 1px solid var(--neutral300);
  color: var(--textPrimary);
  box-shadow: var(--shadow100);
  border-radius: 6px;
  padding: 48px;
  p,
  h2,
  h3,
  li {
    color: var(--textPrimary) !important;
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  line-height: 100%;
  font-weight: bold;
  margin-bottom: 1.5rem;
  margin-top: 0;
`;

const Privacy = () => {
  return (
    <>
      <NextHead title="Privacy Policy" desc="Privacy Policy" />
      <div className="mt-[12vh] mx-auto max-w-[856px] pb-6">
        <Content>
          <div className="mb-6">
            <ProjectIconSubsquareLight className="w-10 h-10 dark:hidden" />
            <ProjectIconSubsquareDark className="w-10 h-10 hidden dark:block" />
          </div>
          <Title>Privacy Policy</Title>
          <MarkdownPreviewer content={privacyMd} />
        </Content>
      </div>
    </>
  );
};

export default Privacy;
