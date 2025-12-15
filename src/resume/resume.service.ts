import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Resume } from './entities/resume.entity';
import { In, Repository } from 'typeorm';
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
import { Candidat } from 'src/candidat/entities/candidat.entity';

@Injectable()
export class ResumeService {
  handleSimpleUpload(file: Express.Multer.File) {
    throw new Error('Method not implemented.');
  }
  
   private readonly COMMON_SKILLS = [
    // Programming Languages
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'PHP', 'Ruby', 'Go', 'Swift', 'Kotlin',
    // Frontend
    'React', 'Angular', 'Vue', 'Svelte', 'HTML', 'CSS', 'SCSS', 'Tailwind', 'Bootstrap',
    // Backend
    'Node.js', 'Express', 'NestJS', 'Django', 'Flask', 'Spring', 'Laravel', 'Ruby on Rails',
    // Databases
    'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle',
    // DevOps
    'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'CI/CD', 'Git', 'Jenkins', 'Terraform',
  ];

  private readonly NON_SKILL_WORDS = new Set([
    'and', 'or', 'with', 'using', 'via', 'basic', 'intermediate', 'advanced',
    'knowledge', 'experience', 'skills', 'etc', 'including', 'such as'
  ]);
  constructor(
    @InjectRepository(Experience)
private experienceRepository: Repository<Experience> ,
 @InjectRepository(Candidat)
private candidatRepository: Repository<Candidat> ,
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
    return this.resumeRepository.findOne({where:{idCV:id}});
  }

  async update(id: number, updateResumeDto: UpdateResumeDto) {
    const resume = await this.resumeRepository.preload({
      idCV: +id,
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

  // resume.service.ts (backend)
async uploadFile(file: Express.Multer.File) {
  // Basic validation
  if (!file.buffer) {
    throw new BadRequestException('Invalid file');
  }

  // Simple save operation
  return this.resumeRepository.save({
   // Set a default or implement proper storage
    createAt: new Date(),
    isActive: true,
  });
}

async handleUploadWithUser(file: Express.Multer.File, userId: number) {
  // 1. Find candidate
  const candidat = await this.candidatRepository.findOne({
    where: { user: { id: userId } },
    relations: ['user']
  });

  if (!candidat) {
    throw new NotFoundException('Candidate profile not found for this user');
  }

  // 2. Validate PDF
  if (file.mimetype !== 'application/pdf') {
    throw new BadRequestException('Only PDF files are allowed');
  }

  // 3. Parse PDF text
  const data = await pdfParse(file.buffer);
  const text = data.text;
  const lines = text.split('\n').filter(line => line.trim().length > 0);

  // 4. Extract title and description
  const titreCV = lines.length > 0 ? lines[0].trim() : 'Untitled';
 const descriptionCV = lines.length > 1 ? lines[1].trim() : 'No description';

  // 5. Store file
  const uploadDir = './uploads/resumes';
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const uniqueFilename = `${userId}-${Date.now()}-${file.originalname}`;
  const filePath = `${uploadDir}/${uniqueFilename}`;
  await fs.promises.writeFile(filePath, file.buffer); // Use async version

  // 6. Create resume
  const resume = await this.resumeRepository.save({
    titreCV,
    descriptionCV,
    candidat: { id: candidat.id },
    createdAt: new Date()
  });

  // 7. Process and store skills
  const extractedSkills = this.extractSkills(text);
  
  // Get or create skills in database
  const skillsToSave = extractedSkills.map(skillName => ({
    titreSkill: this.normalizeSkillName(skillName),
    createAt: new Date()
  }));
    console.log('skillsToSave!!!!!!!!!!!!',skillsToSave)


  // Upsert skills (insert if they don't exist)
  await this.skillRepository.createQueryBuilder()
    .insert()
    .into(Skill)
    .values(skillsToSave)
    .orIgnore() // Skip if skill already exists
    .execute();

  // Get IDs of all extracted skills
  const skillsInDb = await this.skillRepository.find({
    where: { titreSkill: In(extractedSkills.map(s => this.normalizeSkillName(s))) }
  });

  // Create skill matching records
  if (skillsInDb.length > 0) {
    await this.skillMatchingRepository.save(
      skillsInDb.map(skill => ({
        idCV: resume.idCV,
        idSkill: skill.idSkill,
        createAt: new Date()
      }))
    );
  }

 const yearsOfExperience = this.extractYearsOfExperience(text);
    console.log('Years of experience extracted:', yearsOfExperience);

    if (yearsOfExperience > 0) {
      // Create or find experience record
      let experience = await this.experienceRepository.findOne({
        where: { nbExperience: yearsOfExperience }
      });

      if (!experience) {
        experience = await this.experienceRepository.save({
          nbExperience: yearsOfExperience
        });
      }

      // Create experience matching record
      await this.experienceMatchingRepository.save({
        idCV: resume.idCV,
        idExperience: experience.idExperience,
        nbExperience: yearsOfExperience
      });
    }

    return resume;
  }

async findResumesByPoste(posteId: number) {
  return this.resumeRepository
    .createQueryBuilder('resume')
    .innerJoin('resume.poste', 'poste', 'poste.idPoste = :posteId', { posteId })
    .getMany();
}
  

  private extractYearsOfExperience(text: string): number {
    // Look for explicit experience mentions like "8+ ans d'expérience" or "5+ years"
    const experiencePatterns = [
      /(\d+)\+?\s*(?:ans?\s*d[''']expérience|years?\s*(?:of\s*)?experience)/i,
      /expérience[^.]*?(\d+)\+?\s*ans?/i,
      /(\d+)\+?\s*years?\s*experienced?/i,
      /avec\s*(\d+)\+?\s*ans?\s*d[''']expérience/i
    ];

    for (const pattern of experiencePatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const years = parseInt(match[1], 10);
        if (years > 0 && years <= 50) { // Reasonable range
          return years;
        }
      }
    }

    // If no explicit mention, calculate from work experience dates
    return this.calculateExperienceFromDates(text);
  }

  private calculateExperienceFromDates(text: string): number {
    // Look for date patterns in experience sections
    const datePatterns = [
      // French formats: 03/2020 – Aujourd'hui, 2021 – Présent
      /(\d{2}\/\d{4}|\d{4})\s*[–-]\s*(?:Aujourd'hui|Présent|Present|Now)/gi,
      // Date ranges: 2019 – 2021, 05/2017 – 02/2020
      /(\d{2}\/\d{4}|\d{4})\s*[–-]\s*(\d{2}\/\d{4}|\d{4})/g
    ];

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    let totalMonths = 0;

    // Find current positions (still working)
    const currentPositionPattern = /(\d{2}\/\d{4}|\d{4})\s*[–-]\s*(?:Aujourd'hui|Présent|Present|Now)/gi;
    let match;
    
    while ((match = currentPositionPattern.exec(text)) !== null) {
      const startDate = this.parseDate(match[1]);
      if (startDate) {
        const monthsWorked = (currentYear - startDate.year) * 12 + (currentMonth - startDate.month);
        totalMonths += Math.max(0, monthsWorked);
      }
    }

    // Find past positions with end dates
    const pastPositionPattern = /(\d{2}\/\d{4}|\d{4})\s*[–-]\s*(\d{2}\/\d{4}|\d{4})/g;
    
    while ((match = pastPositionPattern.exec(text)) !== null) {
      const startDate = this.parseDate(match[1]);
      const endDate = this.parseDate(match[2]);
      
      if (startDate && endDate) {
        const monthsWorked = (endDate.year - startDate.year) * 12 + (endDate.month - startDate.month);
        totalMonths += Math.max(0, monthsWorked);
      }
    }

    // Convert months to years (rounded)
    return Math.round(totalMonths / 12);
  }

  private parseDate(dateStr: string): { year: number; month: number } | null {
    // Handle formats like "03/2020" or "2020"
    if (dateStr.includes('/')) {
      const [month, year] = dateStr.split('/');
      return {
        year: parseInt(year, 10),
        month: parseInt(month, 10)
      };
    } else {
      // Just year format
      return {
        year: parseInt(dateStr, 10),
        month: 1 // Default to January
      };
    }
  }
//   async findResumesByPoste(posteId: number) {
//   return this.resumeRepository
//     .createQueryBuilder('resume')
//     .innerJoin('idCV.idPoste', 'idPoste', 'poste.id = :posteId', { posteId })
//     .getMany();
// }

   private extractSkills(text: string): string[] {
  // First try to find the skills section more precisely
  const skillSections = this.findSkillSections(text);
  const extractedSkills = new Set<string>();

  for (const section of skillSections) {
    // Extract skills using multiple methods
    this.extractSkillsFromSection(section, extractedSkills);
  }

  // Also look for skills mentioned elsewhere in the resume
  this.findSkillsInContext(text, extractedSkills);

  return Array.from(extractedSkills).filter(Boolean);
}

private findSkillSections(text: string): string[] {
  const sectionPatterns = [
    // Common section headers
    /(?:technique\s*)?skills?\s*[\n:-]*\s*([^]+?)(?=\n\s*\n|\n[A-Z][a-z]+:|$)/i,
    /(?:competencies|expertise)\s*[\n:-]*\s*([^]+?)(?=\n\s*\n|\n[A-Z][a-z]+:|$)/i,
    /(?:languages|frameworks|tools|technologies)\s*[\n:-]*\s*([^]+?)(?=\n\s*\n|\n[A-Z][a-z]+:|$)/i,
    /proficient in\s*([^]+?)(?=\n|\.|$)/i,
  ];

  const sections: string[] = [];
  for (const pattern of sectionPatterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      sections.push(match[1].trim());
    }
  }
  return sections;
}

private extractSkillsFromSection(sectionText: string, skillsSet: Set<string>) {
  // Split by various delimiters
  const potentialSkills = sectionText.split(/[,;•·–•\n]\s*/);

  for (let skill of potentialSkills) {
    skill = skill
      .trim()
      .replace(/^\W+|\W+$/g, '') // Remove surrounding non-word chars
      .replace(/\s+/g, ' ');     // Normalize spaces

    // Skip empty or very short items
    if (!skill || skill.length < 2 || /^\d+$/.test(skill)) continue;

    // Check if it's a known skill
    if (this.isValidSkill(skill)) {
      skillsSet.add(this.normalizeSkillName(skill));
      continue;
    }

    // Handle compound skills (e.g., "React & Node.js")
    const compoundSkills = skill.split(/[&\+\/]/).map(s => s.trim());
    if (compoundSkills.length > 1) {
      compoundSkills.forEach(s => {
        if (this.isValidSkill(s)) {
          skillsSet.add(this.normalizeSkillName(s));
        }
      });
    }
  }
}

private findSkillsInContext(text: string, skillsSet: Set<string>) {
  // Look for skills mentioned in experience or project sections
  const sentences = text.split(/[.!?]\s+/);

  for (const sentence of sentences) {
    // Skip very short sentences
    if (sentence.length < 20) continue;

    // Check for skills mentioned in context
    this.COMMON_SKILLS.forEach(skill => {
      const regex = new RegExp(`\\b${skill}\\b`, 'i');
      if (regex.test(sentence)) {
        skillsSet.add(this.normalizeSkillName(skill));
      }
    });
  }
}

private isValidSkill(text: string): boolean {
  if (!text || text.length < 2) return false;
  
  const lowerText = text.toLowerCase();
  
  // Skip common non-skill words
  if (this.NON_SKILL_WORDS.has(lowerText)) return false;
  
  // Check against known skills (case insensitive)
  return this.COMMON_SKILLS.some(
    skill => skill.toLowerCase() === lowerText
  );
}

private normalizeSkillName(skill: string): string {
  // Return the canonical version from COMMON_SKILLS
  const found = this.COMMON_SKILLS.find(
    s => s.toLowerCase() === skill.toLowerCase()
  );
  return found || skill;
}
// In resume.service.ts (backend)
// In resume.service.ts (backend)
// In resume.service.ts (backend)






async getListResume() {
  return this.resumeRepository.find({
    relations: ['idExperience'], // This loads the relation
    select: {
      idCV: true,
      titreCV: true,
      // Remove the experience select since we're using relations
      // experiences will be fully loaded due to the relations option
    }
  });
}
findResumeByCandidat(userId: number) {
  return this.resumeRepository.findOne({
     where: { 
      candidat: { 
        user: { id: userId }  // Navigate through relations: Resume -> Candidat -> User
      } 
    },
    relations: ['candidat', 'candidat.user']  // Must load these relations
  });
  }}
