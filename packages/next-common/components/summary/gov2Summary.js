// bulk copied from `next-common/components/summary/democracySummary`

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { currentNodeSelector } from "../../store/reducers/nodeSlice";
import useApi from "../../utils/hooks/useApi";
import { SecondaryCard } from "../styled/containers/secondaryCard";
import Content from "./cardContent";
import nextApi from "../../services/nextApi";
import { gov2ReferendumsSummaryApi } from "../../services/url";

const Wrapper = styled.div`
  display: flex;

  > :not(:first-child) {
    margin-left: 16px;
  }

  @media screen and (max-width: 768px) {
    flex-direction: column;
    > :not(:first-child) {
      margin-left: 0;
      margin-top: 16px;
    }
  }
`;

const Card = styled(SecondaryCard)`
  position: relative;
  color: ${(props) => props.theme.textPrimary};
  flex: 0 1 33.33%;
  height: 88px;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 12px;
  line-height: 100%;
  letter-spacing: 0.16em;
  color: ${(props) => props.theme.textTertiary};
  margin-bottom: 8px;
  text-transform: uppercase;
`;

const GreyText = styled.span`
  color: ${(props) => props.theme.textTertiary}; !important;
`;

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
    <Wrapper>
      <Card>
        <Title>Confirming</Title>
        <Content>
          <span>{summary.confirmingCount || 0}</span>
        </Content>
      </Card>
      <Card>
        <Title>Deciding</Title>
        <Content>
          <span>{summary.decidingCount || 0}</span>
        </Content>
      </Card>
      <Card>
        <Title>Active</Title>
        <Content>
          <span>
            {summary.activeCount || 0}
            <GreyText> / {summary.total || 0}</GreyText>
          </span>
        </Content>
      </Card>
    </Wrapper>
  );
}
