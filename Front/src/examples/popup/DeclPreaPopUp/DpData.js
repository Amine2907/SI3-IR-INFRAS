export const mapEtatValues = value => {
  const etatMapping = {
    1: 'Complet',
    2: 'Incomplet',
  };
  return etatMapping[value] || '';
};
