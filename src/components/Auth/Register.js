import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import md5 from 'md5';
import {
  Grid,
  Header,
  Form,
  Button,
  Segment,
  Message,
  Icon
} from 'semantic-ui-react';
import firebase from '../../firebase';

class Register extends Component {
  state = {
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    errors: [],
    loading: false,
    usersRef: firebase.database().ref('users')
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };


  handleSubmit = event => {
    event.preventDefault();
    if (this.isFormValid()) {
      this.setState({ errors: [], loading: true });
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(createdUser => {
          console.log(createdUser);
          createdUser.user
            .updateProfile({
              displayName: this.state.username,
              photoURL: `http://gravatar.com/avatar/${md5(
                createdUser.user.email
              )}?d=identicon`
            })
            .then(() => {
              this.saveUser(createdUser).then(() => {
                console.log("user saved");
                this.setState({ loading: false });
              });
            })
            .catch(err => {
              console.error(err);
              this.setState({
                errors: this.state.errors.concat(err),
                loading: false
              });
            });
        })
        .catch(err => {
          console.error(err);
          this.setState({
            errors: this.state.errors.concat(err),
            loading: false
          });
        });
    }
  };

  saveUser = createdUser => {
    return this.state.usersRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL
    });
  };


  isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
    // check if any form field is empty
    return (
      !username.length ||
      !email.length ||
      !password.length ||
      !passwordConfirmation.length
    );
  };

  isPasswordValid = ({ password, passwordConfirmation }) => {
    if (password.length < 6 || passwordConfirmation.length < 6) {
      return false;
    } else if (password !== passwordConfirmation) {
      return false;
    } else {
      return true;
    }
  };

  isFormValid = () => {
    let errors = [];
    let error = null;

    if (this.isFormEmpty(this.state)) {
      // add error to the state
      error = { message: 'You need to enter all fields' };
      this.setState({ errors: errors.concat(error) });
      return false;
    } else if (!this.isPasswordValid(this.state)) {
      // throw error
      error = { message: 'Password is invalid' };
      this.setState({ errors: errors.concat(error) });
      return false;
    } else {
      // form is valid
      return true;
    }
  };

  displayErrors = errors =>
    errors.map((error, i) => <p key={i}>{error.message}</p>);

  handleInputError = (errors, inputName) => {
    return errors.some(error => error.message.toLowerCase().includes(inputName))
      ? 'error'
      : '';
  };

  render() {
    const {
      username,
      email,
      password,
      passwordConfirmation,
      errors,
      loading
    } = this.state;

    return (
      <div>
        <Grid textAlign="center" verticalAlign="middle" className="app">
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as="h1" icon color="orange" textAlign="center">
              <Icon name="puzzle piece" color="orange" />
              Register
            </Header>
            <Form size="large" onSubmit={e => this.handleSubmit(e)}>
              <Segment stacked>
                <Form.Input
                  value={username}
                  type="text"
                  fluid
                  name="username"
                  icon="user"
                  iconPosition="left"
                  placeholder="Username"
                  onChange={e => this.handleChange(e)}
                  className={this.handleInputError(errors, 'username')}
                />
                <Form.Input
                  value={email}
                  type="email"
                  fluid
                  name="email"
                  icon="mail"
                  iconPosition="left"
                  placeholder="Email"
                  onChange={e => this.handleChange(e)}
                  className={this.handleInputError(errors, 'email')}
                />
                <Form.Input
                  value={password}
                  type="password"
                  fluid
                  name="password"
                  icon="lock"
                  iconPosition="left"
                  placeholder="Password"
                  onChange={e => this.handleChange(e)}
                  className={this.handleInputError(errors, 'password')}
                />
                <Form.Input
                  value={passwordConfirmation}
                  type="password"
                  fluid
                  name="passwordConfirmation"
                  icon="repeat"
                  iconPosition="left"
                  placeholder="Confirm Password"
                  onChange={e => this.handleChange(e)}
                  className={this.handleInputError(errors, 'password')}
                />
              </Segment>

              <Button
                color="orange"
                fluid
                size="large"
                className={loading ? 'loading' : ''}
                disabled={loading}
              >
                Submit
              </Button>
            </Form>
            {errors.length > 0 && (
              <Message error>
                <h3>Error</h3>
                {this.displayErrors(errors)}
              </Message>
            )}
            <Message>
              Already a user ?<Link to="/login">Login</Link>
            </Message>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default Register;
