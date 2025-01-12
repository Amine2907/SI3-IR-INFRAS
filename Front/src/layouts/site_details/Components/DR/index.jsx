import Grid from '@mui/material/Grid';
import DemRacList from './DrList';
import DemRacHeader from './DrHeader/index';
function DR() {
  return (
    <Grid container spacing={2} direction="column">
      {' '}
      <Grid item>
        <DemRacHeader />
      </Grid>
      <Grid item>
        <DemRacList />
      </Grid>
    </Grid>
  );
}
export default DR;
