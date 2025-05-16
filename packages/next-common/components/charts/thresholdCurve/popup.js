import React from "react";
import styled, { useTheme } from "styled-components";
import ThresholdCurvesChart from ".";
import Popup from "../../popup/wrapper/Popup";
import Flex from "../../styled/flex";
import ThresholdCurvesGov2TrackSummaryLegend from "./legend/gov2TrackSummaryLegend";
import {
  EmptyTd,
  RowSplitter,
  StyledTable,
  StyledTd,
  StyledTh,
  StyledTr,
} from "../../styled/table";
import Loading from "../../loading";
import { noop, range } from "lodash-es";
import HowOpenGovWorks from "next-common/components/howOpenGovWorks";
import useWindowSize from "next-common/utils/hooks/useWindowSize";

const Center = styled(Flex)`
  justify-content: center;
`;

const Table = styled(StyledTable)`
  border: none;
  padding: 0;
  tbody {
    display: block;
    max-height: 180px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  thead,
  tbody tr {
    display: table;
    width: 100%;
    table-layout: fixed;
  }

  tbody {
    ${StyledTr} {
      height: 44px;
      &:not(:last-child) {
        border-bottom: 1px solid var(--neutral200);
      }
    }
  }

  box-shadow: none;
`;

export default function ThresholdCurvesPopup({
  setShow = noop,
  loading = false,
  labels = [],
  supportData = [],
  approvalData = [],
}) {
  const { width } = useWindowSize();
  const theme = useTheme();

  const list = range(labels.length).map((n) => {
    const support = Number(supportData[n]).toFixed(2);
    const approval = Number(approvalData[n]).toFixed(2);

    return {
      hs: n,
      support,
      approval,
    };
  });

  return (
    <Popup
      title="Threshold Curves"
      className="w-[960px]"
      onClose={() => {
        setShow(false);
      }}
    >
      <ThresholdCurvesChart
        height={width > 768 ? 320 : 144}
        labels={labels}
        supportData={supportData}
        approvalData={approvalData}
      />

      <Center>
        <ThresholdCurvesGov2TrackSummaryLegend />
      </Center>

      <Table>
        <thead>
          <StyledTr>
            <StyledTh style={{ textAlign: "left" }}>TIME (HS)</StyledTh>
            <StyledTh style={{ textAlign: "right" }}>SUPPORT</StyledTh>
            <StyledTh style={{ textAlign: "right" }}>APPROVAL</StyledTh>
          </StyledTr>
          <RowSplitter
            backgroundColor={
              theme.isDark ? "var(--neutral300)" : "var(--neutral200)"
            }
            padding={"16px 0 0 0"}
          />
        </thead>
        <tbody className="scrollbar-pretty">
          {list.length ? (
            list.map((item, idx) => (
              <StyledTr key={idx}>
                <StyledTd style={{ textAlign: "left" }}>{item.hs}</StyledTd>
                <StyledTd style={{ textAlign: "right" }}>
                  {item.support}%
                </StyledTd>
                <StyledTd style={{ textAlign: "right" }}>
                  {item.approval}%
                </StyledTd>
              </StyledTr>
            ))
          ) : (
            <StyledTr>
              <EmptyTd colSpan="3">
                {loading ? <Loading size={16} /> : "No threshold curves"}
              </EmptyTd>
            </StyledTr>
          )}
        </tbody>
      </Table>

      <div className="mt-[16px]">
        <HowOpenGovWorks anchor="referenda" />
      </div>
    </Popup>
  );
}
