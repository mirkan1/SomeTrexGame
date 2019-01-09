import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Animated, TouchableOpacity, Dimensions, Easing, TouchableWithoutFeedback } from 'react-native';

// DID SOME ANIMATION STUFF TO LEARN HOW TO ANIMATE
// NEXT STEP: MAKE A GAME XD

// https://www.khanacademy.org/partner-content/pixar/sets/rotation/e/rotating-a-point-around-the-origin-2
// learn trigonometri on graphs better

export default class App extends Component {
  constructor(props) {
    super(props);

    this.displayData = [];

    this.state = {
      fadeValue: new Animated.Value(0),
      width: new Animated.Value(100),
      oldValue: [1, 1],
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
    let FRONT =  [Dimensions.get('window').height / 2, Dimensions.get('window').width / 2];
    console.log(this.displayData) // 187.5, 333.5
    let X = 400;
    let Y = 200;
    let Yprime = evt.nativeEvent.locationX;
    let Xprime = evt.nativeEvent.locationY;
    let result1 = (FRONT[1] - Yprime) / (FRONT[0] - Xprime);
    let result = Xprime < FRONT[1] ? -(Math.atan(result1)) * 180 / 3.14 + 180 : -(Math.atan(result1)) * 180 / 3.14;

    this.setState({ anan: result, oldValue: [Xprime, Yprime] });
    
    this.displayData.push(<View style={{backgroundColor: "black", width:10, height:10, position: "absolute", marginTop: Xprime, marginLeft: Yprime}}></View>);
    this.setState({
      showdata : this.displayData
    });

    //var view = React.createElement(View, [{style: {backgroundColor:"blue", width: 100, height: 100}}], 'hello');
  }

  render() {
    // TODO: find a way to rotate the shape while pressing
    // TODO2: ilk baktigi yerin noktasi'ni ikinci tikladigi noktanin degerinden cikar, 
    // bu sana karsi duvari vercek. karsi/hipotenus yap
    // center is around (200,400)
    // WATAFAAAAK
    return (
      <TouchableOpacity style={styles.container} onPress={(evt) => this.changeDirection(evt)}>

        <View>
          {this.displayData}
        </View>
      
        <Animated.View style={[styles.animationView,
          { width: this.state.width },
          { transform:[ { rotateZ: (this.state.anan) + 'deg' }] }
          ]}>
        </Animated.View>

        {/*
        <View onPress={this._increaseWidth}>
          <Text style={styles.welcome}>{this.state.oldValue[0]}-{this.state.oldValue[1]}</Text>
        </View>
        */}

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
    marginTop: 150,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  animationView: {
    borderStyle: 'solid',
    borderLeftWidth: 50,
    borderRightWidth: 50,
    borderBottomWidth: 50,
    borderTopWidth: 50,
    borderTopColor: 'red',
    alignSelf: 'center',
    position: "absolute",
    marginTop: Dimensions.get('window').height / 2 - 100,
    marginLeft: Dimensions.get('window').width / 2,
  },
  button: {
    backgroundColor: 'steelblue',
    height: 45,
    marginTop: 20,
    alignSelf: 'center',
  }
});
