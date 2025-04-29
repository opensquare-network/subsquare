import { LinkIpfs } from "@osn/icons/subsquare";
import Tooltip from "next-common/components/tooltip";
import { cn } from "next-common/utils";
import ExternalLink from "next-common/components/externalLink";
import getIpfsLink from "next-common/utils/env/ipfsEndpoint";
import React from "react";

function EvidenceExternalLinkWithWish({ className = "", wish = "", cid = "" }) {
  return (
    <div className={cn(className)}>
      {wish && (
        <p className="flex items-center flex-grow-0 pr-4  text14Bold">
          <span>{`Evidence for ${wish}`}</span>
          <span className="border-r-[1px] border-neutral400 h-[12px] w-4"></span>
          <span className="p-0 pl-4 h-full flex items-center">
            <Tooltip content="IPFS Link" className="w-4 h-4">
              <ExternalLink
                href={getIpfsLink(cid)}
                externalIcon={false}
                className="text-textTertiary hover:text-textSecondary"
              >
                <LinkIpfs className="w-4 h-4" />
              </ExternalLink>
            </Tooltip>
          </span>
        </p>
      )}
    </div>
  );
}

export default React.memo(EvidenceExternalLinkWithWish);
