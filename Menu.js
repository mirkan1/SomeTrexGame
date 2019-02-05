import React, { Component } from 'react';
import {Platform, StyleSheet, Text, View, Animated, TouchableOpacity, Dimensions, Easing, TouchableWithoutFeedback } from 'react-native';
import { Constants } from 'expo';

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = { menuOpacity: true }
  };
  render() {
    if (this.state.menuOpacity) { 
  return (
      <Animated.View style={this.props.style}>
        {this.props.children}

        <View style={{
          width: Dimensions.get('window').width / 2,
          height: Dimensions.get('window').height / 2,
          alignSelf: 'center',
          position: "absolute",
          marginTop: Dimensions.get('window').height / 2 - 150,
          marginLeft: Dimensions.get('window').width / 2 - 100,
          backgroundColor: 'pink',

        }}>
          <TouchableOpacity 
			      onPress={() => this.setState({menuOpacity: !this.state.menuOpacity})}
			      style={{backgroundColor: "blue"}}
		      >
            <Text>Play</Text>
          </TouchableOpacity>

          <TouchableOpacity 
			      onPress={() => this.setState({menuOpacity: !this.state.menuOpacity})}
			      style={{backgroundColor: "blue"}}
		      >
            <Text>Restart(make it work)</Text>
          </TouchableOpacity>
        </View>

      </Animated.View>
  );
    } else {
      return ( 
        <Animated.View style={this.props.style}>
          {this.props.children}
          <TouchableOpacity 
			      onPress={() => this.setState({menuOpacity: !this.state.menuOpacity})}
			      style={{backgroundColor: "blue", alignSelf: 'auto',}}
		      >
            <Text>Open Menu</Text>
          </TouchableOpacity>
        </Animated.View>
      );
    }
  }
}

export default Menu;