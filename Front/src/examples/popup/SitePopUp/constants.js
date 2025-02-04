/* eslint-disable */
// constants.js
// Priority levels
export const PRIORITIES = ['P00', 'P0', 'P1', 'P2'];
export const priority = { 1: 'P00', 2: 'P0', 3: 'P1', 4: 'P2' };
// Regions
export const REGIONS = [
  'Auvergne-Rhône-Alpes',
  'Bourgogne-Franche-Comté',
  'Bretagne',
  'Centre-Val de Loire',
  'Corse',
  'Grand Est',
  'Guadeloupe',
  'Guyane',
  'Hauts-de-France',
  'Île-de-France',
  'Martinique',
  'Normandie',
  'Nouvelle-Aquitaine',
  'Occitanie',
  'Pays de la Loire',
  "Provence-Alpes-Côte d'Azur",
  'Réunion',
];

// Programmes
export const PROGRAMMES = {
  1: '4GFixe',
  2: 'DCC',
  3: 'ARP',
  4: 'DENSIF_CZ_RED',
  5: 'DENSIF_CZ',
  6: 'ZTD_RED',
  7: 'PAC-REMP',
  8: 'PAC',
  9: 'PAC-DUP',
  10: 'PAC-CONTINUITY-PLAN',
  11: 'FM',
  12: 'ORF',
  13: 'SFR TT',
  14: 'FM TT',
};

// Status Site SFR
export const STATUS_SITE_FK = {
  1: 'Activé',
  2: 'Inactif',
  3: 'Terminé',
};
// Status Site FK
export const STATUS_SITE_SFR = ['Activé', 'Inactif', 'Terminé'];
// Operators
export const OPERATORS = ['SFR', 'ORANGE', 'FREE', 'Bouygues Telecom'];
