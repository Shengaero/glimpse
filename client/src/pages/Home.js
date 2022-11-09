import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useMutation } from '@apollo/client';
import { LOGIN_USER, CREATE_USER } from '../utils/mutations';
import * as Auth from '../utils/auth';

const Home = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const handleCloseLogin = () => setShowLogin(false);
  const handleShowLogin = () => setShowLogin(true);
  const handleCloseSignup = () => setShowSignup(false);
  const handleShowSignup = () => setShowSignup(true);

  const [loginFormState, setLoginFormState] = useState({ email: '', password: '' });
  const [signupFormState, setSignupFormState] = useState({ name: '', email: '', password: '' });
  const [login] = useMutation(LOGIN_USER);
  const [createUser] = useMutation(CREATE_USER);

  // update state based on form input changes
  const handleLoginChange = (event) => {
    const { name, value } = event.target;

    setLoginFormState({
      ...loginFormState,
      [name]: value
    });
  };
  const handleSignupChange = (event) => {
    const { name, value } = event.target;

    setSignupFormState({
      ...signupFormState,
      [name]: value
    });
  };

  const handleLoginFormSubmit = async (event) => {
    event.preventDefault();
    console.log(loginFormState);
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

  const handleSignupFormSubmit = async (event) => {
    event.preventDefault();
    console.log(signupFormState);
    try {
      const { data } = await createUser({
        variables: { ...signupFormState }
      });
      console.log(data);
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
    <div className='jumbotron position-absolute top-50 start-50 translate-middle d-flex flex-column'>
      <h1 className='display-1'>GLIMPSE</h1>
      <div className='text-center pt-3'>
        <Button variant="dark w-50" onClick={handleShowLogin}>
                Login
        </Button>
        <Button variant="dark w-50" onClick={handleShowSignup}>
                Signup
        </Button>
      </div>
      <Modal show={showLogin} onHide={handleCloseLogin} centered>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name='email'
                placeholder="Enter Your Email"
                autoFocus
                value={loginFormState.email}
                onChange={handleLoginChange}
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Password</Form.Label>
              <Form.Control
                type='password'
                name='password'
                placeholder='Enter Your Password'
                value={loginFormState.password}
                onChange={handleLoginChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <div className='d-grid gap-2 mx-auto col-10'>
            <Button variant="dark" onClick={handleLoginFormSubmit}>
                    Login
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
      <Modal show={showSignup} onHide={handleCloseSignup} centered>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name='name'
                placeholder="Enter Your Name"
                autoFocus
                value={signupFormState.name}
                onChange={handleSignupChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name='email'
                placeholder="Enter Your Email"
                autoFocus
                value={signupFormState.email}
                onChange={handleSignupChange}
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Password</Form.Label>
              <Form.Control
                type='password'
                name='password'
                placeholder='Enter Your Password'
                value={signupFormState.password}
                onChange={handleSignupChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <div className='d-grid gap-2 mx-auto col-10'>
            <Button variant="dark" onClick={handleSignupFormSubmit}>
                    Signup
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Home;
