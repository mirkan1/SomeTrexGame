import React, { PureComponent } from 'react';
import {Platform, StyleSheet, Text, View, Animated, TouchableOpacity, Dimensions, Easing, TouchableWithoutFeedback } from 'react-native';

// DID SOME ANIMATION STUFF TO LEARN HOW TO ANIMATE
// NEXT STEP: MAKE A GAME XD

// https://www.khanacademy.org/partner-content/pixar/sets/rotation/e/rotating-a-point-around-the-origin-2
// learn trigonometri on graphs better

export default class App extends PureComponent {
  constructor(props) {
    super(props);

    this.displayBullet = [];
    this.displayEnemy= [];

    this.state = {
      enemyWidth: new Animated.Value(30),
      anan: 1,
    };
    this.timer = null;
    this.stopFunction = this.stopFunction.bind(this);
  }

  getRandomColor = () => {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
  }
  
  
  _increaseWidth = (myWidth, topMargin, leftMargin, Xprime, Yprime, key) => {
    console.log(this.state.enemyWidth)
    Animated.parallel([
      Animated.timing(myWidth, {
      toValue: 20,
      duration: 1000,
    }).start(),
      
      Animated.timing(topMargin, {
        toValue: Xprime - 5,
        duration: 1000,
      }).start(),

      Animated.timing(leftMargin, {
        toValue: Yprime - 5,
        duration: 1000,
      }).start(() => {
        this.displayEnemy.length > 0 
      ? 
      Math.abs(this.displayEnemy[this.displayEnemy.length-1].props.style.marginTop - this.displayBullet[this.displayBullet.length-1].ref[0]) <= 30 && Math.abs(this.displayEnemy[this.displayEnemy.length-1].props.style.marginLeft - this.displayBullet[this.displayBullet.length-1].ref[1]) <= 30
        ? (
            Animated.timing(this.state.enemyWidth, { 
              toValue: 0,
              easing: Easing.elastic(2), 
              duration: 1000,
            }).start(() => {
              this.displayEnemy = [];
            })
          )
        : null
      : null;
      })
    ]).start();

    Animated.timing(myWidth, {
      toValue: 0,
      duration: 15000,
    }).start(() => {
      this.displayBullet[key] = null;
      this._disappear()
    });
    
  }

  killEnemy = (enemyWidth) => {
    Animated.timing(enemyWidth, {
      toValue: 0,
      duration: 1000,
    }).start();
  }
  sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
  }

  _disappear = () => {
    // deletes last element after its function done
    // should improve performence
      this.sleep(5000).then(() => {
        if (this.displayBullet[this.displayBullet.length-2] === null) {
          this.displayBullet = [];
          //this.displayBullet.length = this.displayBullet.length - 1;
        }
      });
  }

  stopFunction = () => {
    clearTimeout(this.timer);
  }

  changeDirection = (evt) => {
    let FRONT = [Dimensions.get('window').height / 2, Dimensions.get('window').width / 2];
    //console.log(this.displayBullet) // 187.5, 333.5
    let Yprime = evt.nativeEvent.locationX;
    let Xprime = evt.nativeEvent.locationY;
    let toa = (FRONT[1] - Yprime) / (FRONT[0] - Xprime);
    let result = Xprime < FRONT[1] ? -(Math.atan(toa)) * 180 / 3.14 + 180 : -(Math.atan(toa)) * 180 / 3.14;

    this.setState({ anan: result});
    
    let myWidth =  new Animated.Value(20);
    let marginIt = new Animated.Value(Xprime);

    let topMargin = new Animated.Value(FRONT[0]); 
    let leftMargin = new Animated.Value(FRONT[1]);

    if (this.displayEnemy.length < 1) {
      this.state.enemyWidth.setValue(30);
      // do not delete it
      // make it move to new location
      this.displayEnemy.push(
        <Animated.View 
          style={{
            backgroundColor: 'black',
            width: this.state.enemyWidth,
            height: this.state.enemyWidth,
            position: "absolute", 
            marginTop: Math.random() * Dimensions.get('window').height - 30, 
            marginLeft: Math.random() * Dimensions.get('window').width - 30,
          }}
          key={this.displayEnemy.length}
        >
        </Animated.View>
      );
    }

    this.displayBullet.push(
      <Animated.View 
        style={{
          backgroundColor: this.getRandomColor(),
          width: myWidth,
          height: myWidth,
          position: "absolute", 
          marginTop: topMargin, 
          marginLeft: leftMargin,
          borderRadius: 100/2,
        }}
        key={this.displayBullet.length}
        onPress={this._increaseWidth(myWidth, topMargin, leftMargin, Xprime, Yprime, this.displayBullet.length-1)}
        ref={[Xprime, Yprime]}
      >
      </Animated.View>
    );
  }

  render() {
    console.log(this.displayEnemy)
    return (
      <Animated.View style={styles.container}>
        <View>
          {this.displayBullet}
        </View>

        <View> 
          {this.displayEnemy}
        </View>
          <Animated.View style={[styles.animationView,
            { width: this.state.width },
            { transform:[ { rotateZ: (this.state.anan) + 'deg' }] }
            ]}>
          </Animated.View>
        <TouchableOpacity style={styles.container} onPress={(evt) => {this.changeDirection(evt)}}>        
        
        </TouchableOpacity>
      </Animated.View>
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
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
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
