import AddressUser from "next-common/components/user/addressUser";
function PartnerList({ addresses }) {
  if (!addresses || addresses.length <= 0) {
    return null;
  }

  return (
    <div className="w-[164px] bg-tooltipBg rounded-[4px] py-[6px] px-3">
      <ul className="flex flex-col items-start justify-center">
        {(addresses || []).map((address, index) => (
          <li key={index} className="leading-5 mt-1">
            <AddressUser
              add={address}
              className="text12Medium text-textPrimaryContrast"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PartnerList;
