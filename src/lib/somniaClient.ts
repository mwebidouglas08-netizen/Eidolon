import { Protocol, Market } from './types'

export const SOMNIA_CONFIG = {
  rpc: process.env.NEXT_PUBLIC_SOMNIA_RPC || 'https://dream-rpc.somnia.network',
  chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '50312'),
  chainName: process.env.NEXT_PUBLIC_CHAIN_NAME || 'Somnia Devnet',
  symbol: 'SMT',
  blockExplorer: 'https://shannon-explorer.somnia.network',
  blockTime: 400,
}

export const PROTOCOLS: Protocol[] = [
  { id: 'somnia_swap', name: 'SomniaSwap', baseApy: 18.2, tvl: 12.4, address: '0x1111111111111111111111111111111111111111' },
  { id: 'dream_lend',  name: 'DreamLend',  baseApy: 12.6, tvl: 8.7,  address: '0x2222222222222222222222222222222222222222' },
  { id: 'ether_vault', name: 'EtherVault', baseApy: 9.8,  tvl: 22.1, address: '0x3333333333333333333333333333333333333333' },
  { id: 'flux_fi',     name: 'FluxFi',     baseApy: 24.1, tvl: 5.2,  address: '0x4444444444444444444444444444444444444444' },
  { id: 'nexus_dao',   name: 'NexusDAO',   baseApy: 31.5, tvl: 3.8,  address: '0x5555555555555555555555555555555555555555' },
]

function rand(min: number, max: number) { return Math.random() * (max - min) + min }
function randHex(len: number) {
  return Array.from({ length: len }, () => Math.floor(Math.random() * 16).toString(16)).join('')
}

export class SomniaClient {
  private blockNumber = 4821334
  private gasPrice = 1.2

  async getBlockNumber(): Promise<number> {
    this.blockNumber += Math.floor(rand(1, 4))
    return this.blockNumber
  }

  async getGasPrice(): Promise<number> {
    this.gasPrice = +rand(0.9, 1.9).toFixed(2)
    return this.gasPrice
  }

  async getBalance(_address: string): Promise<number> {
    return +rand(9.5, 11.5).toFixed(4)
  }

  async getMarketData(): Promise<Market[]> {
    return PROTOCOLS.map(p => {
      const apy = +(p.baseApy + rand(-3.5, 3.5)).toFixed(2)
      const utilization = +rand(0.38, 0.93).toFixed(2)
      return {
        ...p,
        apy,
        utilization,
        tvlChange: +rand(-5, 8).toFixed(2),
        riskScore: (utilization > 0.85 ? 'HIGH' : utilization > 0.65 ? 'MEDIUM' : 'LOW') as Market['riskScore'],
      }
    })
  }

  async sendTransaction(_tx: { to: string; data: string; value: string }): Promise<{
    hash: string; blockNumber: number; gasUsed: number
  }> {
    await new Promise(r => setTimeout(r, 300 + rand(100, 300)))
    return {
      hash: '0x' + randHex(64),
      blockNumber: this.blockNumber,
      gasUsed: Math.floor(rand(18000, 52000)),
    }
  }
}

export const somniaClient = new SomniaClient()
