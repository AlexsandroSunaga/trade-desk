import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { TradesController } from "./trades/trades.controller";
import { TradesService } from "./trades/trades.service";

@Module({
  controllers: [TradesController, AuthController],
  providers: [TradesService],
})
export class AppModule {}
