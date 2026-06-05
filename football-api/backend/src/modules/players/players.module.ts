/*import { Module } from '@nestjs/common';
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
export class PlayersModule {}*/

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MulterModule } from '@nestjs/platform-express';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
import { PlayerModel } from './repositories/sequelize/player.model';
import { SequelizePlayerRepository } from './repositories/sequelize/sequelize-player.repository';
import { AiService } from '../../ai.service';
import { CsvImportService } from './csv-import.service';

@Module({
  imports: [
    SequelizeModule.forFeature([PlayerModel]),
    MulterModule.register({ dest: './uploads' }),
  ],
  controllers: [PlayersController],
  providers: [
    PlayersService,
    AiService,
    CsvImportService,
    {
      provide: 'IPlayerRepository',
      useClass: SequelizePlayerRepository,
    },
  ],
})
export class PlayersModule {}