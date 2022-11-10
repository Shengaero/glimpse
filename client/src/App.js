import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import 'bootstrap-icons/font/bootstrap-icons.css';
import client from './utils/apollo';
import Home from './pages/Home';
import ChatPage from './pages/ChatPage';

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
            path='/chat'
            element={<ChatPage />}
          />
        </Routes>
      </Router>
    </ApolloProvider>
  );
}

export default App;
