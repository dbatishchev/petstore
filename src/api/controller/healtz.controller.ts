import { Controller, Get } from '@nestjs/common';

@Controller('healthz')
export class HealthzController {
  @Get()
  public async check(): Promise<string> {
    return 'Pong';
  }
}
