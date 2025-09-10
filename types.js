export interface PersonalData {
  name: string;
  email: string;
  phoneCountryCode: string;
  phoneNumber: string;
  cityAndCountry: string;
  linkedin: string;
  website: string;
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export interface ExperienceEntry {
  id:string;
  company: string;
  city: string;
  country: string;
  position: string;
  startMonth: string;
  startDate: string;
  endMonth: string;
  endDate: string;
  description: string;
  isCurrent: boolean;
}

export interface SkillEntry {
  id: string;
  skill: string;
  level: 'Básico' | 'Intermedio' | 'Avanzado';
}

export interface ComplementaryTrainingEntry {
  id: string;
  course: string;
  institution: string;
  year: string;
  description: string;
  city: string;
  country: string;
}

export interface DrivingLicenseData {
  A1: boolean;
  A2: boolean;
  A3: boolean;
  A4: boolean;
  A5: boolean;
  B: boolean;
  C: boolean;
  D: boolean;
  E: boolean;
  F: boolean;
}

export interface CVData {
  // FIX: Added optional id and lastModified properties for saved CV functionality.
  id?: string;
  lastModified?: number;
  personal: PersonalData;
  summary: string;
  education: EducationEntry[];
  experience: ExperienceEntry[];
  skills: SkillEntry[];
  complementaryTraining: ComplementaryTrainingEntry[];
  hasDrivingLicense: boolean;
  drivingLicense: DrivingLicenseData;
  accentColor: string;
  fontSizes: {
    name: number;
    personal: number;
  };
}
