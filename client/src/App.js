import './styles/App.scss';
import Login from './components/Login';
import { ApolloProvider } from '@apollo/client';
import * as client from './utils/apollo';
import Home from './pages/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Main from './pages/Main';

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Main />
      </Router>
      {/* <Login /> */}
    </ApolloProvider>
  );
}

export default App;
