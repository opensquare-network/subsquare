import {
  addRouterQuery,
  getRouterQuery,
  removeRouterQuery,
} from "next-common/utils/router";
import { useRouter } from "next/router";
import { SystemSearch } from "@osn/icons/subsquare";
import styled from "styled-components";

const Wrapper = styled.div`
  margin: 24px 0 !important;
  display: flex;
  border-radius: 8px;
  border: 1px solid var(--neutral400);
  background: var(--neutral100);
`;

const Input = styled.input`
  flex-grow: 1;
  border: none;
  outline: none;
  background: transparent;

  color: var(--textPrimary);
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
`;

export default function useAllProxiesSearch() {
  const router = useRouter();

  const querySearch = getRouterQuery(router, "search");

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value) {
      addRouterQuery(router, "search", value);
    } else {
      removeRouterQuery(router, "search");
    }
  };

  return {
    search: querySearch,
    component: (
      <Wrapper>
        <div className="flex p-[8px] [&_path]:fill-textTertiary">
          <SystemSearch width={24} height={24} />
        </div>
        <Input
          placeholder="Search by identity name or address"
          defaultValue={querySearch || ""}
          onChange={handleInputChange}
        />
      </Wrapper>
    ),
  };
}
