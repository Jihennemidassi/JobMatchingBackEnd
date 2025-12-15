// import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Request, Req, UseGuards, BadRequestException } from '@nestjs/common';
// import { ResumeService } from './resume.service';
// import { CreateResumeDto } from './dto/create-resume.dto';
// import { UpdateResumeDto } from './dto/update-resume.dto';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';


// @Controller('resume')
// export class ResumeController {
//   constructor(private readonly resumeService: ResumeService) {}

//   @Post('create-resume')
//   create(@Body() createResumeDto: CreateResumeDto) {
//     return this.resumeService.create(createResumeDto);
//   }
//   @UseGuards(JwtAuthGuard)
//   @Post('upload-resume')
// @UseInterceptors(FileInterceptor('resume'))
// async uploadFile(@UploadedFile() file: Express.Multer.File,
//  @Req() req: { user: { sub: number } }
// ) {

//   if (!file) {
//     throw new BadRequestException('No file uploaded');
//   }
  
//   return this.resumeService.handleUploadWithUser(file, req.user.sub);


    
//     // if (!file) {
//     //   throw new BadRequestException('No file uploaded');
//     // }

//     // try {
//     //   // Process the file here
//     //   return { 
//     //     success: true,
//     //     filename: file.originalname,
//     //     size: file.size
//     //   };
//     // } catch (error) {
//     //   console.error('File processing error:', error);
//     //   throw new InternalServerErrorException('File processing failed');
//     // }
//   }

//   @Get('liste-resume')
//   findAll() {
//     return this.resumeService.findAll();
//   }

//   @Get('resume/:id')
//   findOne(@Param('id') id: string) {
//     return this.resumeService.findOne(+id);
//   }

//   @Get('resume-poste/:posteId')
// findForPoste(@Param('posteId') posteId: string) {
//   return this.resumeService.findResumesByPoste(+posteId);
// }

//   @Patch('update-resume/:id')
//   update(@Param('id') id: string, @Body() updateResumeDto: UpdateResumeDto) {
//     return this.resumeService.update(+id, updateResumeDto);
//   }

//   @Delete('delete-reume/:id')
//   remove(@Param('id') id: string) {
//     return this.resumeService.remove(+id);
//   }
// }
// import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, Req, BadRequestException } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { ResumeService } from './resume.service';
// import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';

// @Controller('resume')
// export class ResumeController {
//   constructor(private readonly resumeService: ResumeService) {}

//   @Post('upload')
//   @UseGuards(JwtAuthGuard)
//   @UseInterceptors(FileInterceptor('file'))  // 'file' must match FormData field name
//   async uploadResume(
//     @UploadedFile() file: Express.Multer.File,
//     @Req() req: { user: { sub: number } }
//   ) {
//     if (!file) {
//       throw new BadRequestException('No file provided');
//     }
//     return this.resumeService.handleUpload(file, req.user.sub);
//   }
// }

import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Req, UseGuards, BadRequestException } from '@nestjs/common';
import { ResumeService } from './resume.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { CandidatService } from 'src/candidat/candidat.service';

@Controller('resume')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService , private readonly candidateService:CandidatService) {}

  @Post('create-resume')
  create(@Body() createResumeDto: CreateResumeDto) {
    return this.resumeService.create(createResumeDto);
  }

  @UseGuards(JwtAuthGuard)
@Post('upload-resume')
@UseInterceptors(FileInterceptor('file'))  // Changed to 'file'
async uploadResume(
  @UploadedFile() file: Express.Multer.File,
  @Req() req: any  // Temporarily use 'any' to debug
) {
  console.log(req.user); // Check ACTUAL JWT structure
  return this.resumeService.handleUploadWithUser(file, req.user.sub);
}



  @Get('liste-resume')
  findAll() {
    return this.resumeService.findAll();
  }

  @Get('resume/:id')
  findOne(@Param('id') id: string) {
    return this.resumeService.findOne(+id);
  }

  @Get('resume-poste/:posteId')
  findForPoste(@Param('posteId') posteId: string) {
    return this.resumeService.findResumesByPoste(+posteId);
  }

  @Patch('update-resume/:id')
  update(@Param('id') id: string, @Body() updateResumeDto: UpdateResumeDto) {
    return this.resumeService.update(+id, updateResumeDto);
  }

  @Delete('delete-resume/:id') // Fixed typo in endpoint (was 'delete-reume')
  remove(@Param('id') id: string) {
    return this.resumeService.remove(+id);
  }
  @Get('resume-by-candidat/:userId')
  findByCandidat(@Param('userId') candidatId: number) {
    return this.resumeService.findResumeByCandidat(candidatId);
  }

  //   @Post('upload')
  // @UseGuards(JwtAuthGuard)
  // @UseInterceptors(FileInterceptor('file'))  // 'file' must match FormData field name
  // async handleUploadWithUser(
  //   @UploadedFile() file: Express.Multer.File,
  //   @Req() req: { user: { sub: number } }
  // ) {
  //   if (!file) {
  //     throw new BadRequestException('No file provided');
  //   }
  //   return this.resumeService.handleUploadWithUser(file, req.user.sub);
  // }
}