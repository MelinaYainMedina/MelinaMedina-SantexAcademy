import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
import { PlayerModel } from './repositories/sequelize/player.model';
import { SequelizePlayerRepository } from './repositories/sequelize/sequelize-player.repository';
import { AiService } from '../../ai.service';

@Module({
  imports: [SequelizeModule.forFeature([PlayerModel])],
  controllers: [PlayersController],
  providers: [
    PlayersService,
    AiService,
    {
      provide: 'IPlayerRepository',
      useClass: SequelizePlayerRepository,
    },
  ],
})
export class PlayersModule {}