import { BorderedRow, Header } from "../referenda/tally/styled";
import SymbolValue from "@subsquare/next/components/gov2/sidebar/tally/values/symbolValue";
import {
  InfoAsset,
  InfoDocs,
  InfoUser,
  InfoUserVote,
} from "@osn/icons/subsquare";
import JudgementsTable from "./table";
export default function RequestJudgementPopupContent() {
  return (
    <div className="flex flex-col gap-y-4">
      <div>
        <BorderedRow>
          <Header>
            <InfoUser className="w-5 h-5 text-textTertiary" />
            Registrar
          </Header>
          <SymbolValue value={1} />
        </BorderedRow>

        <BorderedRow>
          <Header className="w-auto">
            <InfoDocs className="w-5 h-5 text-textTertiary" />
            Received Request
          </Header>
          <SymbolValue value={1} />
        </BorderedRow>

        <BorderedRow>
          <Header>
            <InfoUserVote className="w-5 h-5 text-textTertiary" />
            Total Given
          </Header>
          <SymbolValue value={1} />
        </BorderedRow>

        <BorderedRow>
          <Header>
            <InfoAsset className="w-5 h-5 text-textTertiary" />
            Fee
          </Header>
          <SymbolValue value={1} />
        </BorderedRow>
      </div>

      <h4 className="text14Bold text-textPrimary">Judgements</h4>

      <JudgementsTable />
    </div>
  );
}
