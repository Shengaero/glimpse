import './styles/App.scss';
import { ApolloProvider } from '@apollo/client';
import client from './utils/apollo';
import Home from './pages/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as Auth from './utils/auth';

function App() {
  console.log(Auth.loggedIn())
  return (
    <ApolloProvider client={client}>
      <Router>
        <Home />
      </Router>
    </ApolloProvider>
  );
}

export default App;
