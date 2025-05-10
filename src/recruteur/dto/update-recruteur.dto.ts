import { PartialType } from '@nestjs/mapped-types';
import { CreateRecruteurDto } from './create-recruteur.dto';

export class UpdateRecruteurDto extends PartialType(CreateRecruteurDto) {}
