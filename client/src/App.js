import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';

import * as client from './utils/apollo';
import Home from './pages/Home';
import Mainpage from './pages/Mainpage';

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          <Route
            path='/'
            element={<Home />}
          />
          <Route
            path='/mainpage'
            element={<Mainpage />}
          />
        </Routes>
      </Router>
      {/* <Login /> */}
    </ApolloProvider>
  );
}

export default App;
