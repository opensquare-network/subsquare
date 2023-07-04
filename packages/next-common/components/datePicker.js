import styled, { css } from "styled-components";
import ReactDatePicker from "react-datepicker";
import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import useOnClickOutside from "../utils/hooks/useOnClickOutside";
import ArrowLeft from "../assets/imgs/icons/caret-left-16.svg";
import ArrowRight from "../assets/imgs/icons/caret-right-16.svg";
import Close from "../assets/imgs/icons/close-16.svg";
import { font_family, p_14_medium, p_14_normal } from "../styles/componentCss";
import Flex from "./styled/flex";
import FlexBetween from "./styled/flexBetween";
import Input from "./input";
import Background from "./styled/backgroundShade";
import SecondaryButton from "./buttons/secondaryButton";

const CaretWrapper = styled.div`
  cursor: pointer;
  padding: 6px 7px 5px 7px;
  border: 1px solid var(--neutral400);
  border-radius: 4px;

  :hover {
    border-color: var(--neutral500);
  }
  * {
    stroke: var(--textPrimary);
  }

  ${(p) =>
    p.disabled &&
    css`
      cursor: not-allowed;
      pointer-events: none;
      * {
        stroke: var(--textDisabled);
      }
      :hover {
        border-color: var(--neutral400);
      }
    `}
  * {
    stroke: var(--textPrimary);
  }
`;

const CaretLeft = ({ onClick, disabled }) => {
  return (
    <CaretWrapper className="caret" disabled={disabled} onClick={onClick}>
      <ArrowLeft />
    </CaretWrapper>
  );
};

const CaretRight = ({ onClick }) => {
  return (
    <CaretWrapper className="caret" onClick={onClick}>
      <ArrowRight />
    </CaretWrapper>
  );
};

const Wrapper = styled.div`
  margin-top: 8px;
  position: relative;
`;

const DateTimeWrapper = styled.div``;

const Label = styled.span`
  width: 91px;
  line-height: 36px;
  background: var(--neutral200);
  border-right: 1px solid var(--neutral400);
  text-align: center;
  color: var(--textPrimary);
`;

const DateTime = styled.span`
  padding-left: 16px;
  flex-grow: 1;
  text-align: left;
  color: var(--textPrimary);
`;

const PlaceHolder = styled.span`
  padding-left: 16px;
  flex-grow: 1;
  text-align: left;
  color: var(--textDisabled);
`;

const DateButton = styled.div`
  overflow: hidden;
  padding-right: 12px;
  border: 1px solid var(--neutral400);
  border-radius: 4px;
  background: var(--neutral100);

  :hover {
    border-color: var(--neutral300);
  }

  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;

  .placeholder {
    color: var(--textTertiary);
  }

  > div {
    flex-grow: 1;
  }

  ${(p) =>
    p.active &&
    css`
      border-color: var(--neutral400);
    `}
`;

const DateWrapper = styled.div`
  position: absolute;
  z-index: 1;
  right: 50%;
  margin-right: -200px;
  top: 50%;
  margin-top: -280px;
  padding: 24px;
  background: var(--neutral100);
  border: 1px solid var(--neutral300)
  box-shadow: 0px 6px 22px rgba(30, 33, 52, 0.11),
    0px 1.34018px 4.91399px rgba(30, 33, 52, 0.0655718),
    0px 0.399006px 1.46302px rgba(30, 33, 52, 0.0444282);
  border-radius: 8px;

  h2 {
    margin: 0;
    font-size: 14px;
    line-height: 20px;
  }

  h6 {
    margin-top: 16px;
    margin-bottom: 8px;
  }

  h2 + button {
    all: unset;
    cursor: pointer;
  }

  h6 + span {
    font-size: 12px;
    font-weight: 500;
    color: var(--textTertiary);
  }

  .react-datepicker {
    padding: 20px 12px;
    border: 1px solid var(--neutral400);
    border-radius: 4px;
  }

  .react-datepicker__header {
    background: transparent;
    border: none;
    padding: 0;
  }

  .react-datepicker__day-name {
    width: 46.86px;
    ${font_family};
    ${p_14_medium};
    line-height: 32px;
    text-align: center;
    color: var(--textSecondary);
    margin: 0 !important;
  }

  .react-datepicker__day-names {
    line-height: 32px;
  }

  .react-datepicker__month {
    margin: 0;
    padding-top: 8px;
  }

  .react-datepicker__day {
    width: 46.86px;
    ${font_family};
    ${p_14_normal};
    line-height: 32px;
    color: var(--textPrimary);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin: 0 !important;
    border-radius: 4px;

    :hover {
      background: var(--neutral200);
    }
  }

  .react-datepicker__day--today {
    font-weight: 600;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
  }

  .react-datepicker__day--selected {
    background: var(--neutral300);
    &:hover {
      background: var(--neutral300);
    }
  }

  .react-datepicker__day--outside-month {
    color: var(--textTertiary);
  }

  .react-datepicker__day--keyboard-selected {
    background-color: transparent;
  }

  .react-datepicker__day--disabled {
    color: var(--textTertiary);
    cursor: not-allowed;

    &:hover {
      background: none;
    }
  }
  ${(props) =>
    props?.theme.isDark &&
    css`
      .react-datepicker {
        border-color: #363a4d !important;
        user-select: none;
      }
      background: #212433;

      color: white;
      b {
        color: white !important;
      }
      .react-datepicker {
        background-color: #212433;
      }
      .react-datepicker__day--today {
        color: white;
        border-color: #575c72;
      }
      .react-datepicker__day,
      .react-datepicker__day--selected {
        color: white;
        &:hover {
          background-color: #272a3a;
        }
      }
      .react-datepicker__day--outside-month {
        color: rgba(255, 255, 255, 0.2);
      }
      .react-datepicker__day--disabled {
        color: rgba(255, 255, 255, 0.15);
      }
      .react-datepicker__day--selected {
        background-color: #272a3a;
        color: white;
      }
      input,
      .input,
      .caret {
        color: white;
        border-color: #363a4d !important;
      }
      .caret {
      }
    `};
`;

const DateHeader = styled(Flex)`
  margin-bottom: 8px;

  > b {
    ${font_family};
    text-align: center;
    color: var(--textPrimary);
    flex: 1 1 auto;
  }

  > svg {
    cursor: pointer;

    path {
      fill: var(--textSecondary);
    }
  }
`;

const ButtonWrapper = styled(Flex)`
  margin-top: 16px;
  justify-content: flex-end;

  > :not(:first-child) {
    margin-left: 16px;
  }
`;

const TimeWrapper = styled(FlexBetween)`
  gap: 8px;
  align-items: center;

  input {
    width: 132px;
    line-height: 20px;
    text-align: center;
  }

  span {
    line-height: 40px;
  }
`;

export default function DatePicker({
  placeholder,
  maxDate,
  button,
  onSelectDatetime = () => {},
}) {
  const now = new Date();
  const [date, setDate] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [show, setShow] = useState("date");
  const [hour, setHour] = useState(now.getHours());
  const [minute, setMinute] = useState(now.getMinutes());
  const ref = useRef();
  useOnClickOutside(ref, () => setIsOpen(false));
  const handleChange = (e) => {
    setDate(e);
  };
  const handleClick = (e) => {
    e.preventDefault();
    setShow("date");
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isOpen && date === null) {
      setDate(new Date(now.setDate(now.getDate() + 7)));
    }
  }, [isOpen]);

  const getFormattedTime = () => {
    if (!date || !hour || !minute) return "";
    const datetime = new Date(
      Date.parse(
        `${moment(date ?? new Date()).format("YYYY-MM-DD")} ${hour}:${minute}`,
      ),
    );
    return moment(datetime).format("YYYY-MM-DD, HH:mm");
  };

  return (
    <Wrapper>
      <DateTimeWrapper>
        {button ? (
          <div onClick={handleClick}>{button}</div>
        ) : (
          <DateButton onClick={handleClick} active={isOpen}>
            <Label>End time</Label>
            {date ? (
              <DateTime>{getFormattedTime()}</DateTime>
            ) : (
              <PlaceHolder>{placeholder}</PlaceHolder>
            )}
            <ArrowRight />
          </DateButton>
        )}
        {isOpen && (
          <>
            {show === "date" && (
              <Background>
                <DateWrapper ref={ref}>
                  <FlexBetween>
                    <h2>Select End Time</h2>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                      }}
                    >
                      <Close />
                    </button>
                  </FlexBetween>
                  <h6>Date</h6>
                  <ReactDatePicker
                    selected={date}
                    minDate={new Date()}
                    maxDate={maxDate}
                    onChange={handleChange}
                    inline
                    renderCustomHeader={({
                      date,
                      decreaseMonth,
                      increaseMonth,
                    }) => (
                      <div>
                        <DateHeader>
                          <CaretLeft
                            disabled={
                              moment(date).format("YYYY-MM") ===
                              moment(new Date()).format("YYYY-MM")
                            }
                            onClick={decreaseMonth}
                          />
                          <b>{moment(date).format("YYYY-MM")}</b>
                          <CaretRight onClick={increaseMonth} />
                        </DateHeader>
                      </div>
                    )}
                    formatWeekDay={(nameOfDay) => nameOfDay.substr(0, 1)}
                  />
                  <FlexBetween style={{ marginTop: 14, marginBottom: 8 }}>
                    <h6 style={{ margin: 0 }}>Time</h6>
                    <span>24-hour clock</span>
                  </FlexBetween>

                  <TimeWrapper>
                    <Input
                      className="input"
                      type="number"
                      value={hour}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (0 <= value && value < 24) {
                          setHour(value.toString());
                        }
                        if (e.target.value === "") {
                          setHour("");
                        }
                      }}
                      placeholder="00"
                    />
                    <span>:</span>
                    <Input
                      className="input"
                      type="number"
                      value={minute}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (0 <= value && value < 60) {
                          setMinute(value.toString());
                        }
                        if (e.target.value === "") {
                          setMinute("");
                        }
                      }}
                      placeholder="00"
                    />
                  </TimeWrapper>
                  <ButtonWrapper>
                    <SecondaryButton
                      disabled={hour === "" || minute === ""}
                      onClick={() => {
                        if (!date) {
                          setDate(new Date());
                        }
                        onSelectDatetime(
                          Date.parse(
                            `${moment(date ?? new Date()).format(
                              "YYYY-MM-DD",
                            )} ${hour}:${minute}`,
                          ),
                        );
                        setIsOpen(false);
                      }}
                    >
                      Confirm
                    </SecondaryButton>
                  </ButtonWrapper>
                </DateWrapper>
              </Background>
            )}
          </>
        )}
      </DateTimeWrapper>
    </Wrapper>
  );
}
