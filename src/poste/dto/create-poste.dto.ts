export class CreatePosteDto {
  // In create-poste.dto.ts (updated to match French DB fields)

  titrePoste: string;
  descriptionPoste: string;
  skills: string[];
  
  experience: {      // Matches 'titre' in Experience entity
    nbExperience: number;   // Matches 'nbExperience' in ExperienceMatching
 }[] = [];

}
