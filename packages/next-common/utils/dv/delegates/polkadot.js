import {
  cohort2TrackIds,
  cohort3TrackIds,
  cohort4TrackIds,
  cohort5TrackIds,
  treasuryTrackIds,
} from "./common";

export const polkadotDvDelegates = [
  {
    address: "13EyMuuDHwtq5RD6w3psCJ9WvJFZzDDion6Fd2FVAqxz1g7K", // ChaosDao OpenGov
    slots: [
      { start: 19653189, end: 21157749, trackIds: treasuryTrackIds }, // cohort 1
      { start: 21172801, end: 22891629, trackIds: cohort2TrackIds }, // cohort 2
      { start: 23363983, end: 25570898, trackIds: cohort3TrackIds }, // cohort 3
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
      { start: 23364976, end: 25570905, trackIds: cohort3TrackIds }, // cohort 3
    ],
  },
  {
    address: "11fx8xKPNd4zVSBxkpN8qhhaGEmNJvPgKqwhDATZQXs7dkM", // SAXEMBERG cohort 5
    slots: [
      {
        start: { assetHub: 9603169, relay: 27578766 },
        end: { assetHub: 11238360, relay: 29522238 },
        trackIds: cohort5TrackIds,
      }, // cohort 5
    ],
  },
  {
    address: "12mP4sjCfKbDyMRAEyLpkeHeoYtS5USY4x34n9NMwQrcEyoh", // Polkaworld
    slots: [
      { start: 19653280, end: 21157754, trackIds: treasuryTrackIds },
      { start: 25571048, end: 27578561, trackIds: cohort4TrackIds },
    ],
  },
  {
    address: "1CaXBXVGNbey352w7ydA1A2yDyNQLshycom8Zyj69v5eRNK", // BRA_16 Collective
    slots: [{ start: 21172801, end: 22891629, trackIds: cohort2TrackIds }], // cohort 2
  },
  {
    address: "14Gn7SEmCgMX7Ukuppnw5TRjA7pao2HFpuJo39frB42tYLEh", // Ezio Rojas
    slots: [{ start: 21172820, end: 22891621, trackIds: cohort2TrackIds }], // cohort 2
  },
  {
    address: "16XYgDGN6MxvdmjhRsHLT1oqQVDwGdEPVQqC42pRXiZrE8su", // Irina Karagyaur
    slots: [{ start: 21173594, end: 22888546, trackIds: cohort2TrackIds }], // cohort 2
  },
  {
    address: "15TzZpYZa2rwfBNKhkDzuU1JApgACxD3m6pcaNt4SZneYTV5", // Mexican Collective
    slots: [{ start: 21172820, end: 22891621, trackIds: cohort2TrackIds }], // cohort 2
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
    slots: [
      { start: 21172834, end: 22888566, trackIds: cohort2TrackIds }, // cohort 2
      { start: 23363983, end: 25570891, trackIds: cohort3TrackIds }, // cohort 3
    ],
  },
  {
    address: "15KHTWdJyzyxaQbBNRmQN89KmFr1jPXXsPHM5Rxvd1Tkb2XZ", // KusDAO
    slots: [
      { start: 23364955, end: 25571026, trackIds: cohort3TrackIds }, // cohort 3
      { start: 25571027, end: 27578617, trackIds: cohort4TrackIds }, // cohort 4
    ],
  },
  {
    address: "13z9CiETVYCrxz3cghDuTyRGbaYQrwSyRnRcJX5iFbXvrwhT", // Polkadot Hungary
    slots: [
      { start: 23364955, end: 25571026, trackIds: cohort3TrackIds }, // cohort 3
      { start: 25571027, end: 27578617, trackIds: cohort4TrackIds }, // cohort 4
    ],
  },
  {
    address: "16Gpd7FDEMR6STGyzTqKie4Xd3AXWNCjr6K8W8kSaG1r4VTQ", // Le Nexus
    slots: [
      { start: 23364976, end: 25570912, trackIds: cohort3TrackIds }, // cohort 3
      {
        start: { assetHub: 9603169, relay: 27578766 },
        end: { assetHub: 11238335, relay: 29522211 },
        trackIds: cohort5TrackIds,
      }, // cohort 5
    ],
  },
  {
    address: "14ZaBmSkr6JWf4fUDHbApqHBvbeeAEBSAARxgzXHcSruLELJ", // PERMANENCE DAO/DV
    slots: [
      { start: 25571026, end: 27578561, trackIds: cohort3TrackIds }, // cohort 4
      {
        start: { assetHub: 9603081, relay: 27578579 },
        end: { assetHub: 11238027, relay: 29521894 },
        trackIds: cohort5TrackIds,
      }, // cohort 5
    ],
  },
  {
    address: "13vYFRVn6d4e3vQtrFJppQKN9qhatbCLwci2JQdWuNoXw8i7", // Trustless Core
    slots: [{ start: 25571060, end: 27578624, trackIds: cohort4TrackIds }], // cohort 4
  },
  {
    address: "16m5p2WXqhRtYZFxzR4VUCBu9h9VDgg8AP1DzqUfduT4pdjD", // Trustless Core - Cohort 5
    slots: [
      {
        start: { assetHub: 9603193, relay: 27578820 },
        end: { assetHub: 11238367, relay: 29522245 },
        trackIds: cohort5TrackIds,
      }, // cohort 5
    ],
  },
  {
    address: "15EVjoms1KvEAvZaaNYYvnWHmc3Xg1Du3ECuARHyXdPyh1bs", // PBA Alumni Voting DAO
    slots: [
      {
        start: { assetHub: 9603193, relay: 27578820 },
        end: { assetHub: 11238382, relay: 29522260 },
        trackIds: cohort5TrackIds,
      }, // cohort 5
    ],
  },
  {
    address: "1313ciB4VzPeH3n1QKJym1brBmzRdfHBEctWipgH4uGsyF6n", // Polkadot Poland DAO
    slots: [
      {
        start: { assetHub: 9603214, relay: 27578868 },
        end: { assetHub: 11238461, relay: 29522339 },
        trackIds: cohort5TrackIds,
      }, // cohort 5
    ],
  },
  {
    address: "13NCLd3foNpsv1huPDzvvfyKh37NEEkGFotZnP52CTR98YFJ", // JAM Implementers DAO
    slots: [{ start: 25571091, end: 27578624, trackIds: cohort4TrackIds }], // cohort 4
  },
  {
    address: "13du3Rt2CAV9L1v1QXTeYosuKaiBSYiPWpa2B4nxzfSdEAF1", // REEEEEEEEEE DAO
    slots: [
      {
        start: { assetHub: 9603081, relay: 27578579 },
        end: { assetHub: 11238034, relay: 29521903 },
        trackIds: cohort5TrackIds,
      }, // cohort 5
    ],
  },

  {
    address: "13pgGkebYEYGLhA7eR6sBM1boEvq86V9adonjswtYe1iDK2K", // The White Rabbit
    slots: [
      {
        start: { assetHub: 9603274, relay: 27579005 },
        end: { assetHub: 11238467, relay: 29522345 },
        trackIds: cohort5TrackIds,
        role: "guardian",
      }, // cohort 5
    ],
  },
  {
    address: "15oLanodWWweiZJSoDTEBtrX7oGfq6e8ct5y5E6fVRDPhUgj", // Daniel Olano
    slots: [
      {
        start: { assetHub: 9603214, relay: 27578868 },
        end: { assetHub: 11238409, relay: 29522287 },
        trackIds: cohort5TrackIds,
        role: "guardian",
      }, // cohort 5
    ],
  },
  {
    address: "1haHsRuCUCkbkPRmSrnfP8ps6cTaR2b5JCU5uNPUbxsVPbf", // Flez
    slots: [
      {
        start: { assetHub: 9603241, relay: 27578931 },
        end: { assetHub: 11238431, relay: 29522309 },
        trackIds: cohort5TrackIds,
        role: "guardian",
      }, // cohort 5
    ],
  },
  {
    address: "13Q56KnUmLNe8fomKD3hoY38ZwLKZgRGdY4RTovRNFjMSwKw", // Cybergov — AI Agents(Karim)
    slots: [
      {
        start: { assetHub: 9603274, relay: 27579005 },
        end: { assetHub: 11238474, relay: 29522352 },
        trackIds: cohort5TrackIds,
        role: "guardian",
      }, // cohort 5
    ],
  },
  {
    address: "14oJnm4XKoNbzR6B8eqRF8rrt5eHvVgKN79y16L6jQvvp3pt", // GoverNoun AI (Governance Agent) — AI Agent
    slots: [
      {
        start: { assetHub: 9603241, relay: 27578931 },
        end: { assetHub: 11238438, relay: 29522316 },
        trackIds: cohort5TrackIds,
        role: "guardian",
      }, // cohort 5
    ],
  },
];
