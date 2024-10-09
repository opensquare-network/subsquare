import { cohort2TrackIds, treasuryTrackIds } from "./common";

export const polkadotDvDelegates = [
  {
    address: "13EyMuuDHwtq5RD6w3psCJ9WvJFZzDDion6Fd2FVAqxz1g7K", // ChaosDao OpenGov
    slots: [
      {
        // cohort 1
        start: 19653189,
        end: 21157749,
        trackIds: treasuryTrackIds,
      },
      {
        // cohort 2
        start: 21172801,
        end: null,
        trackIds: cohort2TrackIds,
      },
    ],
  },
  {
    address: "1jPw3Qo72Ahn7Ynfg8kmYNLEPvHWHhPfPNgpJfp5bkLZdrF", // JimmyTudeski - Polkadot Resident
    slots: [
      {
        start: 19653189,
        end: 21157749,
        trackIds: treasuryTrackIds,
      },
    ],
  },
  {
    address: "12s6UMSSfE2bNxtYrJc6eeuZ7UxQnRpUzaAh1gPQrGNFnE8h", // Polkadotters
    slots: [{ start: 19653237, end: 21157738, trackIds: treasuryTrackIds }],
  },
  {
    address: "15fTH34bbKGMUjF1bLmTqxPYgpg481imThwhWcQfCyktyBzL", // 🏔 HELIKON 🏔
    slots: [{ start: 19653237, end: 21157738, trackIds: treasuryTrackIds }],
  },
  {
    address: "1ZSPR3zNg5Po3obkhXTPR95DepNBzBZ3CyomHXGHK9Uvx6w", // W1ZSPR3(William from Talisman)
    slots: [{ start: 19653264, end: 21157744, trackIds: treasuryTrackIds }],
  },
  {
    address: "153YD8ZHD9dRh82U419bSCB5SzWhbdAFzjj4NtA5pMazR2yC", // SAXEMBERG
    slots: [
      { start: 19653264, end: 21157744, trackIds: treasuryTrackIds },
      { start: 21172834, end: 22888566, trackIds: cohort2TrackIds }, // cohort 2
    ],
  },
  {
    address: "12mP4sjCfKbDyMRAEyLpkeHeoYtS5USY4x34n9NMwQrcEyoh", // Polkaworld
    slots: [{ start: 19653280, end: 21157754, trackIds: treasuryTrackIds }],
  },
  {
    address: "1CaXBXVGNbey352w7ydA1A2yDyNQLshycom8Zyj69v5eRNK", // BRA_16 Collective
    slots: [{ start: 21172801, end: null, trackIds: cohort2TrackIds }], // cohort 2
  },
  {
    address: "14Gn7SEmCgMX7Ukuppnw5TRjA7pao2HFpuJo39frB42tYLEh", // Ezio Rojas
    slots: [{ start: 21172820, end: null, trackIds: cohort2TrackIds }], // cohort 2
  },
  {
    address: "16XYgDGN6MxvdmjhRsHLT1oqQVDwGdEPVQqC42pRXiZrE8su", // Irina Karagyaur
    slots: [{ start: 21173594, end: 22888546, trackIds: cohort2TrackIds }], // cohort 2
  },
  {
    address: "15TzZpYZa2rwfBNKhkDzuU1JApgACxD3m6pcaNt4SZneYTV5", // Mexican Collective
    slots: [{ start: 21172820, end: null, trackIds: cohort2TrackIds }], // cohort 2
  },
  {
    address: "12BJTP99gUerdvBhPobiTvrWwRaj1i5eFHN9qx51JWgrBtmv", // oneblock
    slots: [{ start: 21173594, end: 22888546, trackIds: treasuryTrackIds }], // cohort 2
  },
  {
    address: "13mZThJSNdKUyVUjQE9ZCypwJrwdvY8G5cUCpS9Uw4bodh4t", // polkassembly
    slots: [{ start: 21172851, end: 22888555, trackIds: cohort2TrackIds }], // cohort 2
  },
  {
    address: "13Bf8PY8dks2EecNFW7hrqJ7r1aj7iEFFUudFJFvoprXdUiH", // Scytale Digital
    slots: [{ start: 21172851, end: 22888555, trackIds: cohort2TrackIds }], // cohort 2
  },
  {
    address: "12pXignPnq8sZvPtEsC3RdhDLAscqzFQz97pX2tpiNp3xLqo", // Lucky Friday Labs
    slots: [{ start: 21172834, end: 22888566, trackIds: cohort2TrackIds }], // cohort 2
  },
];
