import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';

import * as client from './utils/apollo';
import Home from './pages/Home';

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Home />
      </Router>
      {/* <Login /> */}
    </ApolloProvider>
  );
}

export default App;
