import React, { Component } from 'react';
import {
  Grid,
  Header,
  Icon,
  Dropdown,
  Image,
  Modal,
  Input,
  Button
} from 'semantic-ui-react';
import firebase from '../../../firebase';
import AvatarEditor from 'react-avatar-editor';

class UserPanel extends Component {
  state = {
    user: this.props.currentUser,
    modal: false,
    previewImage: '',
    croppedImage: '',
    blob: '',
    storageRef: firebase.storage().ref(),
    userRef: firebase.auth().currentUser,
    metadata: {
      contentType: 'image/jpeg'
    },
    uploadedCroppedImage: '',
    usersRef: firebase.database().ref('users')
  };

  uploadCroppedImage = () => {
    const { storageRef, userRef, blob, metadata } = this.state;
    storageRef
      .child(`avatars/user/${userRef.uid}`)
      .put(blob, metadata)
      .then(snap => {
        snap.ref.getDownloadURL().then(downloadURL => {
          this.setState({ uploadedCroppedImage: downloadURL }, () => {
            this.changeAvatar();
          });
        });
      });
  };

  changeAvatar = () => {
    this.state.userRef
      .updateProfile({
        photoURL: this.state.uploadedCroppedImage
      })
      .then(() => {
        console.log('PhotoURL Updated');
        this.closeModal();
      })
      .catch(err => {
        console.log(err);
      });

    this.state.usersRef
      .child(this.state.user.uid)
      .update({
        avatar: this.state.uploadedCroppedImage
      })
      .then(() => {
        console.log('User avatar Updated !');
      })
      .catch(err => {
        console.log(err);
      });
  };

  openModal = () => {
    this.setState({ modal: true });
  };

  closeModal = () => {
    this.setState({ modal: false });
  };

  dropdownOptions = () => [
    {
      key: 'user',
      text: (
        <span>
          Signed as <strong>{this.state.user.displayName}</strong>
        </span>
      ),
      disabled: true
    },
    {
      key: 'avatar',
      text: <span onClick={this.openModal}>Change Avatar</span>
    },
    {
      key: 'logout',
      text: <span onClick={this.handleSignout}>Logout</span>
    }
  ];

  handleSignout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log('Signed out !');
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleChange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.addEventListener('load', () => {
        this.setState({ previewImage: reader.result });
      });
    }
  };

  handleCropImage = () => {
    if (this.avatarEditor) {
      this.avatarEditor.getImageScaledToCanvas().toBlob(blob => {
        let imageUrl = URL.createObjectURL(blob);
        this.setState({
          croppedImage: imageUrl,
          blob
        });
      });
    }
  };

  render() {
    const { user, modal, previewImage, croppedImage } = this.state;

    return (
      <Grid style={{ background: '#4c3c4c' }}>
        <Grid.Column>
          <Grid.Row style={{ padding: '1.2em', margin: 0 }}>
            <Header inverted floated="left" as="h2">
              <Icon name="code" />
              <Header.Content>DevChat</Header.Content>
            </Header>
            <Header style={{ padding: '0.25em' }} as="h4" inverted>
              <Dropdown
                trigger={
                  <span>
                    <Image src={user.photoURL} spaced="right" avatar />
                    {this.state.user.displayName}
                  </span>
                }
                options={this.dropdownOptions()}
              />
            </Header>
          </Grid.Row>

          <Modal basic open={modal} onClose={this.closeModal}>
            <Modal.Header>Change Avatar</Modal.Header>
            <Modal.Content>
              <Input
                onChange={this.handleChange}
                fluid
                type="file"
                label="New Avatar"
                name="previewImage"
              />
              <Grid centered stackable columns={2}>
                <Grid.Row centered>
                  <Grid.Column className="ui center aligned grid">
                    {previewImage && (
                      <AvatarEditor
                        ref={node => {
                          this.avatarEditor = node;
                        }}
                        image={previewImage}
                        width={120}
                        height={120}
                        border={50}
                        scale={1.2}
                      />
                    )}
                  </Grid.Column>
                  <Grid.Column>
                    {croppedImage && (
                      <Image
                        width={100}
                        height={100}
                        style={{ margin: '3.5em auto' }}
                        src={croppedImage}
                      />
                    )}
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Modal.Content>
            <Modal.Actions>
              {croppedImage && (
                <Button
                  color="green"
                  inverted
                  onClick={this.uploadCroppedImage}
                >
                  <Icon name="save" /> Change Avatar
                </Button>
              )}
              <Button color="green" inverted onClick={this.handleCropImage}>
                <Icon name="image" /> Preview
              </Button>
              <Button color="red" inverted onClick={this.closeModal}>
                <Icon name="remove" /> Cancel
              </Button>
            </Modal.Actions>
          </Modal>
        </Grid.Column>
      </Grid>
    );
  }
}

export default UserPanel;
