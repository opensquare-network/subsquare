/**
 * @typedef {Object} TabsList
 * @property {TabsListItem[]} tabs
 * @property {string} activeTabValue
 * @property {(tab: TabsListItem) => void} onTabClick
 * @property {string} className
 */

/**
 * @typedef {Object} TabsListItem
 * @property {string | React.ReactNode} tooltip
 * @property {string | React.ReactNode | (({active}: {active: boolean}) => React.ReactNode)} label
 * @property {string | React.ReactNode} labelExtra
 * @property {string} className
 * @property {boolean} active
 * @property {number} activeCount
 * @property {() => void} onClick
 * @property {string} url
 * @property {boolean} shallow
 */
