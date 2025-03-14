export const mapValidationStatus = value => {
  const statusMapping = {
    1: '1. En recherche',
    2: '2. En relance recherche',
    3: '2.1 Bilan de zone',
    4: '3. Validation en cours',
    5: '4.1 En attente CRVT/Visée/Pano',
    6: '4.2 En attente CRVT',
    7: '4.3 CRVT à valider (MOE SFR)',
    8: '4.4 En attente reprise CRVT',
    9: '5. En attente validation des visées FH',
    10: '6. En attente MAJ coordonnées RSU',
    11: '7. Prospect validé',
    12: '8. Abandonné',
    13: 'à valider',
    14: 'Prospect KO',
    15: 'MAV à déposer',
    16: 'Abandonné',
    17: 'En Recherche',
    18: 'En Relance Recherche',
    19: 'Validation En Cours',
    20: 'En attente PANO',
    21: 'En attente visées FH',
    22: 'En attente validation des visées FH',
    23: 'En attente MAJ coordonnées RSU / CRVT',
    24: 'En attente DC',
    25: 'Prospect Validé',
    26: 'GO CONSTR SFR',
  };
  return statusMapping[value] || '';
};
