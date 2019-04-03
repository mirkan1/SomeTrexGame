import React, { Component } from 'react';
import {Platform, StyleSheet, Text, View, Animated, TouchableOpacity, Dimensions, Easing, TouchableWithoutFeedback } from 'react-native';
//import { Constants } from 'expo';

const WINDOW = Dimensions.get('window');

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = { menuOpacity: true }
  }

  render() {
    if (this.state.menuOpacity) { 
  return (
      <Animated.View style={this.props.style}>
        {this.props.children}

        <View style={{
          width: WINDOW.width / 2,
          height: WINDOW.height / 2,
          alignSelf: 'center',
          position: "absolute",
          marginTop: WINDOW.height / 2 - 150,
          marginLeft: WINDOW.width / 2 - 100,
          backgroundColor: 'pink',
        }}>
          <TouchableOpacity 
			      onPress={() => this.setState({menuOpacity: !this.state.menuOpacity})}
			      style={this.props.buttonStyle}
		      >
            <Text>Play</Text>
          </TouchableOpacity>

          <TouchableOpacity 
			      onPress={() => this.setState({menuOpacity: !this.state.menuOpacity})}
			      style={this.props.buttonStyle}
		      >
            <Text>Restart(make it work)</Text>
          </TouchableOpacity>

          <TouchableOpacity 
			      onPress={() => this.setState({menuOpacity: !this.state.menuOpacity})}
			      style={this.props.buttonStyle}
		      >
            <Text>Options(make it work)</Text>
          </TouchableOpacity>

        </View>

      </Animated.View>
  );
    } else {
      return ( 
        <View style={this.props.style}>
          {this.props.children}
          <TouchableOpacity 
			      onPress={() => this.setState({menuOpacity: !this.state.menuOpacity})}
			      style={{backgroundColor: "pink", alignSelf: 'flex-end', position: "absolute", width: "100%", height: 1, paddingTop: 1}}
		      >
            <Text style={styles.closedMenu}>Open Menu</Text>
            <Text style={styles.closedMenu}>SCORE:{this.props.score}</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  closedMenu: {
    fontSize: 15, 
    letterSpacing: 5, 
    textAlign: 'center',
  }
})


export default Menu;