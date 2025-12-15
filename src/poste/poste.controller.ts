import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { PosteService } from './poste.service';
import { CreatePosteDto } from './dto/create-poste.dto';
import { UpdatePosteDto } from './dto/update-poste.dto';
import { Poste } from './entities/poste.entity';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';

@Controller('poste')
export class PosteController {
  constructor(private readonly posteService: PosteService) {}

  // @Post('create-poste')
  // create(@Body() createPosteDto: Poste) {
  //   return this.posteService.create(createPosteDto);
  // }

   @UseGuards(JwtAuthGuard)
  @Post('create-poste')
  create(
    @Body() createPosteDto: CreatePosteDto,
    @Req() req: { user: { sub: number, role: string } }
  ) {
    return this.posteService.createPostWithRecruiter(createPosteDto, req.user.sub);
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
   @Get('postuler/:posteId/:idCV')
  postuler(
    @Param('posteId') posteId: number,
    @Param('idCV') idCV: number)
   {
    return this.posteService.postuler(+posteId, idCV);
  }
  @Get('top-resumes/:posteId')
async getTopResumes(
  @Param('posteId') posteId: number,recruiterId:number
) {
  return this.posteService.getTopResumeesForPoste(posteId,recruiterId);
}


}
