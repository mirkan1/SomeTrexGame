import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Animated, TouchableOpacity, Dimensions, Easing } from 'react-native';

// DID SOME ANIMATION STUFF TO LEARN HOW TO ANIMATE
// NEXT STEP: MAKE A GAME XD

export default class App extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      fadeValue: new Animated.Value(0),
      width: new Animated.Value(100),
      rotateX: 0,
      rotateY: 0,
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

  changeDirection = (evt) => {
    /*let locX = evt.nativeEvent.locationX;
    let locY = evt.nativeEvent.locationY;
    let endpoint = Math.atan(locY / locX)
    console.log(`locX: ${locX}, locY: ${locY}`)*/
    let yukseklik = Dimensions.get('window').height;
    let Yprime = evt.nativeEvent.locationX;
    let Xprime = evt.nativeEvent.locationY;
    console.log(Yprime/yukseklik * 360)

    /*Animated.timing(this.state.rotate, {
      toValue: locX/locY,
      duration: 3000,
      easing: Easing.linear
    }).start();*/
    this.setState({ rotateX: Yprime/yukseklik * 180 })
  }

  render() {
    return (
      <TouchableOpacity style={styles.container} onPress={(evt) => this.changeDirection(evt)}>
        {/*<Animated.View style={[styles.animationView,
          { opacity: this.state.fadeValue }
          ]}>
        </Animated.View>*/}

        <Animated.View style={[styles.animationView,
          { width: this.state.width },
          { transform:[ { rotateZ: (-this.state.rotateX) + 'deg' }] }
          ]}>
        </Animated.View>

        {/*<TouchableOpacity onPress={this._increaseWidth}>
          <Text style={styles.welcome}>Animate</Text>
        </TouchableOpacity>*/}


      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    //alignItems: 'center', 
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
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 50,
    borderRightWidth: 50,
    borderBottomWidth: 100,
    borderTopWidth: 100,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'red',
  },
  button: {
    backgroundColor: 'steelblue',
    height: 45,
    marginTop: 20,
    alignSelf: 'center',
  }
});
