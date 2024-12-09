import PreHeader from './PreEtudeHeader';
import Grid from '@mui/material/Grid';

function PreEtude() {
  return (
    <Grid container spacing={2} direction="column">
      {' '}
      <Grid item>
        <PreHeader />
      </Grid>
      <Grid item></Grid>
    </Grid>
  );
}
export default PreEtude;
