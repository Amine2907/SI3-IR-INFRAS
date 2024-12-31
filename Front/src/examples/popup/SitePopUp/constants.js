/* eslint-disable */
// constants.js
// Priority levels
export const PRIORITIES = [
  'P00',
  'P0',
  'P1',
  'P2',
];
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
  'Provence-Alpes-Côte d\'Azur',
  'Réunion',
];

// Programmes
export const PROGRAMMES = [
  '4GFixe',
  'DCC',
  'ARP',
  'DENSIF_CZ_RED',
  'DENSIF_CZ',
  'ZTD_RED',
  'PAC-REMP',
  'PAC',
  'PAC-DUP',
  'PAC-CONTINUITY-PLAN',
  'FM',
  'ORF',
  'SFR TT',
  'FM TT',
];

// Status Site SFR
export const STATUS_SITE_FK = [
  '0.Bloquée/Suspendu MAD',
  '0.Bloquée/Suspendu Conv',
  '0.Bloquée/Suspendu DP',
  '1.En Recherche',
  '2.En validation',
  '3.Validé',
  '3.En Conception',
  '4.En cours conception',
  '4.GO Constr. Anticipé',
  '5.En attente visées FH',
  '5.GO Constructibilité',
  '6.GO Constructibilité',
  '7.GO Constructibilité Anticipé',
  '7.MES',
  '8.Annulé',
  '8.PEM',
  'En service',
];
// Status Site FK
export const STATUS_SITE_SFR = ['Activé', 'Inactif', 'Terminé'];
// Operators
export const OPERATORS = ['SFR', 'ORANGE', 'FREE', 'Bouygues Telecom'];
