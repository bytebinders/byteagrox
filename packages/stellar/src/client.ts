import { Horizon, Networks } from '@stellar/stellar-sdk';

export interface StellarConfig {
  horizonUrl: string;
  networkPassphrase: string;
  friendbotUrl: string;
}

export class StellarClient {
  private server: Horizon.Server;
  private networkPassphrase: string;
  private friendbotUrl: string;

  constructor(config?: Partial<StellarConfig>) {
    const horizonUrl =
      config?.horizonUrl ||
      process.env.STELLAR_HORIZON_URL ||
      'https://horizon-testnet.stellar.org';
    
    this.networkPassphrase =
      config?.networkPassphrase ||
      Networks.TESTNET;
      
    this.friendbotUrl =
      config?.friendbotUrl ||
      process.env.STELLAR_FRIENDBOT_URL ||
      'https://friendbot.stellar.org';

    this.server = new Horizon.Server(horizonUrl);
  }

  public getServer(): Horizon.Server {
    return this.server;
  }

  public getNetworkPassphrase(): string {
    return this.networkPassphrase;
  }

  public getFriendbotUrl(): string {
    return this.friendbotUrl;
  }

  /**
   * Health check to confirm Horizon testnet connectivity
   */
  public async checkHealth(): Promise<{ status: string; horizonUrl: string; network: string }> {
    try {
      const root = await this.server.root();
      return {
        status: 'OK',
        horizonUrl: this.server.serverURL.toString(),
        network: root.network_passphrase,
      };
    } catch (error) {
      return {
        status: 'ERROR',
        horizonUrl: this.server.serverURL.toString(),
        network: this.networkPassphrase,
      };
    }
  }
}
