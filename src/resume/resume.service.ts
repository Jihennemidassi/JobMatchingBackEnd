import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Resume } from './entities/resume.entity';
import { Repository } from 'typeorm';
import { Express } from 'express';

import 'multer';
import * as pdfParse from 'pdf-parse';
import * as fs from 'fs';
import { Skill } from 'src/skills/entities/skill.entity';
import { CreateSkillDto } from 'src/skills/dto/create-skill.dto';
import { SkillMatching } from 'src/skills/entities/skillMatching';
import { ExperienceMatching } from 'src/experience/entities/experienceMatching';
import { Experience } from 'src/experience/entities/experience.entity';
import { CreateExperienceDto } from 'src/experience/dto/create-experience.dto';

@Injectable()
export class ResumeService {
  constructor(
    @InjectRepository(Experience)
private experienceRepository: Repository<Experience> ,
@InjectRepository(Skill)
private skillRepository: Repository<Skill> ,
    @InjectRepository(Resume)
    private resumeRepository:Repository<Resume>,
    @InjectRepository(ExperienceMatching)
    private readonly experienceMatchingRepository: Repository<ExperienceMatching>,
    @InjectRepository(SkillMatching)
    private readonly skillMatchingRepository: Repository<SkillMatching>){}
     

  create(createResumeDto: CreateResumeDto) {
    let resume = this.resumeRepository.create(createResumeDto);
    return this.resumeRepository.save(resume) ;
  }

  findAll() {
    return this.resumeRepository.findAndCount();
  }

  findOne(id: number) {
    return this.resumeRepository.findOne({where:{id:id}});
  }

  async update(id: number, updateResumeDto: UpdateResumeDto) {
    const resume = await this.resumeRepository.preload({
      id: +id,
      ...updateResumeDto
    });
    if (!resume) throw new NotFoundException('Resume not found');
    return this.resumeRepository.save(resume);
  }

  remove(id: number) {
    return this.resumeRepository.delete(id);
  }
  private readonly allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'text/plain'
  ];

  async handleUploadedFile({ file }: { file: Express.Multer.File }) {
    console.log("file", file);
    if (!this.allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${this.allowedTypes.join(', ')}`
      );
    }

    const data = await pdfParse(file.buffer);
    const text = data.text;

    // Extract the title (first line of the text)
    const title = text.split('\n')[2]?.trim() || null;

    // Extract the summary (assume it's the section after "Summary")
    const summaryMatch = text.match(/Summary\s*([\s\S]*?)(?=\n[A-Z]|$)/);
    const description = summaryMatch ? summaryMatch[1].trim() : null;

    console.log("Extracted Title:", title);
    console.log("Extracted Summary:", description);

    // Extract skills
    const skillsMatch = text.match(/Skills\s*([\s\S]*?)(?=\n[A-Z]|$)/);
    const skills = skillsMatch
      ? skillsMatch[1]
          .replace(/\s+/g, ' ')
          .split(/[,;\n]+/)
          .map(skill => skill.trim())
          .filter(skill => skill)
      : [];

    // Extract experience (similar pattern to skills)
    const experienceMatch = text.match(/Experience\s*([\s\S]*?)(?=\n[A-Z]|$)/);
    const experience = experienceMatch
      ? experienceMatch[1]
          .replace(/\s+/g, ' ')
          .split(/[,;\n]+/)
          .map(experience => experience.trim())
          .filter(experience => experience)
      : [];

    // Save the resume in the database
    const resume = this.resumeRepository.create({
      title,
      description,
    });
    const savedResume = await this.resumeRepository.save(resume);

    // Process and save skills
    const skillsMatching: SkillMatching[] = [];
    for (const skill of skills) {
      const skillDto = new CreateSkillDto();
      skillDto.title = skill;
      skillDto.description = skill;
      const skillEntity = await this.skillRepository.save(
        this.skillRepository.create(skillDto)
      );

      const skillMatching = new SkillMatching();
      skillMatching.idSkill = skillEntity.id;
      skillMatching.idResume = savedResume.id;
      const savedSkillMatching = await this.skillMatchingRepository.save(
        this.skillMatchingRepository.create(skillMatching)
      );
      skillsMatching.push(savedSkillMatching);
    }

    // Process and save experience (same pattern as skills)
    const experienceMatching: ExperienceMatching[] = [];
    for (const exp of experience) {
      const experienceDto = new CreateExperienceDto();
      experienceDto.title = exp;
      experienceDto.description = exp;
      const experienceEntity = await this.experienceRepository.save(
        this.experienceRepository.create(experienceDto)
      );

      const expMatching = new ExperienceMatching();
      expMatching.idExperience = experienceEntity.id;
      expMatching.idResume = savedResume.id;
      const savedExpMatching = await this.experienceMatchingRepository.save(
        this.experienceMatchingRepository.create(expMatching)
      );
      experienceMatching.push(savedExpMatching);
    }

    return {
      title,
      description,
      skills,
      experience,
      resumeId: savedResume.id,
    };
  }
}
