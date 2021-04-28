import { Container } from 'semantic-ui-react';
import Navbar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { observer } from 'mobx-react-lite';
import HomePage from '../../features/home/HomePage';
import { Route, useLocation } from 'react-router-dom';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';

function App() {
  const location =useLocation();
  return (
    <>
      <Route exact path='/' component={HomePage}/>
      <Route
        path={'/(.+)'}
        render={()=>(
          <>
            <Navbar/>
            <Container style={{marginTop:'7em'}}>
              <Route exact path='/activities' component={ActivityDashboard}/>
              <Route path='/activities/:id' component={ActivityDetails}/>
              <Route key={location.key} path={['/createActivity','/manage/:id']} component={ActivityForm}/>
            </Container>
          </>
        )}
      />
    </>
  );
}

export default observer (App);
