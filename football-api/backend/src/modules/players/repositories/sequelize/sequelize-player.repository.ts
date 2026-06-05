import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { PlayerModel } from './player.model';
import { IPlayerRepository } from '../../interfaces/player-repository.interface';
import { Player } from '../../entities/player.entity';

@Injectable()
export class SequelizePlayerRepository implements IPlayerRepository {
  constructor(
    @InjectModel(PlayerModel)
    private readonly playerModel: typeof PlayerModel,
  ) {}

  async findAll(): Promise<Player[]> {
    const playerList = await this.playerModel.findAll();
    return playerList.map((x) => this.mapToEntity(x));
  }

  async findOneById(id: number): Promise<Player | undefined> {
    const model = await this.playerModel.findByPk(id);
    if (!model) return undefined;
    return this.mapToEntity(model);
  }

  async findWithFilters(filters: {
    name?: string;
    club?: string;
    position?: string;
    page: number;
    limit: number;
  }): Promise<{ data: Player[]; total: number }> {
    const where: any = {};
    if (filters.name) {
      where.longName = { [Op.like]: `%${filters.name}%` };
    }
    if (filters.club) {
      where.clubName = { [Op.like]: `%${filters.club}%` };
    }
    if (filters.position) {
      where.playerPositions = { [Op.like]: `%${filters.position}%` };
    }
    const offset = (filters.page - 1) * filters.limit;
    const { rows, count } = await this.playerModel.findAndCountAll({
      where,
      limit: filters.limit,
      offset,
    });
    return {
      data: rows.map((x) => this.mapToEntity(x)),
      total: count,
    };
  }

  async create(data: Partial<Player>): Promise<Player> {
  const model = await this.playerModel.create({
    longName: data.name,
    clubName: data.club,
    playerPositions: data.position,
    nationalityName: data.nationality,
    overall: data.rating,
    pace: data.speed ?? 0,
    shooting: data.shooting ?? 0,
    passing: data.passing ?? 0,
    dribbling: data.dribbling ?? 0,
    defending: data.defending ?? 0,
    physic: data.physic ?? 0,
    fifaVersion: '23',
    fifaUpdate: '1',
    playerFaceUrl: '',
    potential: data.rating ?? 50,
    age: 25,
  } as any);
  return this.mapToEntity(model);
}

  async update(id: number, data: Partial<Player>): Promise<Player | undefined> {
  const model = await this.playerModel.findByPk(id);
  if (!model) return undefined;
  
  const mapped: any = {};
  if (data.name !== undefined) mapped.longName = data.name;
  if (data.club !== undefined) mapped.clubName = data.club;
  if (data.position !== undefined) mapped.playerPositions = data.position;
  if (data.nationality !== undefined) mapped.nationalityName = data.nationality;
  if (data.rating !== undefined) mapped.overall = data.rating;
  if (data.speed !== undefined) mapped.pace = data.speed;
  if (data.shooting !== undefined) mapped.shooting = data.shooting;
  if (data.passing !== undefined) mapped.passing = data.passing;
  if (data.dribbling !== undefined) mapped.dribbling = data.dribbling;
  if (data.defending !== undefined) mapped.defending = data.defending;
  if (data.physic !== undefined) mapped.physic = data.physic;

  await model.update(mapped);
  return this.mapToEntity(model);
  }

  private mapToEntity(model: PlayerModel): Player {
    if (!model) throw new Error('Attempted to map null model to Player entity');
    const player = new Player();
    player.id = model.id;
    player.name = model.longName;
    player.club = model.clubName || 'Unknown Club';
    player.position = model.playerPositions?.split(',')[0].trim() ?? 'Unknown';
    player.nationality = model.nationalityName || 'Unknown Nationality';
    player.rating = model.overall;
    player.speed = model.pace ?? 0;
    player.shooting = model.shooting ?? 0;
    player.dribbling = model.dribbling ?? 0;
    player.passing = model.passing ?? 0;
    player.defending = model.defending ?? 0;
    player.physic = model.physic ?? 0;
    return player;
  }

  async findHistory(name: string): Promise<any[]> {
  const results = await this.playerModel.findAll({
    where: { longName: { [Op.like]: `%${name}%` } },
    attributes: ['fifaVersion', 'pace', 'shooting', 'passing', 'dribbling', 'defending', 'physic', 'overall'],
    order: [['fifaVersion', 'ASC']],
  });
  return results.map(r => ({
    year: r.fifaVersion,
    pace: r.pace ?? 0,
    shooting: r.shooting ?? 0,
    passing: r.passing ?? 0,
    dribbling: r.dribbling ?? 0,
    defending: r.defending ?? 0,
    physic: r.physic ?? 0,
    overall: r.overall ?? 0,
  }));
}
}