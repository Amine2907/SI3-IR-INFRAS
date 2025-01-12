import DevisHeader from './DevisHeader';
import DevisList from './DevisList';
import { Grid } from '@mui/material';

function Devis() {
  return (
    <Grid container spacing={2} direction="column">
      {' '}
      <Grid item>
        <DevisHeader />
      </Grid>
      <Grid item>
        <DevisList />
      </Grid>
    </Grid>
  );
}
export default Devis;
