import React, { Component } from 'react';
import { App } from './components/App';

import {
  AppRegistry,
  View
} from 'react-native';

class RNAnimation extends Component {
  render() {
    return (
      <View>
        <App />
      </View>
    );
  }
}

AppRegistry.registerComponent('RNAnimation', () => RNAnimation);
