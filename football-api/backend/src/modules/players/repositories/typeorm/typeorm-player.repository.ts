import { Player } from '../../entities/player.entity';
import { IPlayerRepository } from '../../interfaces/player-repository.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TypeOrmPlayerRepository implements IPlayerRepository {
  async findAll(): Promise<Player[]> {
    return [];
  }

  async findOneById(id: number): Promise<Player | undefined> {
    return undefined;
  }

  async findWithFilters(filters: {
    name?: string;
    club?: string;
    position?: string;
    page: number;
    limit: number;
  }): Promise<{ data: Player[]; total: number }> {
    return { data: [], total: 0 };
  }

  async create(data: Partial<Player>): Promise<Player> {
    return data as Player;
  }

  async update(id: number, data: Partial<Player>): Promise<Player | undefined> {
    return undefined;
  }

  async findHistory(name: string): Promise<any[]> {
  return [];
}
}