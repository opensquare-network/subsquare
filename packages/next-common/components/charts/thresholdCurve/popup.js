import styled, { useTheme } from "styled-components";
import ThresholdCurvesChart from ".";
import { emptyFunction } from "../../../utils";
import PopupOrigin from "../../popup/wrapper/Popup";
import Flex from "../../styled/flex";
import ThresholdCurvesLegend from "./legend";
import {
  EmptyTd,
  RowSpliter,
  StyledTable,
  StyledTd,
  StyledTh,
  StyledTr,
} from "../../styled/table";
import { pretty_scroll_bar } from "../../../styles/componentCss";
import Loading from "../../loading";
import { range } from "../../../utils/array";

const Center = styled(Flex)`
  justify-content: center;
`;

const Popup = styled(PopupOrigin)`
  width: 480px;
`;

const Table = styled(StyledTable)`
  border: none;
  padding: 0;
  tbody {
    display: block;
    max-height: 200px;
    overflow-y: auto;
    overflow-x: hidden;

    ${pretty_scroll_bar};
  }
  thead,
  tbody tr {
    display: table;
    width: 100%;
    table-layout: fixed;
  }
  box-shadow: none;
`;

export default function ThresholdCurvesPopup({
  setShow = emptyFunction,
  loading = true,
  labels = [],
  supportData = [],
  approvalData = [],
}) {
  const theme = useTheme();

  const list = range(labels.length + 1).map((n) => {
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
      title="Thoreshold Curves"
      onClose={() => {
        setShow(false);
      }}
    >
      <ThresholdCurvesChart
        height={144}
        labels={labels}
        supportData={supportData}
        approvalData={approvalData}
      />

      <Center>
        <ThresholdCurvesLegend />
      </Center>

      <Table>
        <thead>
          <StyledTr>
            <StyledTh style={{ textAlign: "left" }}>TIME (HS)</StyledTh>
            <StyledTh style={{ textAlign: "right" }}>SUPPORT</StyledTh>
            <StyledTh style={{ textAlign: "right" }}>APPROVAL</StyledTh>
          </StyledTr>
          <RowSpliter
            backgroundColor={
              theme.isDark ? theme.grey200Border : theme.grey100Bg
            }
            padding={"16px 0 4px 0"}
          />
        </thead>
        <tbody>
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
    </Popup>
  );
}
