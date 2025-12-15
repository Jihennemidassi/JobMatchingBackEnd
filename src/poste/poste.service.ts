import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePosteDto } from './dto/create-poste.dto';
import { UpdatePosteDto } from './dto/update-poste.dto';
import { Poste } from './entities/poste.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Skill } from 'src/skills/entities/skill.entity';
import { SkillMatching } from 'src/skills/entities/skillMatching';
import { ExperienceMatching } from 'src/experience/entities/experienceMatching';
import { Experience } from 'src/experience/entities/experience.entity';
import { Resume } from 'src/resume/entities/resume.entity';
import { Recruteur } from 'src/recruteur/entities/recruteur.entity';

@Injectable()
export class PosteService {
  constructor(
    @InjectRepository(Poste)
    private posteRepository: Repository<Poste>,
    @InjectRepository(SkillMatching)
    private readonly skillMatchingRepository: Repository<SkillMatching>,
    @InjectRepository(ExperienceMatching)
    private readonly experienceMatchingRepository: Repository<ExperienceMatching>,
    @InjectRepository(Experience)
  private readonly ExperienceRepository: Repository<Experience>,
    @InjectRepository(Resume)
    private ResumeRepository: Repository<Resume>,
     @InjectRepository(Skill)
    private SkillRepository: Repository<Skill>,
    @InjectRepository(Recruteur)
    private recruteurRepository: Repository<Recruteur>,
  ) {}

  async create(createPosteDto: Poste) {
    // First save the poste to get an ID
    const savedPoste = await this.posteRepository.save(createPosteDto);
    
    // Handle skillsMatching if present
    if (savedPoste.skillMatching && savedPoste.skillMatching.length > 0) {
      const skillMatchingPromises = savedPoste.skillMatching.map(async (element: any) => {
        element.idPoste = savedPoste.idPoste;
        return this.skillMatchingRepository.save(element);
      });
      await Promise.all(skillMatchingPromises);
    }

    // Handle experienceMatching if present
    if (savedPoste.experienceMatching && savedPoste.experienceMatching.length > 0) {
      const experienceMatchingPromises = savedPoste.experienceMatching.map(async (element: any) => {
        element.idPoste = savedPoste.idPoste;
        return this.experienceMatchingRepository.save(element);
      });
      await Promise.all(experienceMatchingPromises);
    }

    // Return the poste with relationships
    return this.posteRepository.findOne({
      where: { idPoste: savedPoste.idPoste },
      relations: ["skillMatching", "experienceMatching"]
    });
  }
//    async createPostWithRecruiter(createPosteDto: CreatePosteDto, userId: number) {
//      const recruteur = await this.recruteurRepository.findOne({
//     where: { user: { id: userId } },
//     relations: ['user']
//   });
//     const postData = {
//       ...createPosteDto,
     
//       recruteur: { id: recruteur.id }, // Link to recruiter
//     };
    
//     return this.create({
//   ...postData,
//   createAt: new Date(),
//   updateAt: new Date(),
//   // other required fields
// } as Poste);//   }
async createPostWithRecruiter(createPosteDto: CreatePosteDto, userId: number) {
  const recruteur = await this.recruteurRepository.findOne({ 
    where: { user: { id: userId } } 
  });
  const poste = this.posteRepository.create({
    titrePoste: createPosteDto.titrePoste, 
    descriptionPoste: createPosteDto.descriptionPoste,
    recruteur: recruteur, 
  });
  const savedPoste = await this.posteRepository.save(poste);
  if (createPosteDto.skills) {
    for (const skillName of createPosteDto.skills) {
      const skill = await this.SkillRepository.findOne({ 
        where: { titreSkill: skillName } 
      });
      if (skill) {
        await this.skillMatchingRepository.save({
          idPoste: savedPoste.idPoste,
          idSkill: skill.idSkill 
        });
      }
      else {
         let skill= this.SkillRepository.create({
           titreSkill: skillName
         })
       let saveskill=  this.SkillRepository.save(skill)

     await this.skillMatchingRepository.save({
          idPoste: savedPoste.idPoste, 
          idSkill: (await saveskill).idSkill 
        });
      }
      }
    }
  const experiences = createPosteDto.experience ; // Safeguard here
  console.log('experiences',experiences)
const experience = this.ExperienceRepository.create({
      nbExperience:Number(experiences)
    });    
    const savedExperience = await this.ExperienceRepository.save(experience);
    
    await this.experienceMatchingRepository.save({
      idPoste: savedPoste.idPoste,
      idExperience: savedExperience.idExperience,
      nbExperience: Number(experiences)
    });
  
  
  return savedPoste; 
}


  findAll() {
    return this.posteRepository.findAndCount({relations: ["skillMatching", "experienceMatching","recruteur","skillMatching.idSkill"]});
    
  }

  findOne(id: number) {
    return this.posteRepository.findOne({
      where: {idPoste: id},
      relations: ["recruteur", "skillMatching", "idExperience", "idEducation",'recruteur.user',"skillMatching.idSkill"]
    });
  }

  async update(id: number, updatePosteDto: UpdatePosteDto) {
    const user = await this.posteRepository.preload({
      idPoste: +id,
      ...updatePosteDto
    });
    if (!user) {
      throw new NotFoundException();
    }
    return this.posteRepository.save(user);
  }

  
  
    
  remove(id: number) {
    return this.posteRepository.manager.transaction(async manager => {
    await manager.delete(SkillMatching, { idPoste: { id } });
    await manager.delete(ExperienceMatching, { idPoste: { id } });
    return manager.delete(Poste, id);
  });
  }


 async postuler(posteId: number, resumeId: number) {
    const poste = await this.posteRepository.findOne({ 
      where: { idPoste: posteId },
      relations: ['resumenp'] 
    });
    const resume = await this.ResumeRepository.findOneBy({ idCV: resumeId });
    if (!poste || !resume) {
      throw new NotFoundException('Poste or Resume not found');
    }
    poste.resume = [...(poste.resume || []), resume];
    await this.posteRepository.save(poste);
    return { 
      success: true,
      message: 'Candidature envoyée avec succès'
    };
  }

  /**
   * Calculate matching score between a job posting and a Resumee
   * @param posteId - Job Posting ID
   * @param idCV - Resumee ID
   * @returns Matching score (0-100)
   */
  async calculateMatchingScore(posteId: number, idCV: number): Promise<number> {
  // 1. Fetch the job posting and Resume with relations
  const poste = await this.posteRepository.findOne({
    where: { idPoste: posteId },
    relations: ['skillMatching', 'skillMatching.idSkill', 'experienceMatching'],
  });

  const resume = await this.ResumeRepository.findOne({
    where: { idCV: idCV },
    relations: ['skillMatching', 'skillMatching.idSkill', 'experienceMatching'],
  });

  if (!poste || !resume) {
    throw new NotFoundException('Job posting or Resume not found');
  }

  // 2. Calculate Skill Matching Score (Weight: 60%)
  const skillScore = this.calculateSkillMatchScore(
    poste.skillMatching,
    resume.skillMatching
  );

  // 3. Calculate Experience Matching Score (Weight: 40%)
  const experienceScore = this.calculateExperienceMatchScore(
    poste.experienceMatching,
    resume.experienceMatching
  );

  // 4. Combine scores with weights
  const totalScore = skillScore * 0.6 + experienceScore * 0.4;

  return Math.min(Math.round(totalScore * 100), 100); // Convert to percentage (0-100)
}

private calculateSkillMatchScore(
  posteSkills: SkillMatching[],
  resumeSkills: SkillMatching[]
): number {
  if (!posteSkills?.length || !resumeSkills?.length) return 0;

  // Extract required skill IDs from job posting
  const requiredSkills = posteSkills.map(sm => ({
    id: sm.idSkill.idSkill, // Accessing through relation
    isRequired: true // You could add weight here if available
  }));

  // Extract Resume's skills
  const resumeSkillIds = resumeSkills.map(s => s.idSkill.idSkill);

  // Calculate Jaccard similarity coefficient
  const intersection = requiredSkills.filter(req => 
    resumeSkillIds.includes(req.id)
  ).length;

  const union = new Set([
    ...requiredSkills.map(s => s.id),
    ...resumeSkillIds
  ]).size;

  return union > 0 ? intersection / union : 0;
}

private calculateExperienceMatchScore(
  posteExperiences: ExperienceMatching[],
  resumeExperiences: ExperienceMatching[]
): number {
  if (!posteExperiences?.length) return 0; // No experience required = perfect match
  
  // Calculate total required years
  const requiredYears = posteExperiences.reduce(
    (sum, exp) => sum + (exp.nbExperience || 0),
    0
  );

  // Calculate candidate's total years
  const candidateYears = resumeExperiences?.length 
    ? resumeExperiences.reduce(
        (sum, exp) => sum + (exp.nbExperience || 0),
        0
      )
    : 0;

  // Normalize score (cap at 1.5 if candidate exceeds requirements)
  if (requiredYears <= 0) return 1; // If no experience required
  return Math.min(candidateYears / requiredYears, 1.5);
}

// In your service
async getTopResumeesForPoste(
  posteId: number,
  userId: number // Now accepts userId instead of recruiterId
): Promise<Array<{ resume: Resume; score: number }>> {
  // First verify the post belongs to this user
  const poste = await this.posteRepository.findOne({
    where: { 
      idPoste: posteId,
      recruteur: { user: { id: userId } } // Check user relation
    },
    relations: ['recruteur.user']
  });
  
  if (!poste) throw new NotFoundException('Job posting not found or not authorized');

  // Get all resumes that applied to this specific post
  const resumes = await this.ResumeRepository.find({
    where: {
      poste: { idPoste: posteId }
    },
    relations: [
      'skillMatching', 
      'skillMatching.idSkill', 
      'experienceMatching','experienceMatching.idExperience',
      'candidat','candidat.user', "poste"
    ],
  });

  // Calculate scores only for these resumes
  const scoredResumes = await Promise.all(
    resumes.map(async resume => ({
      resume,
      score: await this.calculateMatchingScore(posteId, resume.idCV),
    }))
  );
  return scoredResumes.sort((a, b) => b.score - a.score);
}
}