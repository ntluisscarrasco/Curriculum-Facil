import type { CVData } from './types.ts';

export const LICENSE_CLASSES = {
  profesionales: ['A1', 'A2', 'A3', 'A4', 'A5'],
  noProfesionales: ['B', 'C'],
  especiales: ['D', 'E', 'F']
};

export const INITIAL_CV_DATA: CVData = {
  personal: {
    name: "",
    email: "",
    phoneCountryCode: "+56",
    phoneNumber: "",
    cityAndCountry: "",
    linkedin: "",
    website: "",
  },
  summary: "",
  education: [],
  experience: [],
  skills: [],
  complementaryTraining: [],
  hasDrivingLicense: false,
  drivingLicense: {
    A1: false,
    A2: false,
    A3: false,
    A4: false,
    A5: false,
    B: false,
    C: false,
    D: false,
    E: false,
    F: false,
  },
  accentColor: '#003366',
  fontSizes: {
    name: 25,
    personal: 12,
  },
};