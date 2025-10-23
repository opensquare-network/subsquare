# Changelog

All notable changes to this project will be documented in this file.

# 5.4.4

Date:
2025-10-21. [Code diff](https://github.com/opensquare-network/subsquare/compare/c4161977cc7a8fb0c50199e64d35698cb4ccf207...c93d1ad6977471261528bdc1b324c91e6a665f45).

- Support kusama assethub migration.
    - Support fellowship business is still in relay chain which other businesses are in assethub.
    - Fix account votes unlock issue caused by assethub migration.
    - Fix treasury spend period countdown after assethub migration. New countdown is calculated by the `lastSpendPeriod`
      storage.
- Fellowship:
    - Fix api for querying fellowship members.
    - Support fellowship referenda actions so users can see all tally affected votes by members.
    - Fix the page crash by the cleanup pool action.
- Support post content translations for referenda.
- Add a treasury status page to show treasury balances and all beneficiaries.
- Support replying comments from polkassembly.
- Support hyperbridge and support keccakAsU8a hasher.
- Improve treasury spend payout button status. Disable the payout button when invalid and show related tooltip.
- Add whitelist page to show all whitelisted calls.
- Move fellowship category out of the OpenGov menu on the profile page.
- Fix kusama DV address for trustless core.
- Fix page title of the overview page.
- Archive council module for hydration.
- Fix styles and upgrade dependencies.

# 5.4.3

Date:
2025-10-11. [Code diff](https://github.com/opensquare-network/subsquare/compare/0d1a5c15e462d9c6cef3d70cd15fc5a2ff4e3e57...d4edbebf11d54051923378e9d88ecfd0ffed4e07).

- Support kusama assethub migration.
    - Index relay chain for fellowship business and assethub for other governance related business.
    - Fronted configs and use relay chain API for fellowship pages.
- A better design for bounty summary. We show the total value and bounty numbers of different status.
- Show treasury beneficiary status on user profile page.
- Fellowship: enable search for collectives chain and users can search fellowship members, referenda, treasury spends.
- Show related bounty info and link on the referendum detail page if the referendum is related to a bounty.
- Correct zkverify mainnet ss58 format.
- Improve tooltip for bounty funded status tag.
- Refactor referenda curves related code to reduce coupling.
- Style improvements and other code refactor.

# 5.4.2

Date:
2025-09-28. [Code diff](https://github.com/opensquare-network/subsquare/compare/5ce5c40cbc2e7452d8a9e4de92d83de6ccb8a819...b0c8769265ed2489719126a9daa0c6e7185b0537).

- Support for multisig templates. Users can quickly create a call to transfer/batch transfer/add a proxy/remove a proxy.
- Add eco news on the overview page, so users can report/see the latest eco news. Admins can manage news.
- Show the call popup when users are approving a multisig if there is call info, so users can confirm the multisig call.
- Fix deposit tab number on the profile page, so users can see the correct deposits number.
- Use paseo assethub API for paseo multisigs after assethub migration.
- Add a component to sort referenda by index desc.
- Support zkverify mainnet.
- Enable OpenGov actions for hydration, bifrost-polkadot and zkverify.
- Add an award countdown component on the treasury proposal list.
- Fix OpenGov referendum curve chart when a referendum vote finished before the deciding period end.
- Update dependency to wagmi.

# 5.4.1

Date:
2025-09-22. [Code diff](https://github.com/opensquare-network/subsquare/compare/c3afd2a8e965c67b397fb31a86d18275961fa04d...37a8251b4043bb9061f0558411c11ebee0959178).

- [Big] Add a consolidated feeds for fellowship:
    - Index and save referenda related feeds to the database.
    - Add API for latest feeds and paged feeds data.
    - Show the latest feeds panel on the overview page and develop a new feeds page including referenda, membership and
      salary related feeds.
- Add transfer relationships to profile relatives chart for polkadot.
- Decentralized voices
    - Add a statistics message on the influence panel, so users can see how many referenda are affected by the DV
      program.
    - Show the description panel for on each DV cohort detail page.
- Improve pagination component to solve some UX issues.
- Show the 404 component when referendum id error on the referendum detail page.
- Guard invalid address for the profile page and the fellowship evidence detail page.
- Fix page title for coretime and people page.
- Add code guard for democracy call when extracting remarks.
- Fix user's banner does not change when switching addresses on the profile relatives popup.
- Style fixes and code refactor.

# 5.4.0

Date:
2025-09-13. [Code diff](https://github.com/opensquare-network/subsquare/compare/a1113c82465b04faa0ac8e196508d1821a21d967...124ffc47dc551c44dd9d10a1a7c7dfa179c7f24f).

- [Medium] Add decentralized voices page for OpenGov referenda.
    - A table to show DV delegates participation and win rate, comparison of Aye/Nay/Abstain votes.
    - A heatmap to show votes of referenda.
    - Influence to referenda by DV delegations.
    - Data are divided by DAOs and guardians.
    - History DV cohorts are shown, and we can see details of history cohort.
- Show more multisig info on the profile page. If an address is a multisig address, we show its multisigs and its
  composition as a multisig including signatories and threshold.
- Assethub migration support
    - Fix confirmation estimation.
    - Fix deciding progress percentage calculation.
    - Fix preparing blocks calculation.
    - Fix referendum enactment status calculation.
    - Fix the referenda countdown component status calculation.
- Add intime-scan package to index on-chain business following the latest block, not finalized block, so we can get the
  latest on-chain data in fronted without waiting for the block confirmation.
    - Support preimage latest onchain data indexing and fronted integration.
    - Support proxy latest onchain data indexing and fronted integration.
- Add next config headers to fix clickjacking.
- Support autofocus for the votes popup search input.
- Refactor more menu related code on the referendum detail page and the discussion post menu to reduce code coupling
- Fix delegation page with democracy query param.
- Show component 404 instead of redirecting users to 404 page for evidence detail page.
- Style fixes and dependencies upgration.

# 5.3.3

Date:
2025-09-04. [Code diff](https://github.com/opensquare-network/subsquare/compare/269a562dcdcefa6ed08935055118f838d73b8f44...8d11350bf360958e3389b47bfa0ad4ef5d744aac).

- Add a range bar in the referendum curve component so we can zoom in to see votes and impacts on the tally line of
  curve chart.
- Add delegation relationships to profile relatives chart. Users can click a select component to show different types of
  relationships of an address.
- Decentralized voices:
    - Update cohort 4 and 5 delegates.
    - Support DV guardian and show them on the DV votes popup.
- Fix call remark render if the data is hex.
- Refactor account panel scroll prompts components to reduce the coupling of different prompts.
- Redirect users to profile votes page in the vote actions popup after clicking an address.
- [Fellowship] Enable track auto selection for the treasury request referenda template.
- Update the icon for assethub foreign assets.
- Upgrade dependencies.

# 5.3.2

Date:
2025-08-29. [Code diff](https://github.com/opensquare-network/subsquare/compare/ed81cd8a08c3c527b396203a7e14e994a69d898c...a8888fae0b85cfd6d119f6b553e8230a263d3c63).

- Support assethub migration for paseo testnet.
- Show more identity info on the profile page including direct identity, sub identities, judgments.
- Show call data when users are composing a preimage.
- Show remarks in nested calls wrapped in batch, multisig and other calls on the referendum detail page.
- Fix the page crash due to referenda/democracy switch on the delegation page.
- Fix the bug that popup search input is not focused on firefox.
- Code refactor and style improvements.

# 5.3.1

Date:
2025-08-25. [Code diff](https://github.com/opensquare-network/subsquare/compare/b24f98fefd32e87608c3b4a1c481bbbf8d3129b0...ed81cd8a08c3c527b396203a7e14e994a69d898c).

- Show a votes bar on nested and flattened votes popup to better compare votes impact.
- Fix identity name display and not change line for long name in some cases.
- Improve the prompt scroll on the overview page account panel. Show 2 prompts at the same time if there are more than 3
  ones.
- Fellowship:
    - Fix pagination on fellowship salary list pages.
    - Fix a bug that members cannot submit referenda by quick start templates.
    - Disable referenda submission button when RPC not connected and show this tooltip to members.
    - Fix a bug that login popup shows automatically.
    - Change core tab on fellowship profile page to membership.
- Not show the cancel and kill referenda menu if a referendum voting period is finished on the referendum detail page.
- Update assethub foreign assets menu icon.
- Fix coretime chart fixed price phase line.
- Show the 404 component on invalid coretime sale page instead of redirecting users to the 404 page.
- Refactor various post list components including discussion post list, financial council motion list to reduce
  coupling.
- Upgrade dependencies and style fixes.

# 5.3.0

Date:
2025-08-18. [Code diff](https://github.com/opensquare-network/subsquare/compare/f8ca2ad9901c1b324722207a4cfb4688ee4e7193...6375668f9be64a500bc70f6f68dd130ccd9c9c55).

- [Medium] Shows voters on the referendum curves chart; Add a new tab to show curves on a referendum detail page.
- [Medium] Support assethub foreign assets. We can see foreign assets, my foreign assets and transfer my assets.
- [Important] Fix page crash due to google translation. It's due to a confliction between react component update with
  DOM manipulation by google transaction.
- [Important] Child bounty index adaption. Child bounties under a same parent bounty may have same index due to history
  versions. We need to add an additional field (block height) to identity a child bounty in this case.
- Fellowship:
    - Add a slider to select a scope of fellowship member votes. So they can know their vote participation rate in this
      scope.
    - Enable members to create evidence on the evidence list page.
    - Show identity tab on the profile page for collectives subsquare.
    - Redirect users from fellowship member detail page to the profile page to avoid distraction.
- Remove the centrifuge loan from the polkadot treasury panel.
- Improve referenda track queue components and remove the misleading placeholder slots.
- Fix DV start height for Dr. Jeff Cao of cohort 2.
- Show the relatives chart for a multisig address on the multisig account page.
- Change assethub treasury exploerer to statescan.
- Add a user multisig prompt on the account panel.
- Improve copywriting of proposal finalization waiting after creating a new referendum.
- Remove the check all component on the treasury requesting panel on referenda page.
- Fix markdown previewer to show image on WFC
  referenda([#1710](https://polkadot.subsquare.io/referenda/1710), [#1711](https://polkadot.subsquare.io/referenda/1711))
  call tab.
- Code refactor and UI fixes.

# 5.2.0

date: 2025-08-09

- [Big] Fellowship: Enable fellowship members to discuss evidence. Code
  includes [#6385](https://github.com/opensquare-network/subsquare/pull/6385/files), [#6459](https://github.com/opensquare-network/subsquare/pull/6459/files), [#6460](https://github.com/opensquare-network/subsquare/pull/6460/files), [#6473](https://github.com/opensquare-network/subsquare/pull/6473/files), [#6474](https://github.com/opensquare-network/subsquare/pull/6474/files), [#6478](https://github.com/opensquare-network/subsquare/pull/6478/files).
    - We maintain evidence status in indexing scripts, so we can know whether an evidence is active and its related
      referenda.
    - Extract title and content in indexing scripts, so we don't have to fetch them from IPFS every time in fronted.
    - Backend APIs to server related evidence data.
    - An evidence list page in fronted to show all members' evidence status.
    - An evidence detail page where all users can discuss an evidence.
    - Enable SSR render for evidence on fellowship referenda page.
- [Medium] Support creating a multisig by composing a call,
  code [here](https://github.com/opensquare-network/subsquare/pull/6464/files).
- Fix multisig submit button disable status check on the account multisig page.
- Show 404 component on some detail pages instead of redirecting users to 404 page.
- Update endpoints for phala network.

# 5.1.0

date: 2025-08-04

- [Big] As a user, I can create/import a multisig address, and sign a multisig transaction on behalf of this address.
  Code [here](https://github.com/opensquare-network/subsquare/commit/c322bd619c1e47bd3c70024b5a6a4996c246cbf0).
- Fellowship:
    - Query and save evidence content and extract title in indexing scripts, so the fronted can show the title directly
      and don't have to query them from IPFS.
    - Show fiat value for an active fellowship referenda which request DOT.
    - Check whether to show the profile page fellowship tab in server side and show it if history members.
    - Show the active evidence panel on the profile page.
    - Show votes heatmap on the profile fellowship tab.
    - Refactor the salary and status panel to show more info including joined salary cycles, improve the salary
      component and refactor the rank change statistics component.
- Support searching proposals by index.
- Fix bug that treasury deposits are not shown on account deposits page.
- Display the NotFound component for some detail pages including fellowship application and discussion post.
- Add a link to explorer for the latest judgment of identity registrars.
- Refactor some list page components including treasury proposal list, council motion list, ambassador referenda list to
  reduce coupling.
- Improve the voting unlock prompt message and not show it when data is still loading.
- Correct westend treasury modules settings.
- Correct westend assethub block time to 6s.
- Fix the responsive style bug for OpenGov warning message on the overview
  page, [#6447](https://github.com/opensquare-network/subsquare/issues/6447).
- Upgrade dependencies, code refactor and small UI fixes.

# 5.0.5

date: 2025-07-29

- Show preparing stage votes data on the referendum votes curve chart.
- Fellowship:
    - Extract treasury spend info from referenda and show it on the referendum detail page.
    - Use extracted treasury assets info on treasury spends pages.
- Remove deprecated code to extract treasury spend assets data. These codes are taken place by data by indexing.
- Improve environment variables to simplify settings.
- Support multisigs query by a signatory.
- Reset cancel button disable status after user cancel a sign.
- Code refactor to remove useless attributes and optimize components structure.
- Style fixes for some dark mode issues.

# 5.0.4

date: 2025-07-21

- Extract spend info in indexing scripts and use that in fronted.
- Display corresponding USD equivalent value for requested native tokens on referenda list and detail page.
- Refactor:
    - Refactor appendants related code to reduce coupling.
    - Refactor list page components for democracy referenda, public/external proposals, council motions list components.
    - Extract page init code into a dedicated component.
- Add page titles for account pages like votes, proxies, deposits, etc.
- Enable Mimir for westend.
- Show tooltip of the concrete time for identity registrar latest judgment.
- Fix high CPU usage by the multisig signing popup.
- Fix treasury spend symbol bug on the kusama network.
- Fix total account proxy deposits color in dark mode.
- Fix wish for change track color on the referenda statistics page.
- Fix the incorrect governance lock reuse balance after switching to a proxy account on votes popup.
- Add bifrost and basilisk icon on referendum detail page request panel.
- Style fixes and other small code refactor.

# 5.0.3

date: 2025-07-16

- [Medium] Appendants
    - Support bounty curators to add appendants to a parent bounty for the latest context.
    - Support referenda proposers to add appendants for the latest context.
- Display the equivalent USD value for treasury request referenda with DOT/KSM tokens.
- Simplify polkadot API initiation steps.
- Improve account relatives popup and not open new account profile page when clicking new accounts.
- Coretime
    - Fix coretime due to runtime break change. Currently, relay chain block number is used for sale info.
    - Fix coretime menu incorrect when switching to a sale detail page.
- Support treasury spend without an address, but an XCM location.
- Refactor various (referenda, fellowship referenda, treasury proposal, spends, bounties, etc) post-list components to
  reduce code coupling.
- Customize referenda templates for zkverify.
- Display the original amount value in the call detail popup table view.
- Add multisig API for westend after assethub migration and correct explorer link for `when` field.
- Fix an issue that estimated gas and nonce are empty on some transaction popups.
- Fix re-render after global state update.
- Upgrade dependencies and fix styles.

# 5.0.2

date: 2025-07-08

- Enable curators to add appendants for a parent bounty.
- Improve bounty curators view with multiple proxies and multisigs.
- Check account balance for deposits on the new preimage popup.
- Show nonce on some popups that need users signature.
- Update RPC endpoints for polkadot/kusama.
- Add tooltip for multisig column titles.
- Add tooltip for recent proposals title.
- Refactor post list components for OpenGov referenda.
- Fix bugs
    - Fix that search doesn't work on some deployments.
    - Fix tooltips for OpenGov referendum confirmation attempts and tabs.
    - Fix: preimage icon doesn't show up on the account deposits page.
    - Fix: comments count of treasury spend is not correct due to polkassembly new API.
- Other code refactor and style fixes.

# 5.0.1

date: 2025-07-02

- Fellowship:
    - show polkadot execution referenda link on fellowship referenda detail page.
    - Show tooltip for candidate application state tag.
- Extract treasury request info by XCM v5.
- Support OpenGov actions sort by affected tally.
- Index history OpenGov actions and start show actions data start from polkadot referenda #1584.
- Show tally affected actions on the threshold curve chart.
- Show time gap when hovering on the time component of OpenGov actions.
- A11y: fix pagination on delegation page and a possible bug.
- Improve balance loading status on vote popup. Show loading first on open, not 0.
- Show treasury request status bar on overview page treasury panel.
- Fix styles.

# 5.0.0

date: 2025-06-26

- [Big] Asset hub migration support. Most pallets will be migrated to asset hub. This support solve issues in indexing
  scripts, backend API server and fronted page logics.
- [Big] Index and show tally affected actions on a referendum detail page. These actions include vote, remove vote,
  change vote, delegate, change delete, undelegate. We only show it for latest referenda because old data is not
  indexed in this release.
- [Medium] Fellowship:
    - Enable members whose rank >=3 and admins set a final state(rejected, timedout, invalid) to a new
      member application.
    - Add a new member application review todo on fellowship member account panel.
- [Important] Fix 100% CPU usage because of frequent new default object construction.
- Show the 2 signing steps when a user is proposing a new referendum.
- Show treasury requesting status on referenda list page, and users can filter our ongoing treasury related referenda.
- Show a referenda confirming notification on the overview page, so users can know confirming referenda in time.
- Correct block time settings for chains who applied async backing.
- Adapt to polkassembly new API:
    - Fix syncing scripts for proposal context.
    - Refactor API to read polkassembly comments, and it's mainly about the data structure.
    - Fix comments count in fronted. Polkassembly changed the way to calculated comments count in their new API.
- Show estimated gas on vote, delegate, new proxy popups.
- Fix treasury request amount of a referendum with `Scheduler#scheduleNamedAfter`. For
  example [referendum #1584](https://polkadot.subsquare.io/referenda/1584).
- Fix account democracy votes with cancelled referenda.
- Open new browser tabs for external links on various posts.
- Fix skeleton loading style in dark mode.
- Fix a bug that tracks panel is not shown on mobile view.
- Fix asset hub profile page crash due to miss of `ProfileUserInfoProvider`.
- Fix bounties page pagination.
- Add `useDemocracyReferendumStatus` to use onchain storage first for a democracy pallet referendum.
- Correct tooltip for OpenGov vote calls.
- Code refactor and UI tweaks.

# 4.7.8

date: 2025-06-16

- Enable a user to edit a bio on the profile page. Proxy account can also set a bio for an user.
- Use js Array sort function instead of toSorted to fix browser compatibility.
- Add less/more effect for `system#remark` call content.
- Add userAgent to client error report info.
- Fix a cycle dependency error in `useSubStorage` hook.
- Upgrade dependencies.

# 4.7.7

date: 2025-06-11

- Add a OpenGov confirming prompt on overview page.
- Add a coretime sale status prompt on overview page.
- Fix 404 page for child bounties.
- Add treasury spend template to spend local assets.
- Always show vote button on a referendum detail page footer for mobile.
- Fix scan height state when user switch to coretime subspace.
- Add name setting for coretime.
- Take place of cloudflare ipfs endpoint with subsquare infura endpoint in the markdown render process.
- Adjust fellowship menu and show referenda before salary.
- Use `backendAPI` instead of `nextAPI` in more cases.
- Upgrade the dependency to @polkadot/api and small style fixes.

# 4.7.6

date: 2025-06-03

- Asset hub migration: use on chain confirming data to calculate confirmation start height.
- Fix the whole decision time for approved referenda.
- Add 500 page to fix server/client error report.
- Add an identity redirection button on overview page account panel.
- Remove big images in public folder and use that from public CDN.
- Add a `WithApi` component to guard components which need api instance.
- Add skeleton loading for comments.
- Add load more effects for comments.
- Add timeout options for polkassembly comments loading.
- Fix replies from polkassembly API, and filter out replies from subsquare.
- Update loan to bifrost.
- Correct tooltip for referenda tracks with track info got from backend API.
- Fix the case democracy proposal preimage is missing.
- Fix child bounty url on search popup.
- Improve API error message handling.
- Improve treasury spend payout button status, and show warning text when a payout is expired.
- Adjust polkadot/kusama endpoints sort.
- Code refactor and UI/bug fixes.

# 4.7.5

date: 2025-05-29

- A new design of bounty list. We show active bounties at first.
- Support XCM v3 for cross chain call decode.
- Show transferable balance on the new referendum popups.
- Remove referenda track tag tooltip temporarily.
- New referenda popup:
    - Add preimage settings for kusama, hydration, paseo and bifrost. So users can see deposit warnings when they are
      creating new referenda.
    - Fix dark mode style on the new referendum popups.
    - Add copywriting to clearly show whether user balance is enough for deposits.
- Improve walletconnect init code to prevent redundant initiation.
- Add parent bounty id to child bounty index.
- Remove useless component for collectives overview page.
- Disable more API calls through next.js.
- Fix the bug astar community treasury post can not be edited.
- UI/bug fixes and code refactor.

# 4.7.4

date: 2025-05-26

- Support the new child bounties index. By the new code, child bounty index grow only under a parent bounty.
- Add warning tips on new referendum popup to check whether users have enough balance for preimage and referendum
  submission deposits.
- Extract, decode and show system para chain call on a relay chain referendum when it proposes a cross chain call.
- Support hydration address format change, from 63 to 0.
- Add a prompt on overview page account panel to warn user there are expired vote locks.
- Governance asset hub migration: support it in `slow-scan` for vote calls.
- Support walletconnect for polkadot and bifrost.
- Add an identity redirect button on overview page account panel.
- Improve identity search result display.
- Adjust hydration nodes order.
- Update heima(litentry) network endpoints.
- Add more use cases for backend API endpoint and improve next API check.
- Call unsub for useSubSystemAccount.
- Fix kusama fellowship referendum detail page missing by the `collectives-next` package extraction.
- Add a fire icon besides referenda menu.
- Code refactor and UI/bug fixes.

# 4.7.3

date: 2025-05-21

- Remove OpenGov tracks menu and add a tracks panel on referenda page.
- Bug fix: add back fellowship referenda and members page for kusama.
- Governance asset hub migration
    - Switch to asset hub scan after a preset height on relay chain.
    - Return assethub latest height from backend by config.
    - Add config and use asset hub RPCs by config in fronted.
    - Improve the config for the previous asset hub pages. We need to improve some context like relay chain related data
      provider and some component status like hiding the cross chain components after asset hub migrated.
- UX enhancements
    - Add tooltips for referendum tally panel elements and referendum tabs.
    - Add a delegation redirection under referendum vote button.
    - Add tooltips for tabs of recent proposals.
    - Add tooltips for democracy and treasury proposal states.
- Remove altair from networks menu.
- Fix votes popup list flicker after nested delegation popup open.
- Correct interlay and ajuna explorer from subscan to statescan.
- Disable next API access to OpenGov referenda.
- Code refactor and UI/bug fixes.

# 4.7.2

date: 2025-05-19

- [Big] Support people/identity business for relay chains.
- Fellowship:
    - [Big] Move collectives related code to a separated package.
    - Show relay chain call for a whitelist referendum.
    - New style for retention/promotion call info on referendum detail page.
- Improve referendum votes UX by introducing skeleton loading.
- Improve track tag tooltip copywriting.
- Hide web2 login for some chains: astar, ajuna, basilisk, collectives, bifrost, vara, hydration, laos.
- Fix cross chain transport popup close unexpectedly.
- Correct symbol and explorer link for zkverify testnet.
- Fix hydration treasury stable coin symbol.
- Upgrade dependencies and fix styles.

# 4.7.1

date: 2025-05-13

- Fix split vote view on votes bubble panel.
- Add `aDOT` asset calculation on the hydration acquisition address.
- Apply more use cases for `backendApi`. It's due to deployment migration to vercel, and we will call backend API by a
  domain.
- Improve the way to init API instances and use websocket providers to measure RPC delay.
- Fix redundant identity queries.
- UI fix and improvements
    - Add more tooltips for referenda proposal card.
    - Fix horizontal scroll bar on referenda vote calls popup.
    - Add tooltips for referenda state tags.
    - Add tooltips for referenda track tags.
    - Add tooltips for state tag of collective motions.
    - Fix votes bubble loading.
    - Fix virtual list avatar flickering.
    - Fix vote calls popup responsive issue.
- Search enhancements
    - Support searching addresses by identity.
    - Enable search for chains with only democracy and bounties.
    - Enable treasury spends, proposals search.
- Remove new tag for report tab on referendum detail page.
- Disable vote calls for laos network.
- Turn on walletconnect for hydration and kusama.
- Remove Dwellir nodes from interlay/kintsugi.
- Performance enhancement
    - Store referenda vote calls data to IndexedDB.
    - Update scan height by new developed stream API.
    - Take place of redux with global state for scan height data.
    - Query votes info from backend once when open referendum detail page, and refresh it after vote actions.
- Remove Dwellir nodes from interlay/kintsugi.
- Upgrade dependencies and code refactor.

# 4.7.0

date: 2025-05-02

- Fellowship
    - Add vote buttons on fellowship members table wish column.
    - Enable members to vote a wish evidence directly on evidence detail page.
    - Add skeleton loading for the ongoing cycle on the salary list.
    - Fix wish bar to show promotion wish on fellowship member page.
    - Fix rank view on fellowship statistics page.
    - Improve the IPFS link with an icon instead of showing all the CID.
    - Fix the action popup hidden by table border style issue on members page.
    - Improve the summary and description on members page.
    - Add a panel on overview page to guid users to join fellowship.
    - Fix members refresh after demotion actions on members page.
    - Show salary info and activeness status on the salary claim popup.
- Add wizards in the process to create a new OpenGov referendum.
- Support searching OpenGov/Democracy referenda, bounties and child bounties by title.
- Support banner setting on the user profile page.
- Sort delegations by votes on the user profile page.
- Add an advanced menu and put preimages, data and system para chains menu in it.
- Fix received delegation summary on my delegation page.
- Implement an ErrorBoundary component to increase page robustness.
- Update polkadot treasury by adding the 3rd stable coin acquisition address on hydration.
- Refactor polkadot/kusama chain configs.
- Add more tooltips on the referenda voting popup to for better user understanding.
- Support deployment by [vercel](https://vercel.com). We did this because some community members tell us in their
  locations current deployment is super slow sometimes.
- Upgrade mimir SDK to support their latest features and release.
- Add a cache and wrap components with `React#memo` to stop voters flicker on votes popup. There are still performance
  issues with votes popup, and we may try other ways to improve it.
- Fix styles.

# 4.6.3

date: 2025-04-20

- [Big] Support walletconnect. Only enabled for Paseo and Westend in this release.
- Fellowship
    - Show how many wish evidences need a member to vote on the todos panel.
    - Disable vote buttons and show tooltip if a member is not eligible to vote a wish evidence on todos popup.
    - Refactor code to separate fellowship member's todos with that of ambassadors.
    - Not show all tracks on ambassador referenda menu.
- Support avatar setting on profile page. We can set it directly or through a proxy account.
- Upgrade dependency of vite to 5.4.18.
- Show pure property on account panel on profile page relationship card.
- Update polkadot/kusama DV members cohort 4.
- Not show account menu when no address connected or only web2 account login.
- Improve and fix profile layout.
- Not show the empty vote panel on vote popup.
- Refactor TabSwitch component and apply it to timeline components.
- Refactor multi tabs component on various detail page.
- Fix styles.

# 4.6.2

date: 2025-04-11

- [Big] Enable users to use profile page as their landing page
    - Show relationships(proxy, multisig, identity) of the profile address with a flow chart.
    - Show delegation panel on profile page for users who have delegation announcement.
    - Profile page components redesign and layout refactor.
- Fellowship
    - [Medium] Add promotion/retention wishes todo for members and candidates.
    - Implement salary register and payout on fellowship member detail page.
- Add attributes to make profile posted tabs recognized by vimium.
- Dynamic import some components that don't need SSR.
- Add a new tab on referendum detail page to show report from OG tracker.
- Enable comments filtering by on-chain identity.
- Add HDX icon for hydration asset.
- Decode EVM call for hydration.
- Update zkverify testnet.
- Upgrade dependency to @polkadot/api.
- Upgrade dependency to vite.
- Set global font weight to 500.
- Code refactor and other style fixes.

# 4.6.1

date: 2025-04-01

- Fellowship
    - [Medium] Support fellowship new member application.
    - Improve fellowship members filter text.
- [Medium] Show delegation panel on user profile page if this user has delegation announcement.
- Refactor user identity component for easier style customization.
- Refactor chain settings in backend and the related APIs.
- Add tooltip for disabled tracks on delegation popup.
- Refactor scope for `PolkadotTreasuryProvider`.
- Archive democracy, council and technical committee for bifrost.
- Remove inactive networks from menu.
- Upgrade dependencies.
- Fix styles and bug fixes.

# 4.6.0

date: 2025-03-24

- Fellowship
    - [Big] Fellowship member detail page.
    - Support fellowship evidence template.
    - Add wish(promotion/retention) filter on members page.
    - Improve member evidence description as wish.
    - Add login guard for fellowship referenda vote.
- Support switching accounts.
- Fix treasury spend navigation with democracy referenda.
- Fix council motion threshold for astar dapp staking motions.
- [Medium] Refactor profile user info panel and show votes power.
- Guard preimage status name on my deposits page.
- Fix avatar refresh after setting for a proxy address.
- Fix `formatTimeAgo` test case.
- Add call context provider to various detail page call tab.
- Fix extension update warnings with NOVA wallet.
- Support new tracks data structure to fix page crash.
- Add user info in error report data.
- Fix not found treasury spends page.
- Fix call popup disappear after multisig list update.
- Fix multisig table `when` column for litentry.
- Fix user identity font.
- Upgrade dependencies and refactor.

# 4.5.0

date: 2025-02-28

- Fellowship
    - [Big] Show fellowship todo list on account panel.
    - Fix candidates offboard expiration filter.
    - Show ambassador referenda count on collectives overview page.
    - Support cleaning up poll for fellowship referenda.
- Show extension update warning on popups which require signing.
- Show loans to hydration and assethub assets on kusama treasury panel.
- Refactor native asset icon setting to fix DOT icon on assethub.
- Fix chain settings for paseo and paseo assethub.
- Fix teleport between paseo and assethub.
- Add status filter for treasury spends.
- Add a shortcut button on account panel to account multisig tab data.
- Improve the view of switch component under referendum detail tabs.
- Refactor call data provider on referendum detail page.
- [Medium] Show on-chain vesting data and multisig on data section.
- Referendum detail
    - Query referendum votes only from server due to performance reason.
    - Show the white list call hash on referendum detail page call tab if the referendum is to whitelist a call.
    - Allow users to reply their self comments.
- Send notifications to OpenSquare team when there are page errors.
- Customize error(500) and 404 page.
- Support avatar setting as a proxy.
- Update dependencies and fix styles.

# 4.4.8

date: 2025-02-13

- Show fiat value on account panel.
- Add a context to store popup open state.
- Enable users to create a new bounty.
- Fellowship
    - Add placing decision deposit and voting aye options when creating a new referendum.
    - Enable keyboard up/down to select members on fellowship referenda template.
    - Add a new panel on overview page to show fellowship finance which include treasury, salary pool and cycle status.
    - Update a referendum votes every time when the popup is open.
- Refactor my vote on a democracy referendum detail page.
- Refactor polkadot treasury with context.
- Fix: not return null in useEffect.
- Hide local treasury spend preimage template for astar/shibuya.
- Update acala/karura discord link.
- Refresh post detail page after new comment.
- Support poll for SIMA spec discussion post.
- Update RPC nodes for polkadot/kusama.
- Fix treasury proposals page 500 error.
- Improve multisig final submission by supporting users to input call hex data.
- Remove link from multisig status field.
- Rebrand litentry to heima.
- Add a conspicuous notification panel and show multisig notifications on it.
- Improve AI summary generation process. We support DeepSeek, OpenAI and Kimi now.
- Refactor native and asset icon hook, and fix invalid icon.
- Support bifrost ss58 format change.
- Fix styles and code refactor.

# 4.4.7

date: 2025-01-22

- Fellowship
    - [Big] New members page.
    - Only show the popup with eligible voters on the referendum detail page.
    - Demote all features.
    - Show commenters' vote info on the referendum detail page.
    - Improve member selection component on fellowship referenda templates.
    - Disable payout button when a member has claimed his/her salary.
    - Add filter panel for candidates page.
    - Simplify menus for fellowship and only show spends and referenda instead of a group of menus. Put tracks selection
      on the referenda page.
- [Medium] Support ss58 address format change and apply it for bifrost.
- Disable bounties and tips for bifrost.
- Show votes on the threshold curve chart on the OpenGov referendum detail page.
- Utility UI: support users to fast input the locked balance for voting.
- Show delegations on the democracy vote feedback popup.
- Update theme for laos and hydration.
- Correct navigation and vote prompt text on the council motion page.
- Not subscribe my vote on finished referendum page to reduce network load.
- Show the external preimage view on a council page if it proposes an external proposal.
- Fix the business call component gap on the council motion page.
- Correct the loan to centrifuge as $1.5M.
- Enable bounties for LAOS network.
- Fix treasury balance for chains with EVM address.
- Show social links for chains with EVM address.
- Take place of old input components with the new ones.
- Make collapsed menu clickable and redirect users to default pages.
- Optimize the origin/account component to cover more cases.
- Hide unsupported wallets for LAOS network.
- Tweak UIs and small fixes.
- Upgrade dependencies.

# 4.4.6

date: 2025-01-11

- [Medium] Refactor NumberInput component and implement CurrencyInput.
- Add comma to number view.
- Highlight my card on the delegation panel.
- Highlight my card on the fellowship core panel.
- Fix festival event date check.
- Update mimir icon
- Adjust rpc nodes order for polkadot/westend
- Improve request sidebar panel show condition check.
- Fix polkassembly internal relative link url on post sync from polkassembly.
- Upgrade dependency of next.js to 14.2.21.
- Fix vote popup horizontal scroll.
- Fix `useSubStorage` for storage that has multiple params.
- Update lunar new year event image on navigation.
- Fix connected user account context.
- Refactor my vote on referendum detail page and show my delegations.

# 4.4.5

date: 2024-12-30

- [Medium] Support proxies data:
    - Add a list to show all on chain proxies data.
    - Support filtering proxies by identity and address.
    - Support filtering proxies by my address.
- Allow delegation announcement publish by a proxy account.
- Enable referenda and treasury spends for hydration.
- Refactor indexing scripts to scan an extrinsic and its corresponding events then another extrinsic. Previously we
  first scan all events, then all extrinsics.
- [Medium] Bounties:
    - Correct the claim button visibility by checking on chain status.
    - Allow 0 fee when proposing a curator for a bounty or child bounty.
    - Fix the data indexing problem caused by all a child bounty lifecycle in one block. Write several scripts to fix
      the history data.
- Fellowship:
    - Show eligible voters on fellowship referendum detail page.
    - Improve members warning and filter components style on the core page.
    - Fix rank select 0 value select.
    - Fix promotion param value for index 0 on fellowship params page.
    - Fix the `minRankOfClass` function for fellowship so the vote permission issue is fixed for referenda in
      track [31, 33].
    - Disable the rank input on the member approve/promotion popup.
- Fix identity deposit.
- Show my vote status for each referendum on the referenda list page.
- Improve referenda votes popup style to fix the vote records jump issue.
- Refresh assethub my assets by new block.
- Only show how many days for voting lock period.
- Support assets search by symbol/name/id on assethub all assets page.
- Add loading effect for account/address box component.
- Guard user account balance subscription by checking if the address is nil.
- Add the ambassador part to the whole polkadot treasury.

# 4.4.4

date: 2024-12-23

- [Medium] Support the workflow a treasury spend is approved by a democracy referendum.
- Update navbar corner theme for Christmas and new year.
- Remove coretime/assethub menu new tag.
- Fix the USDT icon on the referendum detail page.
- Integrate laos network.
- Remove clearing votes limitation on account page for hydration.
- Enable web3 mode for astar/shibuya.
- [Refactor] Create a user balance context to hold user balance info to reduce redundant balance query.
- [Fellowship] Add a warning on core page to show all members whose demotion periods are reached and can be demoted.
- Fix tabs list component style.
- Upgrade dependency to next.js.

# 4.4.3

date: 2024-12-18

- Add assethub support for paseo.
- Set popup default width 640px.
- Check type and address for add proxy popup.
- Turn on treasury spends for bifrost polkadot.
- Fix treasury spend meta with null `assetKind`.
- Improve new tips button location.
- Show demotion/promotion status on a fellowship membership referendum.
- Refactor proposal quick start template.
- Show valid/expiration count down on treasury spend list.
- Enable treasury and democracy related council templates for hydration/phala/khala.
- Show mimir icon on profile page for a multisig address.
- Fix overview page crash by recent proposals.

# 4.4.2

date: 2024-12-13

- Improve advanced switch component on popups.
- Improve account panel visibility by loading.
- [Medium] Refactor tabs component for better availability.
- Fix network switch panel scroll on short screen.
- Add chain key to `useSubStorage` hook to fix balance bug when switching between relay chain and sub spaces.
- Add guard to fetch multisig data on bounty detail page.
- Use statescan graphql API for multisig info query for polkadot/kusama/paseo.
- Refactor `AddressUser` component for more flexible link passing.
- Add a skeleton loading effect for extrinsic composition on popups.
- Enlarge democracy vote popup width.
- Refactor hook `useAddressVotingBalance` for better voting balance query.
- Add democracy public proposal templates for Ajuna.
- Archive basilisk council.
- Fix balance on some popups.
- Fellowship:
    - Fix fellowship salary cycle detail page crash.
    - Change timeline to feeds on profile page fellowship tab.
- Remove achainable.
- Set threshold of astar motion to be 100%.
- Other code refactor and style fixes.

# 4.4.1

date: 2024-12-09

- [Medium] Proxy support:
    - Show proxy info on account page.
    - Support removing an old proxy.
    - Support creating a new proxy.
    - Show proxy deposits on account page.
- Astar/Shibuya
    - Implement dapp staking templates for the community council.
    - Implement democracy external proposal related templates for the main council.
    - Fix Astar EVM chain config to interact with wallets like metamask.
- Add hydration treasury LP loan to polkadot treasury panel.
- Add a OpenGov referenda template for spending `DOT` on assethub.
- Fix bounty page crash by checking on chain storage status.
- Fix a wallet not found issue.
- Remove tips module from paseo.
- Fix core time price decimals.
- Fix a popup close behavior.
- Enable teleport between assethub for kusama.
- Fellowship
    - Extract call info for `fellowshipCore#promoteFast`.
    - Show evidence if a referendum is promoting a member by `promoteFast` call.
- Interlay/Kintsugi
    - Not show delegation on user profile page.
    - Fix token symbol on democracy metadata.
    - Fix referendum turnout when electorate is 0.
    - Guard escrow chart data to improve robustness.
    - Show escrow token balance on governance related popups.

# 4.4.0

date: 2024-12-02

- [Medium] Integrate assethub under relay chain deployment.
- Support astar and customize its council threshold 2/3.
- Support EVM for astar and shibuya.
- Increase EVM transaction gas limit by 10%.
- Fix/Enhance EVM transaction callback functions.
- Proxy support:
    - Show proxy info on profile page.
    - Show proxy deposits on profile page.
- Show comma for referenda voting balance and convicted votes.
- Update bifrost links.
- Fix markdown new line break. Check the issue [here](https://github.com/opensquare-network/subsquare/issues/5104).
- Improve tabs a11y for vimium on profile page.
- Add external proposal templates for council.

# 4.3.8

date: 2024-11-27

- Not show free balance field on user profile page.
- Add thanksgiving 2024 nav bar theme.

# 4.3.7

date: 2024-11-26

- [Medium] Support comments replacement by SIMA spec.
- Improve referenda votes list by virtual list.
- Add a hot symbol to polkadot referenda stable coin spend template.
- Improve coretime total period by show the remaining time.

# 4.3.6

date: 2024-11-20

- [Big] Add coretime dashboard and history sales page.
- Update decentralized voices cohort 3 delegates info.
- Show myth token value on polkadot treasury panel.
- Use chain height for assethub header.
- Add `role="button"` to some components to
  enable [vimium](https://chromewebstore.google.com/detail/vimium/dbepggeogbaibhgnhhndojpepiihcmeb?hl=en&pli=1).
- Upgrade dependencies.

# 4.3.5

date: 2024-11-18

- Improve polkadot treasury status panel on home page. Add assets on hydration, fellowship treasury, loans, bounties.
- Support SIMA spec for other post types besides referenda.
- Support treasury spend for kusama.
- Remove rococo from network menu.
- Improve arrow icon on home page.
- Hide beneficiary row if not on treasury spend detail page.
- Preimages page
    - Debounce preimage search input.
    - Improve preimages loading and responsive display.
    - Support virtual list for preimage table.
- Show post AI summary on post list page.
- Collectives fellowship
    - Fix fellowship member filter by evidence. Some member leave fellowship but there are still corresponding evidence.
    - Improve fellowship treasury spend button and beneficiary text.
    - Add treasury spend template for fellowship referenda.
- Upgrade dependencies, refactor and fix styles.

### 4.3.4

date: 2024-10-30

- [Medium]Support comments on behalf of a proxied account.
- Fix default threshold for collective(council, TC, etc) proposals.
- Not show approved proposal ids for shibuya treasury template.
- Add reject a treasury proposal template for council motions.
- Update my delegation list after removing one.
- Update dependency to @polkadot/api.

### 4.3.3

date: 2024-10-26

- [Medium] Support approving, cancelling and executing a multisig on account page.
- Enhance the performance to fetch all accounts who give their delegations to a given account. We add a backend API so
  we can fetch data from our backend API and chain RPC in parallel.
- Support ajuna network.
- Take place of OpenAI with [deepseek](https://www.deepseek.com/).
- Add a `spendFromTreasury` template for interlay/kintsugi democracy proposals.
- Add a multisig warning on account panel to show how many active multisigs the connected account has.
- Add Hallowen UI effect.
- Use scan height on the header instead of latest chain height.
- Adjust paseo and hydration rpc endpoints.
- Improve network selection dropdown layout in case the dropdown popup height is too much.
- Improve new proposal button disable status on collectives(council, TC, etc) proposals page.
- Fix styles, bugs and refactor code.

### 4.3.2

date: 2024-10-17

- [Big] Refactor to support child scope redux for supporting child chain space under the parent one. We plan to support
  coretime/assethub/people chain under polkadot deployment.
- [Medium] Support switch between connected address and proxied address when signing extrinsics.
- [Medium] Add filter on profile votes page and refactor the comments filter component.
- [Medium] Support signing/cancelling a multisig, but we hide these features temporarily. They will be released in next
  version.
- Support create a referenda to proposing a curator on bounty detail page.
- Support paseo testnet.
- Fix the convicted value on votes popup.
- Separate solo chains and test networks on menu.
- Upgrade dependencies.
- Fix styles.

### 4.3.1

date: 2024-10-09

- [Medium] Support various bounty actions.
    - Support creating new child bounty on a bounty detail page.
    - Support accepting curator on a bounty detail page.
    - Support accepting curator on a child bounty detail page.
    - Support proposing curator on a child bounty detail page.
    - Show a tip to use Mimir for multisig actions.
- Fellowship
    - Hide vote participation rate for fellowship on profile page.
    - Fix referenda title on fellowship core page.
- Show JSON object when we can not parse treasury spend beneficiary as an address.
- Show polkadot treasury value on hydration chain on the treasury status panel.
- Refactor menu navigation component for 2nd level menu.
- Stop fellowship members page auto refresh caused by block number increase.
- Update polkadot/kusama decentralized voices cohort 2.
- Fix UI style problems.

### 4.3.0

date: 2024-09-29

- Hide account treasury deposit for chains without treasury.
- Hide account identity deposit for chains without identity pallet.
- Refactor menus and move account page out of home page.
- Refactor assethub assets query and support westend/kusama assethub.
- Support teleport between polkadot and collectives.
- Refactor account panel balance component to reduce space.
- Add a fellowship referenda statistics page.
- Support identity timeline people chain explorer link.
- Add a panel on child bounty detail page to show child bounty address and balance.
- Change config to make CI fail when next build fails.
- Fix styles and code refactor.

### 4.2.9

date: 2024-09-25

- Add a filter for OpenGov referenda to see all un-voted referenda.
- Upgrade dependency to @polkadot/api.
- Fix modules control by chains to fix chain deprecated modules like democracy and council.
- Support teleport token from polkadot to assethub.
- Support native token transfer for polkadot, kusama, westend and rococo.
- Refactor assethub assets management with context.
- Remove new tag from referenda tracks tab.

### 4.2.8

date: 2024-09-23

- [Big] Support fellowship sub treasury.
    - Scan treasury related events/extrinsics and serve related data via API.
    - Add fellowship treasury list and detail page.
    - Add a treasury spend template on fellowship new referenda popup.
- [Medium] Support creating proposal for collectives like council, astar community council, etc.
- [Medium] Support multi assets treasury for polkadot.
- Refactor chain settings for modules control.
- Fix menu active count.
- Add filters on fellowship members page.
- Improve Astar community council treasury approval template with a treasury proposal select component.
- Fix editor style issues by correcting dependency to styled components.
- Fix transferable on assethub teleport popup.
- Improve treasury spend paid state color.
- Upgrade dependency to vite and next.js.
- Enhance view for very small value.
- Improve the way to check loading for collective(council) members.
- Fix styles and refactor code.

### 4.2.7

date: 2024-09-11

- [Medium] Add a context on top of collective pallet instances related pages including council, tech committee, etc. So
  we can increase code reusability and reduce bugs.
- [Medium] Design and improve the referenda decision progress bar for cases when deciding time is over the normal time(
  defined by track).
- Use subscription to update collective votes, so we don't have to trigger the update after vote.
- Add claim button on bounty detail page.
- Extract assets info by XCM v4 on treasury related spends pages.
- Improve account info layout on polkadot assethub.
- Refactor:
    - Support block hash as param for hook `useBlockApi`.
    - Support custom api for hook `useSubStorage`.
    - Improve some contexts with createStateContext.
    - Improve the way to get fellowship max voters.
    - Improve `web3Enable` origin for extensions.
    - Use subscription to get tip meta.
    - Remove useless redux items.

### 4.2.6

date: 2024-09-06

- [Medium] Improve eslint rule and fix react hook dependencies.
- Refactor treasury related pages with context and fix astar community treasury overview data.
- Show referenda confirmation attempts time duration.
- Fix extrinsic submission with talisman.
- Remove litmus and turing network from network menu.
- Fix styles [#4650](https://github.com/opensquare-network/subsquare/issues/4650).

### 4.2.5

date: 2024-09-04

- Fix Markdown table color.
- Fix call tree view for inline call.
- Astar community treasury
    - Fix to be awarded value
    - Fix proposal un-finalization check.
    - Add award countdown on proposal detail page.
- Enable statescan for collectives.
- Fix transferable when balance is 0.

### 4.2.4

date: 2024-09-03

- [Big] Refactor the code to submit transactions.
- Enhance `valid_from` UI on referenda submission modal.
- Polkadot fellowship
    - Improve some text about fellowship, like expenditure -> salary, etc.
    - Improve demotion warning text on fellowship core page.
    - Remove westend collectives because nobody use it.
    - [Medium] Refactor code to increase code reusability. We created hooks to replace redux slices.
    - Fix referendum redirection after creation.
    - [Medium] Support fellowship evidence by either IPFS or bytes content.
    - Fix fellowship promote/bump button status.
    - Add advanced options on new approval/promotion related popups to hide referendum details.
- Update endpoints.
- Add assets transfer history on subsquare polkadot assethub.
- Support hydration EVM transaction with multiple gas assets.
- Fix referendum decision deposit check.
- Display curator info on bounty detail page.
- Support Astar and its testnet Shibuya network.
- Support zkverify testnet.
- [Bug] Fix transferable balance calculation.
- [Medium] Enhance treasury spends info on referendum detail page
  like [#944](https://polkadot.subsquare.io/referenda/944).
- Fix expiration countdown component on treasury spend detail page.
- [Bug] Fix tabs not highlighted on profile page due to incorrect hooks dependencies.
- Code refactor and dependencies upgrade.

### 4.2.3

date: 2024-08-20

- Polkadot fellowship
    - [Big] Add polkadot fellowship statistics page.
    - [Medium] Add more filters on fellowship core page.
    - Add salary related warnings on overview page to inform members to register and claim salary.
    - Show demotion/promotion progress bar on fellowship members page.
- Subscribe treasury spend status on detail page and update post when new update detected.
- Enable kill/cancel referenda templates for westend.
- AssetHub
    - Support assethub cross chain with relay chain.
    - Support litentry/litmus decimals change.
    - Fix assethub profile page crash.
    - Show proxy and extension metadata update warnings on assethub overview page.
- Support astar test network shibuya.
- Fix broken post rendered table by markdown [#4580](https://github.com/opensquare-network/subsquare/issues/4580).
- Fix open graph social media link.
- Fix styles and refactor code.

### 4.2.2

date: 2024-08-06

- [Big] Implement SIMA governance spec for OpenGov referenda and treasury proposal.
- [Big] Add referenda tracks visualization page.
- [Medium] Add referenda templates to cancel/kill a referendum.
- Collectives
    - Show fellowship/ambassador member basic info on profile page.
    - Show fellowship/ambassador member core(management) feeds on profile page.
    - Show fellowship/ambassador member salary payments and feeds on profile page.
    - Handle collective member case when demotion period is 0.
    - Improve demotion/promotion progress bar display with different colors.
- Add user warnings for assethub assets management.
- Refactor and improve styles.

### 4.2.1

date: 2024-07-30

- Fellowship
    - Add core members management warnings.
        1. Show how many members' evidences need to be handled.
        2. Show members' demotion warnings.
        3. Show members' promotion warnings.
    - Add referenda templates including members promotion and retain.
    - Add a panel on fellowship core params to give more explanations.
    - Set default page size to 25 on salary cycle detail page.
- Add a notification on account panel to enable connected user to update chain runtime metadata to extension.
- Use subscribed referendum info by default on referendum detail page.
- Support referenda for altair chain.
- Not shown treasury spend valid from count down when no chain height got.
- Refactor and fix styles.

### 4.2.0

date: 2024-07-25

- [Big]Support assethub, now features implemented includes assets transfer and all assets metadata list.
- [Big]Refactor address connect related components.
- Add templates on preimages page.
- Fix markdown previewer for code block view and styles.
- Prevent multiple extensions popup when login.
- Remove new tag from referenda whales and statistics tab.
- Set nav menu collapsed as default.
- Increase cookie expire time.
- Refactor: take place of useClickOutside with useClickAway.
- Add remark template to fellowship new referenda popup.
- Improve the style of new referenda templates.
- Cache metadata for assethub chain to improve the performance of querying stable coin treasury.
- Fix page height by sidebar height on proposal detail page.
- [Big]Show on-chain evidence for polkadot collectives including fellowship and ambassador.
- Check permissions for collective(fellowship/ambassador) vote and refactor the vote popup.
- Make the fellowship induction address input component more obvious.
- Show un-voted fellowship referenda for members.
- Refine account panel for collectives to show fellowship and ambassador status.
- Show related referenda on fellowship core member card.
- Upgrade the dependence to polkadot api.
- Extract useSubStorage to simplify storage subscription.
- Other code refactor and fix styles.

### 4.1.1

date: 2024-07-11

- Support PolkaGate Metamask snap.
- Add valid and expiration count down for treasury spends.
- Support payout action for treasury spends.
- Fix user avatar on comments from polkassembly.
- Set conviction votes decimal to 1.
- Improve editor loading effect.
- Fix code block style on post detail.
- Add fellowship/ambassador rank tag on profile page.
- Auto login when link/unlink a post to a proposal.
- Fix user identity on address input.
- Add withSignedTransaction to signer options.
- Fix tabs components key.
- Fix styles and upgrade dependencies.

### 4.1.0

date: 2024-07-04

- [Big] Support ambassador related business on collectives.
- [Big] To improve the next.js hydration time, lazy load various components/pages including quill.js editor, referenda
  whales page, statistics page, etc.
- Fix polkadot fellowship demotion period business when it's 0.
- Introduce `react-use` to simplify hooks.
- Enable referenda for Basilisk.
- Update kusama decentralized voices cohort 2 delegates.
- Take place of moment.js with day.js.
- Subscribe referenda info decision deposit so UI will update immediately when deposit placed.
- Code refactor.
- Upgrade dependencies including cmdk, wagmi, polkadot.js, etc.

### 4.0.7

date: 2024-06-14

- [Big] Support treasury spends.
- Lazy loading many popup components.
- Add a foldable referenda menu for fellowship.
- Show comments immediately after loading from server.
- Add Father's Day sidebar decoration.
- Fix connect address error.
- Fix detail page chart config.

### 4.0.6

date: 2024-06-13

- [Big] Support more EVM wallets with [wagmi](https://wagmi.sh/).
- [Medium] Support comments filter.
- Update endpoints.
- Hide avatar prompt if connected user already set.
- Support westend testnet.
- Show core and salary sections for westend collectives.
- Update decentralized voice cohort 2 delegates for polkadot.
- Show requested stable coin value in overview request column.
- Upgrade dependencies.

### 4.0.5

date: 2024-06-07

- Add USDx treasury spend proposal template for OpenGov referenda.
- Add `system#remark` proposal template for OpenGov referenda.
- Fix fellowship core approve referendum template track.
- Support avatar setting by SIMA spec.
- Support hydraDX rebranding to hydration.
- Add dragon boat header decoration which will show near dragon boat festival.
- Fix delegate search for chains which support both substrate and EVM.
- Fix styles.

### 4.0.4

date: 2024-05-30

- Support SIMA spec avatar setting/unset.
- Fix polkassembly comments for collectives.
- Show USDx treasury spend info on post list and detail page.

### 4.0.3

date: 2024-05-20

- Support treasury proposal template for referenda.
- Support evidence submission for polkadot fellowship members.
- Upgrade dependency to next.js 14.1.1.
- Extract call args from `coreFellowshp#approve` call.
- Add loading effect for editor.
- Remove identity timeline for kusama, because identity is moved to people chain.
- Refactor summary component.
- Fix styles.

### 4.0.2

date: 2024-05-08

- Add a button for fellowship member to create a referendum to approve a member.
- Support fellowship member to claim salary.
- Support fellowship salary bump.
- Fix symbol color on tooltip.
- Update dependency to @polkadot/api.
- Update bifrost settings.
- Fix collectives alliance unscrupulous page crash.
- Code refactor.

### 4.0.1

date: 2024-04-30

- [Big] Support user creating new fellowship referenda proposal.
- [Big] Add an escrow statistics page for interlay/kintsugi.
- Add an induction panel on fellowship home page.
- Support shortcut actions for fellowship members to create a member promotion referendum.
- Support fellowship members to import himself/herself to salary system.
- Support fellowship members to register a salary cycle.
- Fix fellowship salary cycle expenditure.
- Fix induction status and registered number on fellowship salary summary.
- Add query param on referenda detail page to locate tabs.
- Improve RPC nodes connection by not setting the first one as default.
- Add labor day decorations.
- Add an icon on list page to show malicious posts or proposals.
- Refactor and fix, improve styles.

### 4.0.0

date: 2024-04-19

- [Big] Show OpenGov voting whales.
- [Big] Show referendum statistics on detail page.
- [Big] Implement centrifuge dashboard on overview page.
- [Medium] Show decentralized voices status and DV tags on detail page.
- [Medium] Support self induction to polkadot fellowship salary system for fellowship members.
- [Medium] Refactor connect wallet popup and support signet multisig wallet.
- Show self and total votes on profile votes page.
- Add filter to polkadot fellowship core/salary feeds.
- Improve polkadot fellowship salary claimants fetch source, so we can update it in time.
- Add a tooltip component on overview page to warn user they are performing as a proxy.
- Show preimage missing warning for democracy referenda.
- Refactor module fields in chain settings.
- Fix styles and code refactor.

### 3.9.1

date: 2024-04-06

- Add fellowship salary claimants page.
- Add members summary for fellowship salary module.
- Show my delegate card in a separate section.
- Add preparing referenda number on referenda list summary.
- Set OpenGov as the default tab of posted tab on profile page.
- Remove useless tabs on referenda my votes page.
- Fix styles and update dependencies.

### 3.9.0

date: 2024-03-22

- [Big] Add delegation UI. Show delegates with their announcements.
- [Big] Implement polkadot fellowship salary cycle detail page.
- Support Centrifuge EVM.
- Add transfers and identity tab on profile page for polkadot/kusama.
- Fix EVM address profile url.
- Disable batch removing votes when votes >= 10 for HydraDX.
- Refactor council members page and improve the way to query data.
- Add `ApiContext` to host api instance.
- Pass params via context for various popups.
- Remove outdated props for multiple select components.
- Only council members can call `TipNew`.
- Enable dotreasury for Centrifuge.
- Fix styles and code refactor.

### 3.8.8

date: 2024-03-04

- Add fellowship salary cycles page.
- Show delegation status on profile page.
- Correct referenda delegators on statistics page.
- Query polkassembly comments from backend API.
- Upgrade dependencies and fix styles.

### 3.8.7

date: 2024-02-27

- [Medium] Support EVM account for hydraDX.
- Bump rich text editor.
- Fix call tree view none value.
- Fix styles.

### 3.8.6

date: 2024-02-08

- Change scan height subscription to loop query.
- Add lunar new year decoration on menu.
- Refactor and improve styles.

### 3.8.5

date: 2024-02-04

- [Big] Support fellowship core system business.
    - Core members page.
    - Core feeds page.
    - More params page to core system.
    - Support induct, import and bump actions.
- Introduce and develop new set of button components.
- Integrate Mimir multisig wallet.
- Add conviction voting lock explanation.
- Enable referenda for darwinia2.
- Fix preimage deposits layout.
- Query polkassembly comments from fronted.
- Make RPC endpoints configurable.
- Extract a transaction submission button and refactor some code for submitting txs.
- Fix active referenda/fellowship count in menu.
- Improve styles.

### 3.8.4

date: 2024-01-31

- Change detail page subscription to loop query.
- Add fellowship core members page.
- Fix tailwind fond plugin.
- Fix styles.

### 3.8.3

date: 2024-01-24

- Support creating democracy public proposal.
- Disable editor posting when uploading images.
- Show discourse forum topics for acala/centrifuge.
- Fix bifrost polkadot treasury fiat value.
- Show polkadot collective RFCs on overview page.
- Reduce fetched data size for list pages.
- Fix post content font smoonthing.
- Code refactor and fix styles.

### 3.8.2

date: 2024-01-19

- [Medium] Support creating OpenGov referenda proposal.
- Add salary status panel for polkadot collectives.
- Show forum topics for polkadot/kusama/rococo.
- Remove subscription for finished proposal detail page.
- Render fellowship members with server side data.
- Adjust RPCs for collectives chain.
- Improve collectives params table value.
- Sync polkassembly proposal data for zeitgeist.
- Sanitize post html and improve styles.
- Fix styles and update @osn/previewer.

### 3.8.1

date: 2024-01-17

- [Medium] Show deposits and multisigs on user profile page.
- Implement params page for polkadot collectives.
- Archive tips menu for polkadot/kusama.
- Redirect user to detail page when a new tip is created.
- Adopt github markdown style and bump osn/previewer.
- Improve loading effect on council vote popup.
- Add treasury state on home page.
- Store metadata with IndexedDb.
- Remove useless state syncing code after child bounty claimed.
- Fix motion/tip columns.
- Fix styles.

### 3.8.0

date: 2024-01-06

- [Big] Implement web3 address connect and remove login.
- [Medium] Refactor list/table component form better render user experience.
- Support preimage pallet `requestStatusFor` storage.
- Refactor democracy referendum status data with subscription.
- Fix next.js SSR warning and bump @osn/previwer.
- Remove useless callbacks when submitting extrinsics.
- Remove ‰ and keep only % for percentage view.
- Update democracy votes more times when tally changed.
- Fix: auto clean error when email verify button clicked.
- Fix and improve styles.

### 3.7.4

date: 2023-12-29

- Improve RPC connections by caching metadata.
- Improve theme color for basilisk, khala and phala.
- Redirect legacy subscription page to notifications page.

### 3.7.3

date: 2023-12-27

- [Big]Support creating new preimage on preimages page.
- Improve RPC endpoints selection and fault toleration.
- Merge polkassembly and subsquare discussions to a single page.
- Create a merry Christmas logo background.
- Show multisig status on my account multisig page.
- Fix styles.

### 3.7.2

date: 2023-12-22

- Support removed tag for democracy to handle democracy pallet removal from polkadot and rococo.
- Fix UI issues with council member list.
- Fix value display symbol color.
- Update @osn/previewer.

### 3.7.1

date: 2023-12-05

- Show my identity deposits.
- Support refunding referenda submission deposit.
- Not show empty proposal sections on overview page.
- Correct dotreasury links.
- Archive gov1 sections for polkadot/rococo.
- Fix article content styles.
- Update dependencies.

### 3.7.0

date: 2023-12-01

- [Big]Show my multisigs on account page.
- [Big]Show my deposits on account page, and a user can refund referenda deposits.
- Introduce AI summary for posts.
- Show vote info besides commenter on OpenGov and democracy referendum detail page.
- Improve preimages page layout on mobile screen.
- Fix and improve styles.

### 3.6.5

date: 2023-11-20

- [Medium] Refactor the layout of overview page.
- Show bounty balance on bounty detail page.
- Enable OpenGov for Bifrost Polkadot and Rococo.
- Update dependencies.
- Fix my referenda votes unlock-able balance calculation.

### 3.6.4

date: 2023-11-03

- Show active proposal numbers on menu for democracy, treasury and various collectives.
- Implement new style of cookie consent popup.
- Take place old map with an LRU cache.
- Add subscription tip component on referenda list panel.
- Fix empty box icon.

### 3.6.3

date: 2023-10-27

- Show estimated confirmation start time on OpenGov referendum page.
- Show a feedback popup after users vote a referendum.
- Fix removing vote call fro moonriver.

### 3.6.2

date: 2023-10-26

- Enable removing my delegations on referenda delegation popup.
- Add query params for profile votes, so we can locate different vote type when page render.
- Refactor the vote popup view for address who have delegated their votes.
- Improve accordion component on notifications page.
- Show toast when notifications are saved.
- Enable vote calls for bifrost polkadot.
- Upgrade dependency of next.js from 13.3.0 to 13.5.0.
- Fix styles.

### 3.6.1

date: 2023-10-19

- [Medium]Support notifications by telegram.
- Add spam folder check warning message on email binding components.
- Improve delegation info number format on referendum detail page.
- Enhance toast style, and make it more striking.
- Add off-chain voting links on my votes page.
- Upgrade dependencies.
- Implement accordion card component.
- Shorten referendum breadcrumb.

### 3.6.0

date: 2023-10-12

- Allow post authors and admins to delete a discussion post.
- Merge comments from subsquare and polkassembly.
- Show my delegated OpenGov referenda votes on my votes management.
- Add a link to all my votes history on my votes management.
- Show OpenGov prior locks on my votes management page.
- Implement enhanced tree view for call on OpenGov and democracy referendum detail page.
- [Medium]Refactor tailwind related codes.
- Fix: kintsugi timeline compact mode doesn't work.
- Add index for posts on discussions page.
- Add loading effect for treasury panel items.
- Fix styles.

### 3.5.2

date: 2023-10-08

- Fix referenda delegation voting checking.
- Clear already stored votes data after leaving referendum detail page.
- Refactor the complex user component.
- Improve tailwind config for vscode.
- Show prior lock for democracy.
- Show empty placeholder for on-chain votes on mobile view.
- Improve `referenda` to `Democracy referenda`.
- Housekeeping: remove useless code.

### 3.5.1

date: 2023-09-30

- Improve content placer when proposal post has no context or no comments.
- Improve loading effect for democracy vote popup.
- Refactor code about my votes management.
- Use scan height before latest chain height query.

### 3.5.0

date: 2023-09-27

- [Medium]Users don't have to login before signing an extrinsic.
- [Medium]Show an address' delegated on chain votes for democracy pallet, while business for OpenGov referenda is still
  under developing.
- Add a hint for users who have set a proxy that we're showing the on chain votes of the proxied account.
- Correct user component for polkassembly users, and users can go to polkassembly user detail page.
- Fix breadcrumb style to prevent case that a breadcrumb item text is too long.
- Fix OpenGov referenda confirmation progress bar if last confirmation abort doesn't cause a rejection.

### 3.4.8

date: 2023-09-23

- Show user balance on profile page.
- Refactor curve components on referendum detail page and fix a bug the curve history chart may not appear.
- Improve scan height subscription and remove redundant ones.
- Add header and menu to terms and privacy page.
- Add councilor link to dotreasury on profile page if an address is previously a councilor.
- Show a hint on my votes component to explain we show proxied account votes when one is set.
- Show multiple beneficiaries when there are multiple ones on referendum detail page.
- Not fetch user identity from `getServerSideProps` which may cause performance problems.
- Fix comments don't update correctly after update.
- Fix dark mode style issues.
- Show timeout countdown for fellowship referenda.

### 3.4.7

date: 2023-09-18

- Refactor various page components and fix post detail data subscription.
- Refactor: pass `focusEditor` function through context and this will make code more clean.
- Fix detail page bug due to removal of kintsugi/interlay treasury pallet.
- Fix child bounty state tag color on detail page.
- Change the contact email to yongfeng@opensquare.network.

### 3.4.6

date: 2023-09-13

- Refactor detail page breadcrumbs.
- Remove `withLoginUserRedux` wrapper function for page components.
- Refactor the code to get list data of server side props.
- Deprecate the legacy login page.
- Fix: login/signup page bugs with web2 users which have email bind with web3 user.
- Fix: update login user information after verification.
- Fix usePreimage deps error.
- Fix acala/karura financial motion state.
- Fix polkassembly discussion post thumbs up reaction view.

### 3.4.5

date: 2023-09-05

- Show my vote and support removing vote on referendum detail page.
- Improve tally history line style of referendum curve chart, and improve chart initialization.
- Implement conviction slider for democracy/referenda pallets.
- Fix styles.

### 3.4.4

date: 2023-09-01

- Render `system#remark` call content with markdown previewer.
- Refactor: Control detail page tabs with data in redux.
- Styles enhancement
    - Improve comment source tab position on detail pages.
    - Fix username alignment with avatar.
    - Fix title alignment with proposal index on list pages.
    - Fix off-chain voting fonts.
    - Fix subsquare icon in dark mode.
    - Improve confirmation progress bar on referendum detail page.
    - Enlarge referenda curves chart size for better view.
- Fix referenda curves data when hovering.
- Fix referendum confirmation bar tooltip.
- Refactor external link component and add subscan link for referenda.

### 3.4.3

date: 2023-08-28

- Add circle packing view for referenda/democracy votes distribution.
- Implement tally history line on the referendum detail tally curve chart.
- Support voters search by address/identity on referenda/democracy votes popup.
- Set default color theme to light.
- Enable post showing less/more feature only when content length is greater than 1200px.
- Update endpoints for various chains.
- Refactor more pages router to follow RESTful rules.
- Fix the interaction conflict between metamask and talisman.
- Fix bugs and styles.

### 3.4.2

date: 2023-08-23

- Refactor routes for referenda/democracy/treasury related pages.
- Show confirmation attempts for OpenGov referenda.
- Fix referenda confirmation bars.
- Add identity support for special addresses, #3165.
- Remove new treasury proposal button for kintsugi/interlay.
- Add notification subscription component on overview panel for kintsugi/interlay.
- Fix editor related styles.

### 3.4.1

date: 2023-08-17

- Add OpenSquare off-chain voting and bounties link to summary page.
- Show OpenGov fellowship votes history on user profile page.
- Add my votes tab to referenda and democracy page.
- Refactor: replace old chain icons.
- Fix styles.

### 3.4.0

date: 2023-08-14

- [Big]Support on-chain votes management, including support for referenda and democracy.
- Fix countdown component default color.
- Add on-chain events subscription warning tip on overview panel.
- Fix styles.

### 3.3.5

date: 2023-08-12

- Feature: support upload images by OpenSquare editor.
- Feature: support scam reporting for various posts.
- Fix locking period color on dark mode.
- Polish: remove democracy and collectives statistics from summary panel.
- Polish: show referendum timeout countdown on referenda list when referenda preparation phase passed but no decision
  deposit put.
- Polish: show multiple remarks if referenda call has multiple `system#remark` or `system#remarkWithEvent` calls.
- Refactor: reuse login popup.
- Fix the mis-behavior when click outside popup.
- Change users link to profile votes page on votes popup.
- Fix reddit icon.

### 3.3.4

date: 2023-08-02

- Feature: add preimages page.
- Feature: add show more/less for long post.
- Fix: twitter summary card preview for various chains.
- Refactor: remove useless code and icons on public directory.
- Refactor: rename v2 files.
- Subscribe interlay/kintsugi locked balance instead of multiple times query.
- Fix invalid icons.
- Chore: disable tailwind built in colors.
- Improve lots of styles, including search box, borders, header, shadow, etc.

### 3.3.3

date: 2023-08-01

- Support login popup and refactor various login related pages.
- Fix kintsugi/interlay treasury balance.
- Refactor kintsugi/interlay democracy next launch related code.
- Add warning components when OpenGov referendum preimage is missing.
- Fix timeline count for OpenGov referendum, treasury proposal and bounty.
- Support OpenGov referendum decision deposit refund.
- Fix project logo dark mode color on navigation panel.

### 3.3.2

date: 2023-07-27

- Add OpenGov referendum confirmation toggle component, so we can see confirmation status in different views.
- Correct referendum decision end calculation.
- Fix tally support bar background color.
- Fix create post page CSS.
- Clean useless code.

### 3.3.1

date: 2023-07-26

- Support [vara network](https://vara-network.io/).
- Fix theme colors.
- Hide votes tab for collectives chain.
- Add account social links from identity on profile page.
- Only show referenda confirmation bar toggle when confirming.
- Fix delegation bar on referendum detail page.

### 3.3.0

date: 2023-07-23

- [Big]New design development, including:
    - Sidebar menu.
    - List, detail, statistics, profile page refactor.
    - Icons, theme color redesign.
    - Other layout refactor.
- [Medium] Support data subscription on proposal detail page, so we don't have to use callback when actions submitted.
- [Medium] Add referenda/democracy votes history on user profile page.
- Add voting countdown component for democracy referendum.
- Enable fellowship for westend collectives.
- Support login with Nova wallet.
- Improve proposal call business extraction.
- Fix democracy referendum vote finished height check.
- Support timeline item link to block.
- Fix markdown `ol` element view.

### 3.2.5

date: 2023-07-04

- Support moonriver.
    - Login with metamask.
    - Various pre-complied contracts interactions.
    - Various collectives support.
- Add treasury award countdown component on proposal detail page.
- Enable democracy vote calls for karura.
- Show related business fields by the info generated by scan process.
- Add api to get history votes of account.

### 3.2.4

date: 2023-06-27

- Implement Referenda delegation for multiple tracks at one time.
- Support [PolkaGate](https://polkagate.xyz/) extension.
- Subscribe referenda/fellowship referendum on-chain info so we can remove the callback function which will update it
  after voting.
- Show fellowship votes count on tally panel.
- Show referenda aye/nay votes from SplitAbstain vote.
- Introduce lodash.capitalize to take place the legacy util function.

### 3.2.3

date:2023-06-22

- Enable events subscription for polkadot collectives deployment.
- Enable OpenGov for Bifrost.
- Reduce unnecessary referendum votes query.
- Improve OpenGov list page title.

### 3.2.2

date: 2023-06-12

- Show fellowship UI on polkadot collectives para chain.
- Implement a status filter for OpenGov referenda.
- Add dotreasury link to subsquare treasury panel for kusama and polkadot.
- Show direct vs delegation vote ratios on OpenGov referendum detail page.
- Fix OpenGov referendum decision deposit button disable status.
- Update votes automatically when OpenGov/democracy referendum tally changed.
- Supported bifrost polkadot para chain.
- Separate democracy/referenda votes scan with the main scan process, add a new api to serve new votes data, and adapt
  this in fronted.

## 3.2.1

date: 2023-06-08

- Refactor child bounty claim related components, and make child bounty claim button enabled only when it's mature.
- Improve fellowship and referenda navigation components to better show their correlation.
- Use subscription way to fetch referenda referendum tally instead of one time query and refactor related components.
- Add referenda filter components so user can filter referenda by their status.
- Show curve chart on fellowship referendum detail page.

## 3.2.0

date: 06/02/2023

- Refactor my delegation/been delegated popup UI, and align with that of delegation statistics.
- Clicking motion close button trigger login modal if no account has login in.
- Allow anyone to claim a child bounty when it's mature.
- Add `maxWidth` attribute for user component, so we can control the space taken by long identity name.
- Add fellowship and referenda navigation UI to show their correlation with call whitelist.
- Optimize nested vote UI, so we can leave more space for delegated votes.
- Subscribe info of democracy referendum and refactor related pages/components, so tally will be updated automatically.
- Integrate [achainable](https://www.achainable.com/) labels to polkadot subsquare.
- Fix styles and bugs.

## 3.1.4

date: 05/30/2023

- Refactor detail container components.
- Improve and fix tooltip components, previously some tooltips were hidden by other containers.
- Add [achainable](https://www.achainable.com/) labels support for kusama.
- Fix mismatch between `useThemeMode` and `useThemeSetting`.
- Show tally bar on OpenGov and democracy referenda.

## 3.1.3

date: 05/26/2023

- Add nested votes view for democracy and OpenGov referenda.
- Extract dedicated detail container components for treasury proposal, tip and OpenGov referendum.
- Fix pages crash due to kusama drops democracy and tips pallet from metadata.

## 3.1.2

date: 05/22/2023

- Populate OpenGov referendum title by parity tip bot automatically.
- Show voting countdown component for democracy referendum.
- Refactor democracy referendum tally with hooks.

## 3.1.1

date: 05/23/2023

- Support kintsugi democracy referenda statistics.
- Update democracy statistics breadcrumb text.
- Fix incorrect metamask interaction.

## 3.1.0

date: 05/22/2023

- Support OpenGov referenda tracks comparison statistics.
- Support OpenGov statistics for each track.
- Add democracy statistics for votes trend.
- Correct council close button disable state.
- Support evm compatible chains, like darwinia2.

## 3.0.5

date: 05/05/2023

- Show min enact period on OpenGov track panel.
- Show OpenGov enactment status on referendum detail page.
- Fix proposal hash is not shown on democracy referendum metadata.
- Fix OpenGov referendum decision deposit popup can not be opened.

## 3.0.4

date: 04/29/2023

- Show delegation statistics for democracy.
- Add components for OpenGov referendum preparing phase visualization.
- Support users to place OpenGov referendum decision deposit.
- Add sharp to dependencies to improve next build image optimization.
- Add statescan link for polkadot/kusama.
- Add link of all tippers on tip detail page.
- Remove unused patch-package dependency and upgrade other dependencies.
- Follow system's appearance setting when a user has no theme setting.
- Support end date setting to calendar user event.

## 3.0.3

date: 04/17/2023

- Upgrade to next.js v13, check [#2809](https://github.com/opensquare-network/subsquare/pull/2809).
- Fix react hydration error, found after next.js v13 upgrade.
- Fix cmd+k shortcut, currently we can use it on every page.
- Add vote type annotation, so we can know the meaning of `/d`, `/s`, `/sa` of vote records.
- Enhance number input component. Now it supports max/min value.

## 3.0.2

date: 04/06/2023

- Support nest comments.
- Support democracy public proposals batch seconds action.
- Fix treasury bounty approve/reject voting state tag color.
- Improve tally numbers' view on mobile page.

## 3.0.1

date: 03/31/2023

- Support closing collective motion.
- Flatten menu, remove the separation of gov2 from gov1.
- Improve CI build and style prettier.
- Show OpenGov referenda vote extrinsic time with local time.
- Update polkadot/kusama/collectives endpoints.
- Add zeitgeist advisory committee motions to overview page.
- Set default page size on list page to 25.
- Fix style issues.

## 3.0.0

date: 03/27/2023

- Add calendar feature which show history governance events and future events.
- Fix fellowship section header, previously mistaken with referenda.
- Show vote turnout percentage for democracy referenda.
- Refactor to avoid duplicated image assets.
- Improve project config to avoid annoying LSP diagnostics.

## 2.9.9

date: 03/22/2023

- Support binding a discussion post for proposals.
- Add a search box to header, google in site search for this release.
- Improve and normalize various chain header logos.

## 2.9.8

date: 03/13/2023

- Add login user profile link to the dropdown menu.
- Customize zeitgeist advisory committee motion market info.
- Improve popup responsive style.
- Fix delegation items responsive scroll style.
- Improve husky hooks for eslint.

## 2.9.7

date: 03/03/2023

- Enable polkadot collectives.
- Fix cmdk mask background color.
- Improve eslint config and fix lint warnings.
- Add warning bar for scam proposals.

## 2.9.6

date: 02/28/2023

- Add zeitgeist advisory committee motion events subscription UI.
- Support discussion post labels.
- Extract more hooks for collective pallet.

## 2.9.5

date: 02/17/2023

- Add OpenGov2 activities to user profile.
- Support cmdk.
- Support alliance features for collectives para-chain.
- Enable child bounties for khala/phala.
- Refactor
    - Overview page and backend apis code.
    - All backend controllers code structure.
- Fix bugs.
- Update dependencies.

## 2.9.4

date: 02/15/2023

- Add subscription UI for OpenGov.
- Add a link to list page for overview categories.
- Improve post body word break.
- Fix bug: can not create post after canceling polls.
- Fix bug: financial motion state.

## 2.9.3

date: 02/08/2023

- Show split vote for OpenGov.
- Customize zeitgeist advisory committee call on the motion detail page.
- Fix statescan url.
- Fix bugs.

## 2.9.2

date: 02/07/2023

- Show enhanced user delegation/been delegated info for OpenGov referenda.
- Support litentry.
- Fix babel configurations.
- Fix democracy referendum estimated execution time when passed.

## 2.9.1

date: 02/03/2023

- Support zeitgeist advisory committee.

## 2.9.0

date: 02/03/2023

- Support Split/AbstainSplit vote for democracy and OpenGov.
- Add page view for un-finalized proposals, not redirect users to 404 page.
- Add ignore checkbox for email setting reminder in the login process.
- Refactor duplicated popup components.

## 2.8.2

date: 01/28/2023

- Hide democracy launch period for kintsugi/interlay.
- Enable bounties for litmus.

## 2.8.1

date: 01/18/2023

- Show OpenGov referenda on overview page.
- Add timeline for treasury proposal approved by OpenGov.
- Change default IPFS gateway to that of infura.
- Remove discussions elements for centrifuge/altair.
- Support OpenGov inline proposal call.
- Fix confirmation countdown of OpenGov referenda on list page.
- Fixes including layout, styles, typos.

## 2.8.0

date: 12/31/2022

- Add track curve chart for each OpenGov referendum.
- Add cookie consent modal.
- Show treasury proposals by OpenGov referenda.
- Fix styles: overview item href property, extract neutral panel, etc.

## 2.7.0

date: 12/26/2022

- Add active proposals count panel on summary page.
- Support fellowship voting and show all votes.
- Show address/value list who has delegated their vote to login address.
- Support show referenda `SplitAbstain` vote type.
- Code refactor: extract `GreyPanel` component.

## 2.6.3

date: 12/17/2022

- Add curve chart on referenda track page.
- Support threshold visualization of fellowship referendum.

## 2.6.2

date: 12/15/2022

- Bind kintsugi public proposal with treasury proposal.
- Show kintsugi escrow value, and the staked balance.
- Show my vote on democracy and OpenGov referendum detail page.
- Increase the syncing time after submitting extrinsics.
- Show the estimated token lock time for conviction voting.
- Style fixes including markdown content hr element color.

## 2.6.1

date: 12/14/2022

- Change bifrost to bifrost kusama, and fix subscan external link.
- Show active referenda number when menu fold.
- Show related `treasury#spend` business for OpenGov referendum.
- Query on-chain tally for active referendum.

## 2.6.0

date: 12/09/2022

- Support fellowship, including referenda and members.
- Support proxy setting, and all extrinsics will be wrapped in proxy call if a proxy address set.
- Add eslint config to check next-common package errors.
- Remove unnecessary timeline item parameters.
- Fix css issues.

## 2.5.0

date: 11/30/2022

- Improve gov2 referenda tracks menu.
- Use the login address to sign extrinsics, and remove address selection.
- Show gov2 referendum tally approval and support threshold.
- Support democracy pallet delegation and refactor democracy section panel.
- Improve treasury list items value display.

## 2.4.7

- Disable background page scrolling when popup is shown.
- Fix theme toggle with react context, while previously we use redux.
- Fix democracy second api call with the latest version.
- Always show gov2 referendum confirmation bar and improve the background color.
- Fix democracy referendum hash introduced by the latest democracy pallet version.

## 2.4.6

- Support gov 2.0 track delegation.
- Turn on gov 2.0 for kusama.
- Add breadcrumb various proposals.
- Sync polkassembly content for gov 2.0 proposals.
- Improve subsquare/polkassembly default comments tab choice.
- Improve child bounty value display.
- Fix page width for some pages including empty overview page, settings page, etc.

## 2.4.5

- Remove @polkadot/api patch for account nonce.
- Remove disabled status for tip endorse.
- Fix nested delegation votes for gov2.
- Fix styles.

## 2.4.4

- Fix treasury new proposal/tip value with string arg.
- Fix nested delegations votes bug.

## 2.4.3

- Support Rococo.
- Fix referenda menu style in mobile.
- Fix page layout of council/TC members and settings page.
- Hotfix menu external link icon style.
- Fix councilor tip extrinsic.

## 2.4.2

- Support gov 2.0.
- Home menu foldable.
- Support TC motion and democracy subscription and notification.

## 2.4.1

- Upgrade dependency of @polkadot/api to 9.6.2.
- Use rpc to query total supply and escrow balance for kintsugi/interlay.

## 2.4.0

- Support treasury and motion notifications.
- Refactor detail pages.
- Add loading effect to thumb up action.
- Set users link to domestic.
- Refactor components.
- Fix councilor check in tip.
- Fix link/unlink address.
- Style fixes and hotfixes.

## 2.3.2

- New network selection drop down menu.
- Fix motion vote number.
- Fix link identity icon.
- Fix tip beneficiary, and tip/bounty timeline by polkadot/api upgrade.
- Improve polkassembly democracy links.
- Fix child bounty beneficiary checking.
- Fix styles.

## 2.3.1

- Use the login web3 address as the default signer for actions.
- Support claiming child bounty.
- Add unsubscription link in notification emails.
- Remove useless user profile query in `Auth` component.
- Fix toast item style.

## 2.3.0

- Add profile page to show user governance activities.
- Add countdown component for tips, child bounties, and bounties.
- Add tip status to the tip card.
- Improve system#remakr view by checking whether bytes are utf8.

## 2.2.5

- Add referendum to treasury proposal's timeline.
- Show motion vote status.
- Fix address login page SSR.
- Fix typo: referendums -> referenda.
- Fix bounty/child bounty award timeline item.
- Hotfix kintsugi/interlay thumbs up expand crash bug.

## 2.2.4

- Support altair.
- Fix twitter share location in post author view.
- Fix tc and council motions on democracy navigation.

## 2.2.3

- Support login with talisman and subwallet.
- Support share post to twitter.

## 2.2.2

- Refactor pagination component.
- Use scanned electorate for vote finished referendum.
- Add all referenda votes.
- Fix typescript markdown preview.
- Support centrifuge and zeitgeist.
- Support copy comment url.
- Style and typo fix.

## 2.2.1

- Add check all councilors and TC members link.
- Fix motion id.
- Fix motion voter, no proposer as default aye vote.
- Fix styles:
    1. Caret color on dark mode.
    2. Markdown text no-wrap.
    3. Tag color

## 2.2.0

- Support dark mode.
- Sync polkassembly discussion posts and all comments for Kusama/Polkadot.
- Code refactor including new layout, tags, buttons, etc.

## 2.1.4

- Support customize poll end data.
- Improve balance loading on treasury proposal modal.
- Fix council/TC members page layout.
- Show extrinsic failed info on toast.
- Support democracy `ProposalCanceled` scan.

## 2.1.3

- Support phala and turn on crust
- Apply OpenSquare editor and markdown renderer
- Refactor icons and remove redundant icons in next and kintsugi-next package
- Hotfix: vote button not shown for council members on motion detail page
- Handle post empty title
- Fix child bounty title and style on parent bounty detail page
- Fix kintsugi/interlay treasury modal balance

## 2.1.2

- Support discussions post polls
- Upgrade dependency to @polkadot/api
- Refactor part of icons

## 2.1.1

- Support set post banner
- Refactor chain settings which will benefit new chain support
- Support centrifuge. Support track motion `fast_track` external proposal.
- Add loading state when setting verification email on email page
- Fix bugs by missing of React imports
- Set all signatories to be the authors of a proposal

## 2.1.0

- Support new network: polkadot, kusama, crab, polkadex, turing
- Replace updated time icon
- Correct interlay vote symbol
- Fix interlay treasury value
- Show council prime voter
- Style fix: bullets, inline code

## 2.0.1

- Support safari >= 14.0
- Fix electorate query
- Show polkassembly lik for polkadot and kusama
- Change kintsugi SNS preview cover
- Fix tip finder

## 2.0.0

- Support Kusama
- Implement did login
- Support safari and improve the compatible page
- Improve public proposal second list
- Fix referendum electorate
- Upgrade dependency to @polkadot/api

## 1.10.4

- Support public proposal second action
- Support proposing treasury proposal
- Support crust and calamari
- Fix the link to 404 page from user without linked address
- Improve timing to close popup when extrinsic is wrapped in block
- Extract common components to better scale democracy vote actions

## 1.10.0

- Prevent error by ethereum address in polkadot extension
- Customize the header for chains
- Refactor code to separate backend from main repo

## 1.9.10

- Add council motion to democracy proposal navigation bar.
- Add pending toast when submitting extrinsic transaction.
- Show referenda at the top of overview page.
- Update @polkadot/api dependency to 7.13.1.

## 1.9.9

- Add accordion effect for detail page metadata/timeline
- Normalize bounty metadata(fixed some value normalization)
- Support interlay
- Support polkadex democracy
- Fix markdown editor memory leak(update unmounted component)

## 1.9.8

- Code refactor
    - Encode address code refactor
    - Remove some useless functions
    - Extract common components and services
- kintsugi: fill input value when clicking voting balance
- Fix bounty active color
- Add off-chain voting to menus

## 1.9.7

- Support polkadex
- Code refactor: keep only the redux store on next-common package
- Create chainSlice to store the latest chain height and block time
- Extract common styled components

## 1.9.6

- Improve time duration format
- Style improvement like correct font size in timeline
- Show time for end and delay in referendum metadata
- Extract common components

## 1.9.3

### Added

- Show motion end information for Kintsugi tech.comm motions.
- Add loading effect to Kintsugi referenda vote dialog.

### Update

- Kintsugi Tech.Comm Motions in overview condition: ended in the past 3 days => ended in the past 1 day.

### Fixed

- Prevent code execution after to404 function is called.
- Form validation error hint style fixup.

### Refactor

- Some shared components are migrated to `next-common`.
- Split the component interacting with `PolkadotExtension` into more atomic pieces.

### Removed

- Un-used functions and importation statements.

## 1.9.2

### Added

- Show scrollbar for long address list selection.
- Show council/TC/financial council motion time counting down.
- Update tip state with the tip extrinsic.

### Fixed

- Correct state tag background color.
- Fix Timeline last activity time.

### Refactor

- Remove unused view layer utility functions for kintsugi.

## v1.9.1

### Added

- Handle democracy public proposal canceled status.

### Fixed

- Fix Council/TC motions post time updating.
- On-chain tippers data-fetching incorrect field name fixup.
- Kintsugi referendum metadata ongoing status display fixup.

## v1.9.0

### Added

- Show spinner before referendum voting threshold loaded.
- Display proposeCurator arguments in bounty timeline.
- Show democracy voting process in Kintsugi treasury proposal timeline.
- Loading effect for tippers card.

### Fixed

- Fix referendum info update when the delay is 0.
- Rearrange menus.
- Timeline folding status fixup.
- CSS fixup.
- Typo fixup.

## v1.8.1

### Fixed

- Metadata display fixup

## v1.8.0

### Fixed

- Support Kintsugi fixup
- Shared UI components between next & dedicated kintsugi-next projects

## v1.7.2

### Added

- Support Acala
- Support Kintsugi
- Handle with FastTrack event

## v1.7.1

### Fixed

- GitHub Flavored Markdown support fixup

## v1.7.0

### Added

- Support Bifrost

### Fixed

- Metadata display issues

## v1.6.8

### Added

- Support Kabocha

### Fixed

- Karura onchain Treasury summary display

## v1.6.7

### Fixed

- Motions URL fixup

## v1.6.6

### Added

- Financial Council support for Karura
- Display current Treasury pot above treasury related pages
- Scan function for democracy preimage
- Migrate more functions into scan-common package
- New next-common package for shared UI components

### Fixed

- UI fix up
- Abbreviate big number display
- Show linked business information in motions

### Update

- New private policy
- Regular dependency update

## v1.6.5

### Added

- Create post for Tech.Comm. proposals and support the corresponding discussion
- Design and improve the post preview in SNS
- Improve code block view for text edit with markdown
- Editors height adapts to the contents
- Loading effect for comments submission

### Fixed

- Tech-comm motion display issues
- Improve bounty description layout
- Correct post time(use a block time if available)
- Correct sub-scan external link

## v1.6.4

### Added

- Add website pages metadata to enhance the preview on SNS
- Support markdown table
- Rich text editor now supports inserting embeded Youtube link
- Show the warning of invalid democracy proposal image

### Fixed

- Remove invalid block-chain nodes
- Remove out-dated info form overview page
- Fix posts updated time mis-display
- Fix wrong link addresses in emails
