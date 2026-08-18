import { StellarClient } from './client';

export class TransactionService {
  constructor(private client: StellarClient = new StellarClient()) {}

  /**
   * Monitor transaction status on Horizon testnet
   */
  public async getTransactionStatus(txHash: string): Promise<{ hash: string; status: 'SUCCESS' | 'NOT_FOUND' }> {
    try {
      await this.client.getServer().transactions().transaction(txHash).call();
      return { hash: txHash, status: 'SUCCESS' };
    } catch {
      return { hash: txHash, status: 'NOT_FOUND' };
    }
  }
}
