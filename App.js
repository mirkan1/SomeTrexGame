import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Animated, TouchableOpacity, Dimensions, Easing, TouchableWithoutFeedback } from 'react-native';

// DID SOME ANIMATION STUFF TO LEARN HOW TO ANIMATE
// NEXT STEP: MAKE A GAME XD

// https://www.khanacademy.org/partner-content/pixar/sets/rotation/e/rotating-a-point-around-the-origin-2
// learn trigonometri on graphs better

export default class App extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      fadeValue: new Animated.Value(0),
      width: new Animated.Value(100),
      rotateX: 0,
      rotateY: 0,
      oldValue: 0,
    };
    this.timer = null;
    this.stopFunction = this.stopFunction.bind(this);
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

  stopFunction() {
    clearTimeout(this.timer);
  }

  changeDirection = (evt) => {
    /*let locX = evt.nativeEvent.locationX;
    let locY = evt.nativeEvent.locationY;
    let endpoint = Math.atan(locY / locX)
    console.log(`locX: ${locX}, locY: ${locY}`)*/
    let yukseklik = Dimensions.get('window').height;
    let Yprime = evt.nativeEvent.locationX;
    let Xprime = evt.nativeEvent.locationY;

    /*Animated.timing(this.state.rotate, {
      toValue: locX/locY,
      duration: 3000,
      easing: Easing.linear
    }).start();*/

    this.setState({ rotateX: Yprime/yukseklik * 180, oldValue: evt.nativeEvent.locationX + ", " + evt.nativeEvent.locationY })
    //this.timer = setTimeout(this.changeDirection(evt), 200);
  }

  render() {
    // TODO: find a way to rotate the shape while pressing
    // TODO2: ilk baktigi yerin noktasi'ni ikinci tikladigi noktanin degerinden cikar, 
    // bu sana karsi duvari vercek. karsi/hipotenus yap,  
    return (
      <TouchableOpacity style={styles.container} onPressIn={(evt) => this.changeDirection(evt)} onPressOut={(evt) => this.changeDirection(evt)}>
        {/*<Animated.View style={[styles.animationView,
          { opacity: this.state.fadeValue }
          ]}>
        </Animated.View>*/}

        <Animated.View style={[styles.animationView,
          { width: this.state.width },
          { transform:[ { rotateZ: (-this.state.rotateX) + 'deg' }] }
          ]}>
        </Animated.View>

        <TouchableOpacity onPress={this._increaseWidth}>
          <Text style={styles.welcome}>{this.state.oldValue}</Text>
        </TouchableOpacity>


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
