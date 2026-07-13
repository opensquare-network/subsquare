import PopupLabel from "next-common/components/popup/label";
import Select from "next-common/components/select";
import NumberInput from "next-common/lib/input/number";
import AddressCombo from "next-common/components/addressCombo";
import { SystemClose } from "@osn/icons/subsquare";

const PRIORITY_OPTIONS = Array.from({ length: 10 }, (_, i) => ({
  label: String(i),
  value: String(i),
}));

export function PriorityField({ value, onChange }) {
  return (
    <div>
      <PopupLabel
        text="Priority"
        tooltip="Priority level for this recovery group, lower number means higher priority"
      />
      <Select
        options={PRIORITY_OPTIONS}
        value={value}
        onChange={({ value }) => onChange(value)}
        small
      />
    </div>
  );
}

export function FriendsField({ friends, accounts, onAdd, onRemove, onUpdate }) {
  return (
    <div>
      <div className="flex justify-between items-center">
        <PopupLabel
          text="Friends"
          tooltip="Trusted accounts that can help recover this account"
        />
        <button
          type="button"
          onClick={onAdd}
          className="text14Medium text-theme500 cursor-pointer"
        >
          Add
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {friends.map((addr, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div className="flex-1">
              <AddressCombo
                accounts={accounts}
                address={addr}
                setAddress={(value) => onUpdate(idx, value || "")}
                placeholder="Enter friend address"
                size="small"
                canEdit
              />
            </div>
            {friends.length > 1 && (
              <button
                type="button"
                onClick={() => onRemove(idx)}
                className="flex items-center justify-center w-8 h-8 rounded-lg border border-neutral400 text-textTertiary hover:text-textPrimary cursor-pointer shrink-0"
              >
                <SystemClose className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ThresholdField({ value, onChange, max }) {
  const options = Array.from({ length: Math.max(1, max) }, (_, i) => ({
    label: String(i + 1),
    value: String(i + 1),
  }));

  return (
    <div>
      <PopupLabel
        text="Threshold"
        tooltip="Number of friends required to approve a recovery attempt"
      />
      <Select
        options={options}
        value={value}
        onChange={({ value }) => onChange(value)}
        small
      />
    </div>
  );
}

export function InheritorField({ accounts, value, onChange }) {
  return (
    <div>
      <PopupLabel
        text="Inheritor"
        tooltip="The account that will inherit the funds after the recovery is complete"
      />
      <AddressCombo
        accounts={accounts}
        address={value}
        setAddress={(addr) => onChange(addr || "")}
        placeholder="Enter inheritor address"
        size="small"
        canEdit
      />
    </div>
  );
}

export function DelayField({ label, tooltip, value, onChange }) {
  return (
    <div>
      <PopupLabel text={label} tooltip={tooltip} />
      <NumberInput
        value={value}
        placeholder="Enter block number"
        symbol="Blocks"
        onValueChange={onChange}
        controls={false}
      />
    </div>
  );
}
