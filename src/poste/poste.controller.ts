import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PosteService } from './poste.service';
import { CreatePosteDto } from './dto/create-poste.dto';
import { UpdatePosteDto } from './dto/update-poste.dto';
import { Poste } from './entities/poste.entity';

@Controller('poste')
export class PosteController {
  constructor(private readonly posteService: PosteService) {}

  @Post('create-poste')
  create(@Body() createPosteDto: Poste) {
    return this.posteService.create(createPosteDto);
  }

  @Get('liste-poste')
  findAll() {
    return this.posteService.findAll();
  }

  @Get('poste/:id')
  findOne(@Param('id') id: string) {
    return this.posteService.findOne(+id);
  }

  @Patch('update-poste/:id')
  update(@Param('id') id: string, @Body() updatePosteDto: UpdatePosteDto) {
    return this.posteService.update(+id, updatePosteDto);
  }

  @Delete('delete-poste/:id')
  remove(@Param('id') id: string) {
    return this.posteService.remove(+id);
  }
}
