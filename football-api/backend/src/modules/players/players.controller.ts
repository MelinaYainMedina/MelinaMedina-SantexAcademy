import {
  Controller, Get, Post, Patch, Body,
  HttpCode, HttpStatus, NotFoundException,
  Param, ParseIntPipe, Query, UseGuards,
} from '@nestjs/common';
import { PlayersService } from './players.service';
import { PlayerDto } from './dto/player.dto';
import { JwtAuthGuard } from '../../autenticacion/jwt-auth.guard';
import { AiService } from '../../ai.service';

@UseGuards(JwtAuthGuard)
@Controller('api/players')
export class PlayersController {
  constructor(
    private readonly playersService: PlayersService,
    private readonly aiService: AiService,
  ) {}

  @Get()
  async getPlayers(
    @Query('name') name?: string,
    @Query('club') club?: string,
    @Query('position') position?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.playersService.getPlayers({
      name, club, position,
      page: page ? +page : 1,
      limit: limit ? +limit : 10,
    });
  }

  @Get(':id/history')
  async getPlayerHistory(@Param('id', ParseIntPipe) id: number) {
    const player = await this.playersService.getPlayerById(id);
    if (!player) throw new NotFoundException(`Player not found`);
    return this.playersService.getPlayerHistory(player.name);
  }

  @Get(':id/analysis')
  async getPlayerAnalysis(@Param('id', ParseIntPipe) id: number) {
    const player = await this.playersService.getPlayerById(id);
    if (!player) throw new NotFoundException(`Player not found`);
    const history = await this.playersService.getPlayerHistory(player.name);
    if (!history.length) return { analysis: 'No hay datos históricos suficientes para analizar.' };
    const analysis = await this.aiService.analizarEvolucion(player.name, history);
    return { analysis };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getPlayerById(@Param('id', ParseIntPipe) id: number) {
    const player = await this.playersService.getPlayerById(id);
    if (!player) throw new NotFoundException(`Player with ID ${id} not found.`);
    return player;
  }

  @Post()
  async createPlayer(@Body() body: Partial<PlayerDto>) {
    return this.playersService.createPlayer(body);
  }

  @Patch(':id')
  async updatePlayer(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Partial<PlayerDto>,
  ) {
    const updated = await this.playersService.updatePlayer(id, body);
    if (!updated) throw new NotFoundException(`Player with ID ${id} not found.`);
    return updated;
  }
}