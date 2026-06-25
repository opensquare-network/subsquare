import { useCallback, useState } from "react";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import PopupLabel from "next-common/components/popup/label";
import Select from "next-common/components/select";
import NumberInput from "next-common/lib/input/number";
import AddressCombo from "next-common/components/addressCombo";
import {
  useExtensionAccounts,
  usePopupParams,
  useSignerAccount,
} from "next-common/components/popupWithSigner/context";
import Popup from "next-common/components/popup/wrapper/Popup";
import { SystemClose } from "@osn/icons/subsquare";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "next-common/components/estimatedGas";
import { useContextApi } from "next-common/context/api";
import { isSameAddress } from "next-common/utils";

const PRIORITY_OPTIONS = Array.from({ length: 10 }, (_, i) => ({
  label: String(i),
  value: String(i),
}));

function PriorityField({ value, onChange }) {
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

function FriendsField({ friends, accounts, onAdd, onRemove, onUpdate }) {
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

function ThresholdField({ value, onChange, max }) {
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

function DelayField({ label, tooltip, value, onChange }) {
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

function AddFriendGroupForm() {
  const { onClose } = usePopupParams();
  const extensionAccounts = useExtensionAccounts();
  const api = useContextApi();
  const signerAccount = useSignerAccount();
  const address = signerAccount?.realAddress;
  const accounts = (extensionAccounts || []).map((acc) => ({
    address: acc.address,
    name: acc.meta?.name,
    disabled: acc?.disabled ?? false,
  }));

  const [priority, setPriority] = useState("0");
  const [friends, setFriends] = useState([""]);
  const [threshold, setThreshold] = useState("1");
  const [inheritor, setInheritor] = useState("");
  const [inheritorDelay, setInheritorDelay] = useState("");
  const [cancelDelay, setCancelDelay] = useState("");

  const addFriend = () => setFriends([...friends, ""]);
  const removeFriend = (idx) => {
    if (friends.length <= 1) return;
    const next = friends.filter((_, i) => i !== idx);
    setFriends(next);
    if (parseInt(threshold) > next.length) {
      setThreshold(String(next.length));
    }
  };
  const updateFriend = (idx, addr) => {
    const next = [...friends];
    next[idx] = addr;
    setFriends(next);
  };

  const validFriendsCount = friends.filter(Boolean).length;

  const getTxFunc = useCallback(async () => {
    const validFriends = friends.filter(Boolean);
    if (validFriends.length === 0) {
      throw new Error("Please add at least one friend address");
    }

    if (validFriends.some((friend) => isSameAddress(friend, address))) {
      throw new Error("Cannot add yourself as a friend");
    }

    const thresholdNum = parseInt(threshold);
    if (!thresholdNum || thresholdNum < 1) {
      throw new Error("Please enter a valid threshold");
    }
    if (thresholdNum > validFriends.length) {
      throw new Error("Threshold cannot exceed the number of friends");
    }

    if (!inheritor) {
      throw new Error("Please enter the inheritor address");
    }

    const priorityNum = parseInt(priority);
    if (isNaN(priorityNum)) {
      throw new Error("Please select a valid priority");
    }

    const inheritorDelayNum = parseInt(inheritorDelay);
    if (!inheritorDelay || isNaN(inheritorDelayNum) || inheritorDelayNum < 0) {
      throw new Error("Please enter a valid inheritor delay");
    }

    const cancelDelayNum = parseInt(cancelDelay);
    if (!cancelDelay || isNaN(cancelDelayNum) || cancelDelayNum < 0) {
      throw new Error("Please enter a valid cancel delay");
    }

    const raw = await api.query.recovery.friendGroups(address);
    const json = raw.toJSON();
    const currentGroups = Array.isArray(json?.[0]) ? json[0] : [];

    const newGroup = {
      friends: validFriends,
      friendsNeeded: thresholdNum,
      inheritor,
      inheritancePriority: priorityNum,
      inheritanceDelay: inheritorDelayNum,
      cancelDelay: cancelDelayNum,
    };

    return api.tx.recovery.setFriendGroups([...currentGroups, newGroup]);
  }, [
    api,
    address,
    friends,
    threshold,
    priority,
    inheritor,
    inheritorDelay,
    cancelDelay,
  ]);

  return (
    <Popup title="Add Friend Group" onClose={onClose}>
      <SignerWithBalance />

      <PriorityField value={priority} onChange={setPriority} />

      <FriendsField
        friends={friends}
        accounts={accounts}
        onAdd={addFriend}
        onRemove={removeFriend}
        onUpdate={updateFriend}
      />

      <ThresholdField
        value={threshold}
        onChange={setThreshold}
        max={validFriendsCount}
      />

      <div>
        <PopupLabel
          text="Inheritor"
          tooltip="The account that will inherit the funds after the recovery is complete"
        />
        <AddressCombo
          accounts={accounts}
          address={inheritor}
          setAddress={(value) => setInheritor(value || "")}
          placeholder="Enter inheritor address"
          size="small"
          canEdit
        />
      </div>

      <DelayField
        label="Inheritor Delay (blocks)"
        tooltip="Delay in blocks before the inheritor can claim the account after a successful recovery"
        value={inheritorDelay}
        onChange={setInheritorDelay}
      />

      <DelayField
        label="Cancel Delay (blocks)"
        tooltip="Delay in blocks before a recovery attempt can be cancelled"
        value={cancelDelay}
        onChange={setCancelDelay}
      />

      <AdvanceSettings>
        <EstimatedGas getTxFunc={getTxFunc} />
      </AdvanceSettings>

      <TxSubmissionButton title="Confirm" getTxFunc={getTxFunc} />
    </Popup>
  );
}

export default function AddFriendGroupDialog({ onClose }) {
  return (
    <SignerPopupWrapper onClose={onClose}>
      <AddFriendGroupForm />
    </SignerPopupWrapper>
  );
}
