import { Controller } from '@nestjs/common';
import { LivekitService } from './livekit.service';

@Controller('livekit')
export class LivekitController {
  public constructor(private readonly livekitService: LivekitService) {}
}
