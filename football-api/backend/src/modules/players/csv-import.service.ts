import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { IPlayerRepository } from './interfaces/player-repository.interface';
import * as csv from 'csv-parser';
import { Readable } from 'stream';

@Injectable()
export class CsvImportService {
  constructor(
    @Inject('IPlayerRepository')
    private readonly playerRepository: IPlayerRepository,
  ) {}

  async importFromBuffer(buffer: Buffer): Promise<{ imported: number; errors: number }> {
    return new Promise((resolve, reject) => {
      const results: any[] = [];
      const stream = Readable.from(buffer);

      stream
        .pipe(csv())
        .on('data', (row) => results.push(row))
        .on('end', async () => {
          let imported = 0;
          let errors = 0;

          for (const row of results) {
            try {
              await this.playerRepository.create({
                name: row.long_name || row.name || row.Name,
                club: row.club_name || row.club || row.Club,
                position: row.player_positions || row.position || row.Position,
                nationality: row.nationality_name || row.nationality || row.Nationality,
                rating: parseInt(row.overall || row.rating || row.Rating) || 50,
                speed: parseInt(row.pace || row.speed || '0') || 0,
                shooting: parseInt(row.shooting || '0') || 0,
                passing: parseInt(row.passing || '0') || 0,
                dribbling: parseInt(row.dribbling || '0') || 0,
                defending: parseInt(row.defending || '0') || 0,
                physic: parseInt(row.physic || '0') || 0,
              });
              imported++;
            } catch (e) {
              errors++;
            }
          }
          resolve({ imported, errors });
        })
        .on('error', reject);
    });
  }
}