import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RecruteurService } from './recruteur.service';
import { CreateRecruteurDto } from './dto/create-recruteur.dto';
import { UpdateRecruteurDto } from './dto/update-recruteur.dto';

@Controller('recruteur')
export class RecruteurController {
  constructor(private readonly recruteurService: RecruteurService) {}

  @Post('create-recruteur')
  create(@Body() createRecruteurDto: CreateRecruteurDto) {
    return this.recruteurService.create(createRecruteurDto);
  }

  @Get('liste-recruteur')
  findAll() {
    return this.recruteurService.findAll();
  }

  @Get('recruteur/:id')
  findOne(@Param('id') id: string) {
    return this.recruteurService.findOne(+id);
  }

  @Patch('update-recruteur/:id')
  update(@Param('id') id: string, @Body() updateRecruteurDto: UpdateRecruteurDto) {
    return this.recruteurService.update(+id, updateRecruteurDto);
  }

  @Delete('delete-recruteur/:id')
  remove(@Param('id') id: string) {
    return this.recruteurService.remove(+id);
  }

  @Get('stats')
  async getStats() {
    return this.recruteurService.getDashboardStats();
  }
  @Get('poste-by-recruteur/:userId')
  findByRecruteur(@Param('userId') recruteurId: number) {
    return this.recruteurService.findPosteByCandidat(recruteurId);
  }
}
