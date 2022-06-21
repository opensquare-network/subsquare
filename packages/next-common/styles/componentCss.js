import { css } from "styled-components";

export const shadow_100 = css`
  box-shadow: 0 6px 7px rgba(30, 33, 52, 0.02),
    0 1.34018px 1.56354px rgba(30, 33, 52, 0.0119221),
    0 0.399006px 0.465507px rgba(30, 33, 52, 0.00807786);
`;

export const shadow_200 = css`
  box-shadow: 0 6px 22px rgba(30, 33, 52, 0.11),
    0 1.34018px 4.91399px rgba(30, 33, 52, 0.0655718),
    0 0.399006px 1.46302px rgba(30, 33, 52, 0.0444282);
`;

export const shadow_200_right = css`
  box-shadow: 6px 0 22px rgba(30, 33, 52, 0.11),
    1.34px 0 4.91399px rgba(30, 33, 52, 0.0655718),
    0.4px 0 1.46302px rgba(30, 33, 52, 0.0444282);
`;

export const p_14_medium = css`
  font-family: Inter, sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 100%;
`;

export const p_14_normal = css`
  font-family: Inter, sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 19.6px;
`;

export const p_12_medium = css`
  font-family: Inter, sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 12px;
`;

export const p_12_normal = css`
  font-family: Inter, sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16.8px;
`;

export const text_primary = css`
  color: #1e2134;
`;

export const text_accessory = css`
  color: #9da9bb;
`;

export const text_secondary = css`
  color: #506176;
`;

export const no_scroll_bar = css`
  -ms-overflow-style: none;
  scrollbar-width: none;

  ::-webkit-scrollbar {
    display: none;
  }
`;

export const p_14_normal = css`
  font-family: Inter, sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 140%;
`;

export const font_family_inter = css`
  font-family: Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
    Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
`;
