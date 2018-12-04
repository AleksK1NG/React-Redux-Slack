import React, { Component } from 'react';
import { Header, Segment, Input, Icon } from 'semantic-ui-react';

class MessagesHeader extends Component {
  state = {
    searchTerm: ''
  };

  render() {
    const {
      channelName,
      numUniqueUsers,
      handleSeacrhChange,
      searchLoading,
      isPrivateChannel,
      isChannelStarred,
      handleStar
    } = this.props;
    return (
      <Segment clearing>
        <Header fluid="true" as="h2" floated="left" style={{ marginBottom: 0 }}>
          <span>
            {channelName}
            {!isPrivateChannel && (
              <Icon
                onClick={handleStar}
                name={isChannelStarred ? 'star' : 'star outline'}
                color={isChannelStarred ? 'yellow' : 'black'}
              />
            )}
          </span>
          <Header.Subheader>{numUniqueUsers}</Header.Subheader>
        </Header>

        <Header floated="right">
          <Input
            loading={searchLoading}
            onChange={handleSeacrhChange}
            size="mini"
            icon="search"
            name="searchTerm"
            placeholder="Search Term"
          />
        </Header>
      </Segment>
    );
  }
}

export default MessagesHeader;
