import Pheader from './ProspectHeader';
import ProspectList from './ProspectList';
import Grid from '@mui/material/Grid';

function Prospect() {
  return (
    <Grid container spacing={2} direction="column">
      {' '}
      <Grid item>
        <Pheader />
      </Grid>
      <Grid item>
        <ProspectList />
      </Grid>
    </Grid>
  );
}
export default Prospect;
