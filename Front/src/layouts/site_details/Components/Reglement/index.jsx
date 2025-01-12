import { Grid } from '@mui/material';
import ReglementHeader from './ReglementHeader';
import ReglementList from './ReglementList';
function Reglement() {
  return (
    <Grid container spacing={2} direction="column">
      {' '}
      <Grid item>
        <ReglementHeader />
      </Grid>
      <Grid item>
        <ReglementList />
      </Grid>
    </Grid>
  );
}
export default Reglement;
