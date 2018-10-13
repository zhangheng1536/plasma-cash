import Web3 from 'web3'
import { EthCardsContract } from './cards-contract'
import { Entity } from 'loom-js'
import BN from 'bn.js'

export const DEFAULT_GAS = '3141592'
export const CHILD_BLOCK_INTERVAL = 1000

// TODO: these should be pulled out of a config file generated by a Truffle migration
export const ADDRESSES = {
  validator_manager: '0xf5cad0db6415a71a5bc67403c87b56b629b4ddaa',
  root_chain: '0x9e51aeeeca736cd81d27e025465834b8ec08628a',
  token_contract: '0x1aa76056924bf4768d63357eca6d6a56ec929131'
}

// TODO: these should be pulled out of a config file generated by a Truffle migration
export const ACCOUNTS = {
  authority: '0x7920ca01d3d1ac463dfd55b5ddfdcbb64ae31830f31be045ce2d51a305516a37',
  alice: '0xbb63b692f9d8f21f0b978b596dc2b8611899f053d68aec6c1c20d1df4f5b6ee2',
  bob: '0x2f615ea53711e0d91390e97cdd5ce97357e345e441aa95d255094164f44c8652',
  charlie: '0x7d52c3f6477e1507d54a826833169ad169a56e02ffc49a1801218a7d87ca50bd',
  dan: '0x6aecd44fcb79d4b68f1ee2b2c706f8e9a0cd06b0de4729fe98cfed8886315256',
  mallory: '0x686e245584fdf696abd739c0e66ac6e01fc4c68babee20c7124566e118b2a634',
  eve: '0x9fd4ab25e1699bb252f4d5c4510a135db34b3adca8baa03194ad5cd6faa13a1d',
  trudy: '0xe8445efa4e3349c3c74fd6689553f93b55aca723115fb777e1e6f4db2a0a82ca'
}

export function sleep(ms: any) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function getTestUrls() {
  return {
    wsWriteUrl: process.env.TEST_LOOM_DAPP_WS_WRITE_URL || 'ws://127.0.0.1:46658/websocket',
    wsReadUrl: process.env.TEST_LOOM_DAPP_WS_READ_URL || 'ws://127.0.0.1:46658/queryws',
    httpWriteUrl: process.env.TEST_LOOM_DAPP_HTTP_WRITE_URL || 'http://127.0.0.1:46658/rpc',
    httpReadUrl: process.env.TEST_LOOM_DAPP_HTTP_READ_URL || 'http://127.0.0.1:46658/query'
  }
}

export async function pollForBlockChange(
  user: Entity,
  currentBlock: BN,
  maxIters: number,
  sleepTime: number
): Promise<BN> {
  let blk = await user.getCurrentBlockAsync()
  for (let i = 0; i < maxIters; i++) {
    blk = await user.getCurrentBlockAsync()
    if (blk.gt(currentBlock)) {
      break
    }
    await sleep(sleepTime)
  }
  return blk
}

// All the contracts are expected to have been deployed to Ganache when this function is called.
export function setupContracts(web3: Web3): { cards: EthCardsContract } {
  const abi = require('./contracts/cards-abi.json')
  const cards = new EthCardsContract(new web3.eth.Contract(abi, ADDRESSES.token_contract))
  return { cards }
}
