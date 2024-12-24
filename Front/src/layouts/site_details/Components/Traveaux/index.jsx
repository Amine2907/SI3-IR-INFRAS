import { Grid } from '@mui/material';
import TraveauxHeader from './TraveauxHeader';
import TraveauxList from './TraveauxList';

function Traveaux() {
  return (
    <Grid container spacing={2} direction="column">
      {' '}
      <Grid item>
        <TraveauxHeader />
      </Grid>
      <Grid item>
        <TraveauxList />
      </Grid>
    </Grid>
  );
}
export default Traveaux;
