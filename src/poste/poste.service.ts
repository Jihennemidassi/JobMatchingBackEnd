import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePosteDto } from './dto/create-poste.dto';
import { UpdatePosteDto } from './dto/update-poste.dto';
import { Poste } from './entities/poste.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Skill } from 'src/skills/entities/skill.entity';
import { SkillMatching } from 'src/skills/entities/skillMatching';
import { ExperienceMatching } from 'src/experience/entities/experienceMatching';
import { Candidat } from 'src/candidat/entities/candidat.entity';
import { Experience } from 'src/experience/entities/experience.entity';

@Injectable()
export class PosteService {
  constructor(
    @InjectRepository(Poste)
    private posteRepository: Repository<Poste>,
    @InjectRepository(SkillMatching)
    private readonly skillMatchingRepository: Repository<SkillMatching>,
    @InjectRepository(ExperienceMatching)
    private readonly experienceMatchingRepository: Repository<ExperienceMatching>,
    @InjectRepository(Candidat)
    private CandidatRepository: Repository<Candidat>,
  ) {}

  async create(createPosteDto: Poste) {
    // First save the poste to get an ID
    const savedPoste = await this.posteRepository.save(createPosteDto);
    
    // Handle skillsMatching if present
    if (savedPoste.skillsMatching && savedPoste.skillsMatching.length > 0) {
      const skillMatchingPromises = savedPoste.skillsMatching.map(async (element: any) => {
        element.idPoste = savedPoste.id;
        return this.skillMatchingRepository.save(element);
      });
      await Promise.all(skillMatchingPromises);
    }

    // Handle experienceMatching if present
    if (savedPoste.experienceMatching && savedPoste.experienceMatching.length > 0) {
      const experienceMatchingPromises = savedPoste.experienceMatching.map(async (element: any) => {
        element.idPoste = savedPoste.id;
        return this.experienceMatchingRepository.save(element);
      });
      await Promise.all(experienceMatchingPromises);
    }

    // Return the poste with relationships
    return this.posteRepository.findOne({
      where: { id: savedPoste.id },
      relations: ["skillsMatching", "experienceMatching"]
    });
  }

  findAll() {
    return this.posteRepository.findAndCount({relations: ["skillsMatching", "experienceMatching"]});
  }

  findOne(id: number) {
    return this.posteRepository.findOne({
      where: {id: id},
      relations: ["recruteurs", "skillsMatching", "experiences", "education"]
    });
  }

  async update(id: number, updatePosteDto: UpdatePosteDto) {
    const user = await this.posteRepository.preload({
      id: +id,
      ...updatePosteDto
    });
    if (!user) {
      throw new NotFoundException();
    }
    return this.posteRepository.save(user);
  }
    
  remove(id: number) {
    return this.posteRepository.delete(id);
  }

  /**
   * Calculate matching score between a job posting and a candidate
   * @param posteId - Job Posting ID
   * @param candidatId - Candidate ID
   * @returns Matching score (0-100)
   */
  async calculateMatchingScore(posteId: number, candidatId: number): Promise<number> {
    // 1. Fetch the job posting and candidate
    const poste = await this.posteRepository.findOne({
      where: { id: posteId },
      relations: ['skillsMatching', 'experienceMatching'],
    });

    const candidat = await this.CandidatRepository.findOne({
      where: { id: candidatId },
      relations: ['skills', 'experiences'],
    });

    if (!poste || !candidat) {
      throw new NotFoundException('Poste or Candidat not found');
    }

    // 2. Calculate Skill Matching Score (Weight: 60%)
    const skillScore = this.calculateSkillMatchScore(
      poste.skillsMatching,
      candidat.skill,
    );

    // 3. Calculate Experience Matching Score (Weight: 40%)
    const experienceScore = this.calculateExperienceMatchScore(
      poste.experienceMatching,
      candidat.experience,
    );

    // 4. Combine scores with weights
    const totalScore = skillScore * 0.6 + experienceScore * 0.4;

    return Math.round(totalScore * 100); // Convert to percentage (0-100)
  }

  private calculateSkillMatchScore(
    posteSkills: SkillMatching[],
    candidatSkills: Skill[],
  ): number {
    if (!posteSkills?.length || !candidatSkills?.length) return 0;

    // Extract required skill IDs from job posting
    const requiredSkillIds = posteSkills.map((sm) => sm.idSkill.id);

    // Extract candidate's skill IDs
    const candidateSkillIds = candidatSkills.map((s) => s.id);

    // Calculate Jaccard similarity
    const intersection = candidateSkillIds.filter((id) =>
      requiredSkillIds.includes(id),
    ).length;

    const union = new Set([...requiredSkillIds, ...candidateSkillIds]).size;

    return union > 0 ? intersection / union : 0;
  }

  private calculateExperienceMatchScore(
    posteExperiences: ExperienceMatching[],
    candidatExperiences: Experience[],
  ): number {
    if (!posteExperiences?.length || !candidatExperiences?.length) return 0;

    // Calculate match based on years of experience
    const requiredYears = posteExperiences.reduce(
      (sum, exp) => sum + exp.years,
      0,
    );

    const candidateYears = candidatExperiences.reduce(
      (sum, exp) => sum + exp.years,
      0,
    );

    // Normalize score (cap at 1.0 if candidate exceeds requirements)
    return Math.min(candidateYears / requiredYears, 1);
  }

  async getTopCandidatesForPoste(
    posteId: number,
    limit: number = 5,
  ): Promise<Array<{ candidat: Candidat; score: number }>> {
    const poste = await this.posteRepository.findOneBy({ id: posteId });
    if (!poste) throw new NotFoundException('Poste not found');

    const allCandidates = await this.CandidatRepository.find({
      relations: ['skills', 'experiences'],
    });

    // Calculate scores for all candidates
    const scoredCandidates = await Promise.all(
      allCandidates.map(async (candidat) => ({
        candidat,
        score: await this.calculateMatchingScore(posteId, candidat.id),
      })),
    );

    // Sort by score (descending) and return top N
    return scoredCandidates
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
}