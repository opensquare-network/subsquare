import {
  cohort2TrackIds,
  cohort3TrackIds,
  cohort4TrackIds,
  cohort5TrackIds,
  treasuryTrackIds,
} from "./common";

export const kusamaDvDelegates = [
  {
    address: "GqC37KSFFeGAoL7YxSeP1YDwr85WJvLmDDQiSaprTDAm8Jj", // Adam_Clay_Steeber
    slots: [{ start: 22045831, end: 23551311, trackIds: treasuryTrackIds }],
  },
  {
    address: "Dm4uKxZJZHJbpZpfnYPiHnbgyHWKMU1s5h6X7kqjfYv1Xkk", // Alex PromoTeam Validator
    slots: [
      { start: 22045831, end: 23551311, trackIds: treasuryTrackIds }, // cohort 1
      { start: 23706441, end: 25266027, trackIds: cohort2TrackIds }, // cohort 2
    ],
  },
  {
    address: "EocabFvqttEamwQKoFyQxLPnx9HWDdVDS9wwrUX1aKKbJ5g", // Alzymologist
    slots: [{ start: 22045841, end: 23551317, trackIds: treasuryTrackIds }],
  },
  {
    address: "FDL99LDYERjevxPnXBjNGHZv13FxCGHrqh2N5zWQXx1finf", // Georgii / Space Invader
    slots: [
      { start: 22045841, end: 23551317, trackIds: treasuryTrackIds }, // cohort 1
      { start: 23706462, end: 25266052, trackIds: cohort2TrackIds }, // cohort 2
    ],
  },
  {
    address: "FcjmeNzPk3vgdENm1rHeiMCxFK96beUoi2kb59FmCoZtkGF", // Staker Space
    slots: [{ start: 22045955, end: 23551323, trackIds: treasuryTrackIds }],
  },
  {
    address: "J9FdcwiNLso4hcJFTeQvy7f7zszGhKoVh5hdBM2qF7joJQa", // Ivy voter collective
    slots: [{ start: 22045955, end: 23551323, trackIds: treasuryTrackIds }],
  },
  {
    address: "CpjsLDC1JFyrhm3ftC9Gs4QoyrkHKhZKtK7YqGTRFtTafgp", // Bruno Škvorc
    slots: [
      { start: 23694996, end: 25266027, trackIds: cohort2TrackIds }, // cohort 2
    ],
  },
  {
    address: "CbNFBz4eykqiGqwYTfzRcYZGDh8xhbwwy4QaeiS4ctEPvXn", // Lorena Fabris
    slots: [
      { start: 23706451, end: 25266047, trackIds: cohort2TrackIds }, // cohort 2
    ],
  },
  {
    address: "Ftuq9bHvQb5NiU5JA7q79fxYn9FVBeRjNBHL3RH5raN9qck", // KSM Community Collective
    slots: [
      { start: 23706476, end: 25266052, trackIds: cohort2TrackIds }, // cohort 2
    ],
  },
  {
    address: "DDCNPp8oeYBcBM44b32iSse4t4yfTnDJbjQxohF59Fo23EF", // Luke Schoen
    slots: [
      { start: 23706493, end: 25266038, trackIds: cohort2TrackIds }, // cohort 2
    ],
  },
  {
    address: "H1qzURXmYGLfwMsviLpMeN8S9zjAPmc1LBCSeQkCAieKUFs", // Roger Le
    slots: [
      { start: 23749289, end: 25266038, trackIds: cohort2TrackIds }, // cohort 2
    ],
  },
  {
    address: "Hw38QgLquVjhFc6TmXKzUQie3yezV8dsaP66CnZQm6Tc75M", // Thomas Rivier | Bifrost
    slots: [
      { start: 23707159, end: 25266004, trackIds: cohort2TrackIds }, // cohort 2
    ],
  },
  {
    address: "Hw38QgLquVjhFc6TmXKzUQie3yezV8dsaP66CnZQm6Tc75M", // Tommi/Hitchhooker | Rotko.net
    slots: [
      { start: 23707164, end: 25266004, trackIds: cohort2TrackIds }, // cohort 2
    ],
  },
  {
    address: "DG8Q1VmFkmDwuKDN9ZqdB78W6BiXTX5Z33XzZNAykuB5nFh", // Dr. Jeff Cao
    slots: [
      { start: 23707168, end: 25266047, trackIds: cohort2TrackIds }, // cohort 2
    ],
  },
  {
    address: "JHTfbt39EL1CcbKteN6hG5L5pWo9XWi9XFiyuS9q24cAc8u", // KusDAO
    slots: [
      { start: 25732465, end: 27921177, trackIds: cohort3TrackIds }, // cohort 3
      { start: 27921178, end: 29911969, trackIds: cohort4TrackIds }, // cohort 4
    ],
  },
  {
    address: "Hgm7ELPfRmPKbHgGZCYEZGTjJX8VicXEnFKec7YAeFgAd4d", // Polkadot Hungary
    slots: [
      { start: 25732465, end: 27921177, trackIds: cohort3TrackIds }, // cohort 3
      { start: 27921178, end: 29911969, trackIds: cohort4TrackIds }, // cohort 4
    ],
  },
  {
    address: "DCZyhphXsRLcW84G9WmWEXtAA8DKGtVGSFZLJYty8Ajjyfa", // ChaosDao OpenGov
    slots: [
      { start: 25732403, end: 27921177, trackIds: cohort3TrackIds }, // cohort 3
    ],
  },
  {
    address: "EPrEfsCZQtKt3Cp3vx6BSE4d9ACxMWTN2E5kQBRe612WpL2", // Lucky Friday Labs
    slots: [
      { start: 25732403, end: 27921177, trackIds: cohort3TrackIds }, // cohort 3
    ],
  },
  {
    address: "HcEbeTviCK33EddVN3mfJ6WymWLyKfFuekjhjn5PFirjJ5F", // SAXEMBERG Governance
    slots: [
      { start: 25732529, end: 27921225, trackIds: cohort3TrackIds }, // cohort 3
      { start: 29912325, end: null, trackIds: cohort5TrackIds }, // cohort 5
    ],
  },
  {
    address: "HYmYudY1cxN6XyY98dd82TckYF2YiPFc6sXmHqMoKifGAje", // Le Nexus
    slots: [
      { start: 25732529, end: 27921225, trackIds: cohort3TrackIds }, // cohort 3
      { start: 29912325, end: null, trackIds: cohort5TrackIds }, // cohort 5
    ],
  },
  {
    address: "ELCdsyWFNC7twEeBcQvdpCmpJhGBgiVeWtaKqRqXGn5ATiA", // PERMANENCE DAO/DV
    slots: [
      { start: 27921280, end: 29911925, trackIds: cohort4TrackIds }, // cohort 4
      { start: 29912282, end: null, trackIds: cohort5TrackIds }, // cohort 5
    ],
  },
  {
    address: "EwWrc8UZxaLE8WqCHkygUWAz1PxLc1Jdgzq1kMd8Ac7hKqF", // JAM Implementers DAO
    slots: [
      { start: 27921529, end: 29912023, trackIds: cohort4TrackIds }, // cohort 4
    ],
  },
  {
    address: "E3Ra4aGnmZGGtGaLsoCqjtJowT1qDvuLNEwB8t74M1UQrWM", // Trustless Core
    slots: [
      { start: 27921516, end: 29912023, trackIds: cohort4TrackIds }, // cohort 4
    ],
  },
  {
    address: "D8LipdVuWD5tT3jCjt4WmYMfHi1vRVjpfbK9cz2G2HrWRLw", // Trustless Core - Cohort 5
    slots: [
      { start: 29923134, end: null, trackIds: cohort5TrackIds }, // cohort 5
    ],
  },
  {
    address: "DaCSCEQBRmMaBLRQQ5y7swdtfRzjcsewVgCCmngeigwLiax", // Polkaworld
    slots: [
      { start: 27921459, end: 29911925, trackIds: cohort4TrackIds }, // cohort 4
    ],
  },
  {
    address: "GykHmXkXiMHV2hnsMdZ7xE7zgd9tiwT8k787MovVavAVmTH", // REEEEEEEEEE DAO
    slots: [
      { start: 29912282, end: null, trackIds: cohort5TrackIds }, // cohort 5
    ],
  },
  {
    address: "DvJWp99ooffSqbTaM3sCYCxLUWbz2eEVqra9oeUZZYbMY14", // PBA Alumni Voting DAO
    slots: [
      { start: 29912340, end: null, trackIds: cohort5TrackIds }, // cohort 5
    ],
  },
  {
    address: "EYSyMJjPk5HJb2ZDAYmEpBu7ZgWm7hZ5b1BE88uCifynRgt", // Polkadot Poland DAO
    slots: [
      { start: 29912374, end: null, trackIds: cohort5TrackIds }, // cohort 5
    ],
  },
  {
    address: "FPznjjQJpHieoy3TUruw9YT6DDRETkBxWv3yFEVUMCgn8q8", // The White Rabbit
    slots: [
      {
        start: 29912374,
        end: null,
        trackIds: cohort5TrackIds,
        role: "guardian",
      }, // cohort 5
    ],
  },
  {
    address: "EvoLanodoqDsgHb98Ymbu41uXXKfCPDKxeM6dXHyJ2JoVus", // Daniel Olano
    slots: [
      {
        start: 29912400,
        end: null,
        trackIds: cohort5TrackIds,
        role: "guardian",
      }, // cohort 5
    ],
  },
  {
    address: "DuCg7rhST4TX6DWsyePUjntsmJd6UNyQVTHWD5BFjcgmgWp", // Flez
    slots: [
      {
        start: 29912400,
        end: null,
        trackIds: cohort5TrackIds,
        role: "guardian",
      }, // cohort 5
    ],
  },
  {
    address: "EyPcJsHXv86Snch8GokZLZyrucug3gK1RAghBD2HxvL1YRZ", // Cybergov — AI Agents(Karim)
    slots: [
      {
        start: 29912423,
        end: null,
        trackIds: cohort5TrackIds,
        role: "guardian",
      }, // cohort 5
    ],
  },
  {
    address: "GNdJk9L6P84JXu6wibTzwPiB3vt2rwMjzGEETchf87uNuyW", // GoverNoun AI (Governance Agent) — AI Agent
    slots: [
      {
        start: 29912423,
        end: null,
        trackIds: cohort5TrackIds,
        role: "guardian",
      }, // cohort 5
    ],
  },
];
