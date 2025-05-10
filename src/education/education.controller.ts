import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EducationService } from './education.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';

@Controller('education')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Post('create-education')
  create(@Body() createEducationDto: CreateEducationDto) {
    return this.educationService.create(createEducationDto);
  }

  @Get('liste-education')
  findAll() {
    return this.educationService.findAll();
  }

  @Get('education/:id')
  findOne(@Param('id') id: string) {
    return this.educationService.findOne(+id);
  }

  @Patch('update-education/:id')
  update(@Param('id') id: string, @Body() updateEducationDto: UpdateEducationDto) {
    return this.educationService.update(+id, updateEducationDto);
  }

  @Delete('delete-education/:id')
  remove(@Param('id') id: string) {
    return this.educationService.remove(+id);
  }
}
