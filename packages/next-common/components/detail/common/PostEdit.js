import React from "react";
import styled from "styled-components";
import EditIcon from "../../../assets/imgs/icons/edit.svg";
import { emptyFunction } from "../../../utils";

const Edit = styled.div`
  cursor: pointer;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 140%;
  text-align: center;
  color: ${ (props) => props.theme.textSecondary };
  display: flex;
  align-items: center;

  svg {
    margin-left: 8px;
    margin-right: 4px;
  }
`;

export default function PostEdit({ setIsEdit = emptyFunction }) {
  return (
    <Edit
      onClick={ () => {
        setIsEdit(true);
      } }
    >
      <EditIcon />
      Edit
    </Edit>
  )
}
