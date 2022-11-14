import { Navigate } from 'react-router-dom';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useMutation } from '@apollo/client';
import { LOGIN_USER, CREATE_USER } from '../utils/mutations';
import * as Auth from '../utils/auth';
import logo from '../images/icon.png';
import '../styles/Home.scss';

const EmailField = ({ value, onChange }) => {
  return (
    <Form.Group className="mb-3">
      <Form.Label>Email address</Form.Label>
      <Form.Control
        type="email"
        name='email'
        placeholder="Enter Your Email"
        autoFocus
        value={value}
        onChange={onChange}
      />
    </Form.Group>
  );
};

const PasswordField = ({ value, onChange }) => {
  return (
    <Form.Group className="mb-3">
      <Form.Label>Password</Form.Label>
      <Form.Control
        type='password'
        name='password'
        placeholder='Enter Your Password'
        value={value}
        onChange={onChange}
      />
    </Form.Group>
  );
};

const NameField = ({ value, onChange }) => {
  return (
    <Form.Group className="mb-3">
      <Form.Label>Name</Form.Label>
      <Form.Control
        type="text"
        name='name'
        placeholder="Enter Your Name"
        autoFocus
        value={value}
        onChange={onChange}
      />
    </Form.Group>
  );
};

const SignupForm = () => {
  const [signupFormState, setSignupFormState] = useState({ name: '', email: '', password: '' });
  const [createUser] = useMutation(CREATE_USER);
  const handleSignupChange = (event) => {
    const { name, value } = event.target;

    setSignupFormState({
      ...signupFormState,
      [name]: value
    });
  };

  const handleSignupFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await createUser({
        variables: { ...signupFormState }
      });
      Auth.login(data.createUser.token);
    } catch(e) {
      console.error(e);
    }

    // clear form values
    setSignupFormState({
      name: '',
      email: '',
      password: ''
    });
  };
  return (
    <>
      <Form>
        <NameField
          value={signupFormState.name}
          onChange={handleSignupChange}
        />
        <EmailField
          value={signupFormState.email}
          onChange={handleSignupChange}
        />
        <PasswordField
          value={signupFormState.password}
          onChange={handleSignupChange}
        />
      </Form>
      <Button variant="dark" onClick={handleSignupFormSubmit}>
        Signup
      </Button>
    </>
  );
};

const LoginForm = () => {
  const [loginFormState, setLoginFormState] = useState({ email: '', password: '' });
  const [login] = useMutation(LOGIN_USER);
  const handleLoginChange = (event) => {
    const { name, value } = event.target;

    setLoginFormState({
      ...loginFormState,
      [name]: value
    });
  };

  const handleLoginFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await login({
        variables: { ...loginFormState }
      });

      Auth.login(data.login.token);
    } catch(e) {
      console.error(e);
    }

    // clear form values
    setLoginFormState({
      email: '',
      password: ''
    });
  };
  return (
    <>
      <Form>
        <EmailField
          value={loginFormState.email}
          onChange={handleLoginChange}
        />
        <PasswordField
          value={loginFormState.password}
          onChange={handleLoginChange}
        />
      </Form>
      <Button variant="dark" onClick={handleLoginFormSubmit}>
        Login
      </Button>
    </>
  );
};

const Home = () => {
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);


  if(Auth.loggedIn()) {
    return <Navigate to="/chat" />;
  }

  return (
    <main className="home">
      <div className='jumbotron d-flex flex-column'>
        <img id='home-page-logo' src={logo} alt='glimpse-logo' />
        <h1 className='display-1'>GLIMPSE</h1>
        <div className='text-center pt-3'>
          <Button variant="dark w-50" onClick={handleShowModal}>
            Login
          </Button>
        </div>
        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Body>
            {(!creatingAccount)
              ? <LoginForm />
              : <SignupForm />
            }
          </Modal.Body>
          <Modal.Footer>
            <div className='d-grid gap-2 mx-auto col-10'>
              <Button variant="dark" onClick={() => setCreatingAccount(!creatingAccount)}>
                {creatingAccount ? 'Login Instead' : 'Signup Instead'}
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
      </div>
    </main>
  );
};

export default Home;
