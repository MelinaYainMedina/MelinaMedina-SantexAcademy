import { Inject, Injectable } from '@nestjs/common';
import { IPlayerRepository } from './interfaces/player-repository.interface';
import { Player } from './entities/player.entity';

@Injectable()
export class PlayersService {
  constructor(
    @Inject('IPlayerRepository')
    private readonly playerRepository: IPlayerRepository,
  ) {}

  getPlayerById(id: number): Promise<Player | undefined> {
    return this.playerRepository.findOneById(id);
  }

  getPlayers(filters: {
    name?: string;
    club?: string;
    position?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: Player[]; total: number }> {
    return this.playerRepository.findWithFilters({
      ...filters,
      page: filters.page || 1,
      limit: filters.limit || 10,
    });
  }

  createPlayer(data: Partial<Player>): Promise<Player> {
    return this.playerRepository.create(data);
  }

  updatePlayer(id: number, data: Partial<Player>): Promise<Player | undefined> {
    return this.playerRepository.update(id, data);
  
  }

  getPlayerHistory(name: string): Promise<any[]> {
  return this.playerRepository.findHistory(name);
}
}