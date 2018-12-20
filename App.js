import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Animated, TouchableOpacity } from 'react-native';

// DID SOME ANIMATION STUFF TO LEARN HOW TO ANIMATE
// NEXT STEP: MAKE A GAME XD

export default class App extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      fadeValue: new Animated.Value(0),
      width: new Animated.Value(100),
    };
  }

  TwoFunctions = () => {
    this._moveAnimation();
    this._increaseWidth();
  }

  _moveAnimation = () => {
    Animated.timing(this.state.fadeValue, {
      toValue: 1,
      duration: 1200,
    }).start(() => {
        Animated.timing(this.state.fadeValue, {
        toValue: 0,
        duration: 1200,
      }).start(() => {
        this._moveAnimation();
      });
    });
  }

  _increaseWidth = () => {
    Animated.timing(this.state.width, {
      toValue: 10,
      duration: 1000,
    }).start(() => {
        Animated.timing(this.state.width, {
          toValue: 100,
          duration: 1000,
        }).start(() => {
          this._increaseWidth();
        });
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Animated.View style={[styles.animationView,
          { opacity: this.state.fadeValue }
          ]}>
        </Animated.View>

        <Animated.View style={[styles.animationView,
          { width: this.state.width }
          ]}>
        </Animated.View>

        <TouchableOpacity onPress={this.TwoFunctions}>
          <Text style={styles.welcome}>Animate</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  animationView: {
    width: 100,
    height: 100,
    backgroundColor: 'skyblue'
  },
  button: {
    backgroundColor: 'steelblue',
    height: 45,
    marginTop: 20,
    alignSelf: 'center',
  }
});
