import { Grid } from '@mui/material';
import MESHeader from './MesHeader';
import MiseEnServiceList from './MesList';

function MES() {
  return (
    <Grid container spacing={2} direction="column">
      {' '}
      <Grid item>
        <MESHeader />
      </Grid>
      <Grid item>
        <MiseEnServiceList />
      </Grid>
    </Grid>
  );
}
export default MES;
