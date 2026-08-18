import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  getHealth() {
    return {
      status: 'ok',
      service: 'ByteAgroX API Service',
      version: '0.1.0',
      timestamp: new Date().toISOString(),
      location: 'Hadejia, Jigawa State, Nigeria',
      environment: process.env.NODE_ENV || 'development',
    };
  }
}
