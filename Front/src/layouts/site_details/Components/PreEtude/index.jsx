import PreHeader from './PreEtudeHeader';
import Grid from '@mui/material/Grid';
import PreEtudeList from './PreEtudeList';
function PreEtude() {
  return (
    <Grid container spacing={2} direction="column">
      {' '}
      <Grid item>
        <PreHeader />
      </Grid>
      <Grid item>
        <PreEtudeList />
      </Grid>
    </Grid>
  );
}
export default PreEtude;
