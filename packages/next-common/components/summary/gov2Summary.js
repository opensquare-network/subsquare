// bulk copied from `next-common/components/summary/democracySummary`

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { currentNodeSelector } from "../../store/reducers/nodeSlice";
import useApi from "../../utils/hooks/useApi";
import Content from "./cardContent";
import nextApi from "../../services/nextApi";
import { gov2ReferendumsSummaryApi } from "../../services/url";
import {
  SummaryCard,
  SummaryGreyText,
  SummaryTitle,
  SummaryWrapper,
} from "./styled";

export default function Gov2Summary({ chain }) {
  const [summary, setSummary] = useState({});
  const endpoint = useSelector(currentNodeSelector);
  const api = useApi(chain, endpoint);

  useEffect(() => {
    if (!api) {
      return;
    }

    nextApi.fetch(gov2ReferendumsSummaryApi).then(({ result }) => {
      setSummary(result);
    });
  }, [chain, api]);

  return (
    <SummaryWrapper>
      <SummaryCard>
        <SummaryTitle>Confirming</SummaryTitle>
        <Content>
          <span>{summary.confirmingCount || 0}</span>
        </Content>
      </SummaryCard>
      <SummaryCard>
        <SummaryTitle>Deciding</SummaryTitle>
        <Content>
          <span>{summary.decidingCount || 0}</span>
        </Content>
      </SummaryCard>
      <SummaryCard>
        <SummaryTitle>Active</SummaryTitle>
        <Content>
          <span>
            {summary.activeCount || 0}
            <SummaryGreyText> / {summary.total || 0}</SummaryGreyText>
          </span>
        </Content>
      </SummaryCard>
    </SummaryWrapper>
  );
}
