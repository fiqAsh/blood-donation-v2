// import { useState } from "react";
// import { useBankStore } from "../stores/useBankStore";

// const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// const BankFilter = () => {
//   const [selectedGroup, setSelectedGroup] = useState("");
//   const { filterBanks, bankData } = useBankStore();

//   const handleSearch = async () => {
//     if (!selectedGroup) return;
//     await filterBanks(selectedGroup);
//   };

//   return (
//     <div className="p-4 bg-base-200 rounded-lg shadow mb-8">
//       <h2 className="text-xl font-bold mb-4">Filter Blood Banks by Group</h2>

//       <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
//         <select
//           className="select select-bordered w-full md:w-60"
//           value={selectedGroup}
//           onChange={(e) => setSelectedGroup(e.target.value)}
//         >
//           <option value="" disabled>
//             Select Blood Group
//           </option>
//           {bloodGroups.map((group) => (
//             <option key={group} value={group}>
//               {group}
//             </option>
//           ))}
//         </select>

//         <button className="btn btn-primary" onClick={handleSearch}>
//           Search
//         </button>
//       </div>

//       {/* Results */}
//       {bankData.length > 0 ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {bankData.map((bank, index) => (
//             <div key={index} className="bg-white p-4 rounded shadow border">
//               <h3 className="text-lg font-semibold mb-1">{bank.name}</h3>
//               <p>
//                 <span className="font-medium">Available:</span> {bank.quantity}{" "}
//                 units
//               </p>
//               <p className="text-sm text-gray-500">
//                 Location: Lat {bank.location.latitude}, Lng{" "}
//                 {bank.location.longitude}
//               </p>
//             </div>
//           ))}
//         </div>
//       ) : (
//         selectedGroup && (
//           <p className="text-center text-red-500 mt-4">No banks found.</p>
//         )
//       )}
//     </div>
//   );
// };

// export default BankFilter;
import { useState } from "react";
import { useBankStore } from "../stores/useBankStore";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const BankFilter = () => {
  const [selectedGroup, setSelectedGroup] = useState("");
  const [hasSearched, setHasSearched] = useState(false); // 👈 New state
  const { filterBanks, bankData } = useBankStore();

  const handleSearch = async () => {
    if (!selectedGroup) return;
    await filterBanks(selectedGroup);
    setHasSearched(true); // 👈 Set to true after search
  };

  return (
    <div className="p-4 bg-base-200 rounded-lg shadow mb-8">
      <h2 className="text-xl font-bold mb-4">Filter Blood Banks by Group</h2>

      <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
        <select
          className="select select-bordered w-full md:w-60"
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
        >
          <option value="" disabled>
            Select Blood Group
          </option>
          {bloodGroups.map((group) => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </select>

        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* Only show results after search */}
      {hasSearched && (
        <>
          {bankData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bankData.map((bank, index) => (
                <div key={index} className="bg-white p-4 rounded shadow border">
                  <h3 className="text-lg font-semibold mb-1">{bank.name}</h3>
                  <p>
                    <span className="font-medium">Available:</span>{" "}
                    {bank.quantity} units
                  </p>
                  <p className="text-sm text-gray-500">
                    Location: Lat {bank.location.latitude}, Lng{" "}
                    {bank.location.longitude}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-red-500 mt-4">
              No banks found for selected group.
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default BankFilter;
