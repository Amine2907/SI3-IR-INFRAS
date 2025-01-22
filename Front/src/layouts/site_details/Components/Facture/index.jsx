import { Grid } from '@mui/material';
import FactureHeader from './FactureHeader';
import FactureList from './FactureList';

function Facture() {
  return (
    <Grid container spacing={2} direction="column">
      {' '}
      <Grid item>
        <FactureHeader />
      </Grid>
      <Grid item>
        <FactureList />
      </Grid>
    </Grid>
  );
}
export default Facture;
