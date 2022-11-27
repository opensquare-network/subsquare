import styled, { useTheme } from "styled-components";
import Progress from "next-common/components/progress";
import useSupportThreshold from "../threshold/useSupportThreshold";
import { useTally } from "next-common/context/post/gov2/referendum";
import { useEffect, useMemo, useState } from "react";
import ThresholdComponent from "../../../../referenda/threshold";
import Percentage from "./percentage";

const Wrapper = styled.div`
  margin-top: 21px;
  padding: 0 0 8px;

  font-size: 12px;
  line-height: 16px;

  position: relative;

  ul,
  li {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  ul {
    margin-top: 12px;
    display: flex;
    justify-content: space-between;

    font-weight: 500;
    color: ${(props) => props.theme.textPrimary};
    li {
      width: 33.3%;
      &:last-child {
        text-align: right;
      }
      &:nth-child(2) {
        text-align: center;
      }
    }
  }

  p {
    margin: 0;
    text-align: center;
    color: ${(props) => props.theme.textSecondary};
    font-weight: 500;
  }
`;

const Mark = styled(ThresholdComponent)`
  margin-top: 8px;
`;

export default function SupportBar({ issuance }) {
  const supportThreshold = useSupportThreshold();
  // threshold in perbill
  const [threshold, setThreshold] = useState(0);
  // progress max value in perbill
  const [progressMax, setProgressMax] = useState(0);
  const { grey100Bg } = useTheme();

  useEffect(() => {
    if (supportThreshold) {
      setThreshold(supportThreshold * Math.pow(10, 9));
    }
  }, [supportThreshold]);

  useEffect(() => {
    setProgressMax((threshold / 4) * 5);
  }, [threshold]);

  const tally = useTally();
  const support = tally?.support;

  const barPercentage = useMemo(() => {
    if (!issuance || !progressMax) {
      return 0;
    }

    const supportPercentage = (support / issuance) * Math.pow(10, 9);

    return (supportPercentage / progressMax) * 100;
  }, [issuance, support, progressMax]);

  return (
    <Wrapper>
      <Progress percentage={barPercentage} bg={grey100Bg} />
      <Mark threshold="80%" />
      <ul>
        <li>0.0%</li>
        <li>
          <Percentage perbill={threshold} />
        </li>
        <li>
          <Percentage perbill={progressMax} />
        </li>
      </ul>
      <p>Threshold</p>
    </Wrapper>
  );
}
