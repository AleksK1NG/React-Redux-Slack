import React, { Component } from 'react';
import { Link } from 'react-router-dom';
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

class Login extends Component {
  state = {
    email: '',
    password: '',
    errors: [],
    loading: false,
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };


  handleSubmit = event => {
    event.preventDefault();
    const { email, password, errors } = this.state;
    if (this.isFormValid(this.state)) {
      this.setState({ errors: [], loading: true });
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(signedInUser => {
          console.log('login: ', signedInUser);
          this.setState({ loading: false });
        })
        .catch(err => {
          console.log(err);
          this.setState({ errors: errors.concat(err), loading: false });
        })

    }
  };


  isFormValid = ({ email, password }) => email && password;



  displayErrors = errors =>
    errors.map((error, i) => <p key={i}>{error.message}</p>);

  handleInputError = (errors, inputName) => {
    return errors.some(error => error.message.toLowerCase().includes(inputName))
      ? 'error'
      : '';
  };

  render() {
    const {
      email,
      password,
      errors,
      loading
    } = this.state;

    return (
      <div>
        <Grid textAlign="center" verticalAlign="middle" className="app">
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as="h1" icon color="violet" textAlign="center">
              <Icon name="code branch" color="violet" />
              Login
            </Header>
            <Form size="large" onSubmit={e => this.handleSubmit(e)}>
              <Segment stacked>

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

              </Segment>

              <Button
                color="violet"
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
              Dont have an account ?<Link to="/register">Register</Link>
            </Message>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default Login;
