import './styles/App.scss';
import Login from './components/Login';
import { ApolloProvider } from '@apollo/client';
import * as client from './utils/apollo';

function App() {
  return (
    <ApolloProvider client={client}>
      <Login />
    </ApolloProvider>
  );
}

export default App;
