import { Player } from '../../entities/player.entity';
import { IPlayerRepository } from '../../interfaces/player-repository.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class InMemoryPlayerRepository implements IPlayerRepository {
  private players: Player[] = [];

  async findAll(): Promise<Player[]> {
    return this.players;
  }

  async findOneById(id: number): Promise<Player | undefined> {
    return this.players.find((p) => p.id === id);
  }

  async findWithFilters(filters: {
    name?: string;
    club?: string;
    position?: string;
    page: number;
    limit: number;
  }): Promise<{ data: Player[]; total: number }> {
    let result = [...this.players];
    if (filters.name) {
      result = result.filter((p) =>
        p.name?.toLowerCase().includes(filters.name!.toLowerCase()),
      );
    }
    if (filters.club) {
      result = result.filter((p) =>
        p.club?.toLowerCase().includes(filters.club!.toLowerCase()),
      );
    }
    if (filters.position) {
      result = result.filter((p) =>
        p.position?.toLowerCase().includes(filters.position!.toLowerCase()),
      );
    }
    const offset = (filters.page - 1) * filters.limit;
    return {
      data: result.slice(offset, offset + filters.limit),
      total: result.length,
    };
  }

  async create(data: Partial<Player>): Promise<Player> {
    const newPlayer = { ...data, id: this.players.length + 1 } as Player;
    this.players.push(newPlayer);
    return newPlayer;
  }

  async update(id: number, data: Partial<Player>): Promise<Player | undefined> {
    const index = this.players.findIndex((p) => p.id === id);
    if (index === -1) return undefined;
    this.players[index] = { ...this.players[index], ...data };
    return this.players[index];
  }
}