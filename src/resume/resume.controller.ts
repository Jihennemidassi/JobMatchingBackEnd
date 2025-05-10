import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ResumeService } from './resume.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { FileInterceptor } from '@nestjs/platform-express';


@Controller('resume')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Post('create-resume')
  create(@Body() createResumeDto: CreateResumeDto) {
    return this.resumeService.create(createResumeDto);
  }
  @Post('upload-resume')
  @UseInterceptors(FileInterceptor('resume')) // Must match FormData field name
  async uploadFile(@UploadedFile() file : Express.Multer.File ) {
    console.log("file!!!!!!!!!!!!",file)

    return this.resumeService.handleUploadedFile( { file })
    
    // if (!file) {
    //   throw new BadRequestException('No file uploaded');
    // }

    // try {
    //   // Process the file here
    //   return { 
    //     success: true,
    //     filename: file.originalname,
    //     size: file.size
    //   };
    // } catch (error) {
    //   console.error('File processing error:', error);
    //   throw new InternalServerErrorException('File processing failed');
    // }
  }

  @Get('liste-resume')
  findAll() {
    return this.resumeService.findAll();
  }

  @Get('resume/:id')
  findOne(@Param('id') id: string) {
    return this.resumeService.findOne(+id);
  }

  @Patch('update-resume/:id')
  update(@Param('id') id: string, @Body() updateResumeDto: UpdateResumeDto) {
    return this.resumeService.update(+id, updateResumeDto);
  }

  @Delete('delete-reume/:id')
  remove(@Param('id') id: string) {
    return this.resumeService.remove(+id);
  }
}
