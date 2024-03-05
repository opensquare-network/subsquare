import React from "react";
import privacyMd from "./privacy-policy.md";
import { MarkdownPreviewer } from "@osn/previewer";
import {
  ProjectIconSubsquareDark,
  ProjectIconSubsquareLight,
} from "@osn/icons/subsquare";
import { StatementContent, LegalBreadcrumb, StatementTitle } from "../common";

const PrivacyContent = () => {
  return (
    <div className="mx-auto max-w-[856px] pb-6">
      <LegalBreadcrumb title="Privacy Policy" />
      <StatementContent>
        <div className="mb-6">
          <ProjectIconSubsquareLight className="w-10 h-10 dark:hidden" />
          <ProjectIconSubsquareDark className="w-10 h-10 hidden dark:block" />
        </div>
        <StatementTitle>Privacy Policy</StatementTitle>
        <MarkdownPreviewer content={privacyMd} />
      </StatementContent>
    </div>
  );
};

export default PrivacyContent;
