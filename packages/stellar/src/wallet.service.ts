import { Keypair } from '@stellar/stellar-sdk';
import { STELLAR_PUBLIC_KEY_REGEX } from '@byteagrox/validation';
import { StellarClient } from './client';

export class WalletService {
  constructor(private client: StellarClient = new StellarClient()) {}

  /**
   * Generates a new Stellar Keypair for Testnet background settlement
   */
  public createTestnetKeypair(): { publicKey: string; secretKey: string } {
    const keypair = Keypair.random();
    return {
      publicKey: keypair.publicKey(),
      secretKey: keypair.secret(),
    };
  }

  /**
   * Validate Stellar public key syntax
   */
  public isValidPublicKey(publicKey: string): boolean {
    return STELLAR_PUBLIC_KEY_REGEX.test(publicKey);
  }

  /**
   * Request Testnet Friendbot funding for a newly generated address
   */
  public async fundTestnetAccount(publicKey: string): Promise<boolean> {
    if (!this.isValidPublicKey(publicKey)) {
      throw new Error(`Invalid public key: ${publicKey}`);
    }

    try {
      const response = await fetch(`${this.client.getFriendbotUrl()}?addr=${encodeURIComponent(publicKey)}`);
      return response.ok;
    } catch (error) {
      console.error('Failed to fund account via Friendbot:', error);
      return false;
    }
  }
}
