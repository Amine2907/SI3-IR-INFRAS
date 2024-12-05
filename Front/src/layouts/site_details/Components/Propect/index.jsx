import Pheader from './ProspectHeader';
import HeaderList from './ProspectList/Header/Header';
import Grid from '@mui/material/Grid';

function Prospect() {
  return (
    <Grid container spacing={2} direction="column">
      {' '}
      <Grid item>
        <Pheader />
      </Grid>
      <Grid item>
        <HeaderList />
      </Grid>
    </Grid>
  );
}
export default Prospect;
