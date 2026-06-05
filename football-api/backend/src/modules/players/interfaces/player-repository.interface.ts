import { Player } from '../entities/player.entity';

export interface IPlayerRepository {
  findAll(): Promise<Player[]>;
  findOneById(id: number): Promise<Player | undefined>;
  findWithFilters(filters: {
    name?: string;
    club?: string;
    position?: string;
    page: number;
    limit: number;
  }): Promise<{ data: Player[]; total: number }>;
  create(data: Partial<Player>): Promise<Player>;
  update(id: number, data: Partial<Player>): Promise<Player | undefined>;

  findHistory(name: string): Promise<any[]>;
}