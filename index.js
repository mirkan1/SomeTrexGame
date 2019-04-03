import React, { PureComponent } from 'react';
import {
  Platform,
  AppRegistry, 
  StyleSheet, 
  StatusBar,
  Text,
  View,
  Animated,
  TouchableOpacity,
  Dimensions,
  Easing,
  TouchableWithoutFeedback,
  PanResponder,
} from 'react-native';
import {name as appName } from './app.json';
//import { Constants } from 'expo';
import Menu from './Menu';

// OYUNUN MANTIGI
// Bir obje var bu objeye vurdugun zaman yer degıstırıyor.
// Eger ıskalarsan yanıyorsun ve bastan baslamak zorunda kalıyorsun.
// Ana karakter Trex

//BUG:
// if you click one area, then click the same area again, the animation doesnt start but it do work
const WINDOW = Dimensions.get('window');

export default class BestGameEver extends PureComponent {
  constructor(props) {
    super(props);

    this.displayBullet = [];
    this.displayEnemy = [];

    const position = new Animated.ValueXY();
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gest) => {
        // cektigin yonun tersine bir uzama yarat
        // cektigin kadar diger tarftan uzasin
        //position.setValue({ x: gest.dx, y: gest.dy });

        let FRONT = [WINDOW.height / 2, WINDOW.width / 2];

        let Y = evt.nativeEvent.locationX;
        let X = evt.nativeEvent.locationY;
        let toa = (FRONT[1] - Y) / (FRONT[0] - X);
        let stickHeight =
          X < FRONT[1] ? Math.abs(FRONT[1] - Y) : Math.abs(FRONT[0] - X);
        let result =
          X < FRONT[1]
            ? (-Math.atan(toa) * 180) / Math.PI + 180
            : (-Math.atan(toa) * 180) / Math.PI;
        this.setState({
          deg: result,
          stickHeight: stickHeight,
          //arrowHeight: X
        });
      },
      onPanResponderRelease: (evt, gest) => {
        Animated.spring(this.state.position, {
          toValue: { x: 0, y: 0 },
        }).start(),
          this.changeDirection(evt);
      },
    });

    this.state = {
      stickHeight: 0,
      directionResult: 1,
      deg: 20,
      score: 0,
      arrow: new Animated.Value(),
      arrowWidth: 25,
      arrowHeight: WINDOW.height / 12,
      enemyWidth: new Animated.Value(30),
      enemyMarginTop: new Animated.Value(Math.random() * WINDOW.height - 30),
      enemyMarginLeft: new Animated.Value(Math.random() * WINDOW.width - 30),
      position,
      panResponder,
    };
  }

  getRandomColor = () => {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  shootBullet = (myWidth, topMargin, leftMargin, X, Y, key) => {
    Animated.parallel([
      Animated.timing(myWidth, {
        toValue: 20,
        duration: 1000,
      }).start(),
      Animated.timing(topMargin, {
        toValue: X,
        duration: 1000,
      }).start(),
      Animated.timing(leftMargin, {
        toValue: Y,
        duration: 1000,
      }).start(() => {
        let enemyMarginTop = JSON.stringify(
          this.displayEnemy[this.displayEnemy.length - 1].props.style.marginTop
        ); // diger turly {object object} diyor hata veriyor
        let enemyMarginLeft = JSON.stringify(
          this.displayEnemy[this.displayEnemy.length - 1].props.style.marginLeft
        ); // diger turly {object object} diyor hata veriyor
        let bullet = this.displayBullet[this.displayBullet.length - 1].ref[0];
        /*console.log(
          Math.abs(
            enemyMarginTop +
              WINDOW.height -
              this.displayBullet[this.displayBullet.length - 1].ref[0]
          ),
          Math.abs(
            enemyMarginLeft +
              WINDOW.width -
              this.displayBullet[this.displayBullet.length - 1].ref[1]
          )
        );*/
        this.displayEnemy.length > 0
          ? Math.abs(
              enemyMarginTop -
                this.displayBullet[this.displayBullet.length - 1].ref[0]
            ) <= 30 &&
            Math.abs(
              enemyMarginLeft -
                this.displayBullet[this.displayBullet.length - 1].ref[1]
            ) <= 30
            ? (this.changeEnemyLocation(),
              // skor degisimi, eger 0sa ayni kalsin diger turlu skoreu yazsin
              this.setState({ score: this.state.score + 1 }))
            : this.setState({
                score:
                  this.state.score > 0
                    ? this.state.score - 1
                    : this.state.score,
              })
          : null;
      }),
    ]).start();

    Animated.timing(myWidth, {
      toValue: 0,
      duration: 15000,
    }).start(() => {
      this.displayBullet[key] = null;
      this._disappear();
    });
  };

  changeEnemyLocation = () => {
    // enemywidthden daha fazla olmasin ki ekran disina tasmasin
    return Animated.parallel([
      Animated.timing(this.state.enemyWidth, {
        toValue: 15,
        easing: Easing.elastic(2),
        duration: 500,
      }).start(),
      Animated.timing(this.state.enemyMarginTop, {
        // make value so it cannot go out of screen
        // something like cannot be lower than 10 or higher than 500
        // closedMenu height is 60
        // 30 is enemyWidth
        // Math.random() * (max - min) + min
        toValue: Math.random() * (WINDOW.height - (60 + 30)) + (60 + 30),
        duration: 1000,
      }).start(),
      Animated.timing(this.state.enemyMarginLeft, {
        toValue: Math.random() * (WINDOW.width - 30),
        duration: 1000,
      }).start(() => {
        Animated.timing(this.state.enemyWidth, {
          toValue: 30,
          duration: 500,
        }).start();
      }),
    ]);
  };

  _disappear = () => {
    // deletes last element after its function done
    // should improve performence
    if (this.displayBullet[this.displayBullet.length - 2] === null) {
      return (this.displayBullet = []);
      //this.displayBullet.length = this.displayBullet.length - 1;
    }
  };

  changeDirection = evt => {
    let FRONT = [WINDOW.height / 2, WINDOW.width / 2];
    // top-left (0, 0)
    // bottom-left (575*, 0) final X location
    // top-right (0, 350*) final Y location
    // bottom-right (350*, 575*)
    let X = evt.nativeEvent.locationY;
    let Y = evt.nativeEvent.locationX;
    let toa = (FRONT[1] - Y) / (FRONT[0] - X);
    let result =
      X < FRONT[1]
        ? (-Math.atan(toa) * 180) / Math.PI + 180
        : (-Math.atan(toa) * 180) / Math.PI;

    this.setState({ directionResult: result });

    let myWidth = new Animated.Value(20);
    let marginIt = new Animated.Value(X);

    let topMargin = new Animated.Value(FRONT[0]);
    let leftMargin = new Animated.Value(FRONT[1]);
    /*
      // X arttiginda ve Y arttiginda; X == WINDOW.height veya Y == WINDOW.width oldugunda diger deger kac?
      if (X2 - WINDOW.height / 2 > 0 && Y2 -  WINDOW.width / 2 > 0) {
        X_son = (orjX-X1/orjY-Y1)-Y1;
        Y_son = 
      }

      // X azaldiginda ve Y arttiginda; X == 0 veya Y == WINDOW.width oldugunda diger deger kac?

      // X azaldiginda ve Y azaldiginda; X == 0 veya Y == 0 oldugunda diger deger kac?
      if (X2 - WINDOW.height / 2 < 0 && Y2 -  WINDOW.width / 2 < 0) {
        X_son = (orjX-X1/orjY-Y1)-Y1;
        Y_son = 0;
      }
      // X arttiginda ve Y azaldiginda; X == WINDOW.height veya Y == 0 oldugunda diger deger kac?
    */

    var Xorigin = WINDOW.height / 2;
    var Yorigin = WINDOW.width / 2;
    var X1 = X; //WINDOW.height - X;
    var Y1 = Y; //WINDOW.width - Y;
    var Y_son = (WINDOW.height - Xorigin) / (X1 - Xorigin / Y1 - Yorigin) + Yorigin;
    var X_son = WINDOW.height - 25;

    //console.log(Xorigin,Yorigin);
    console.log(X1,Y1);
    //505.69195556640625 229.41964721679688
    //console.log(X1 - WINDOW.height / 2, Y1 - WINDOW.width / 2);
    //console.log(WINDOW.height, WINDOW.width);

    if (X1 - WINDOW.height / 2 < 0 && Y1 - WINDOW.width / 2 < 0) {
      X_son = X1 + X1 - Xorigin > 0 ? X1 + X1 - Xorigin : 0;
      Y_son = Y1 + Y1 - Yorigin > 0 ? Y1 + Y1 - Yorigin : 0;
    } else if (X1 - WINDOW.height / 2 > 0 && Y1 - WINDOW.width / 2 > 0) {
       X_son = X1 + X1 - Xorigin > 0 ? X1 + X1 - Xorigin : 0;
      Y_son = Y1 + Y1 - Yorigin > 0 ? Y1 + Y1 - Yorigin : 0;

/*       let X_space = X1 - Xorigin;
      let Y_space = Y1 - Yorigin;
      let count = 1;
      X_son = X1;
      for (i=X_space;i<WINDOW.width;i+=X_space) {
        X_son += i;
        Y_son = Y1 + (Y_space*count);
        count += 1;
      } */
      /* X_son = WINDOW.height - X1;
      Y_son = 0; //WINDOW.height; */
    } else if (X1 - WINDOW.height / 2 > 0 && Y1 - WINDOW.width / 2 <= 0) {
      X_son = WINDOW.height - X1;
      Y_son = WINDOW.width - 25; //WINDOW.height;
    } else if (X1 - WINDOW.height / 2 <= 0 && Y1 - WINDOW.width / 2 > 0) {
/*       for (i=0;i<=0;i*=X1 - WINDOW.height / 2) {

      } */
      console.log(Xorigin,Yorigin);
      console.log(X1,Y1);
      console.log(X1 - WINDOW.height / 2, Y1 - WINDOW.width / 2);
      console.log(WINDOW.height, WINDOW.width);
      if (Math.abs(X1) > Math.abs(Y1)) {
        X_son = WINDOW.height - X1;
        Y_son = WINDOW.width - 25; //WINDOW.height;
      } else {
        X_son = WINDOW.height - 25;
        Y_son = WINDOW.width - Y1; //WINDOW.height;
      }
/*      
341.7142857142857 205.71428571428572 b2b04ae1-6e8f-45fc-9958-853d7204c31d:1531:9
550.8258666992188 317.98828125 b2b04ae1-6e8f-45fc-9958-853d7204c31d:1532:9
209.11158098493303 112.27399553571428 b2b04ae1-6e8f-45fc-9958-853d7204c31d:1533:9
683.4285714285714 411.42857142857144 ENDPOINT BOTTOM LEFT

341.7142857142857 205.71428571428572 fed3975c-3532-49f1-8587-9dbf9da460d6:1531:9
607.1205444335938 317.98828125 fed3975c-3532-49f1-8587-9dbf9da460d6:1532:9
265.406258719308 112.27399553571428 fed3975c-3532-49f1-8587-9dbf9da460d6:1533:9
683.4285714285714 411.42857142857144 ENDPOINT TOP RIGHT
*/
    }

    /*
    if (X2 - WINDOW.height / 2 > 0 && Y2 -  WINDOW.width / 2 > 0) {
      if (X2 > Y2) {
        X_son = WINDOW.height - 25;
        Y_son = (WINDOW.width / X2) * Y2;
        //if (Y_son > WINDOW.width) {
        //  Y_son = WINDOW.width - 25;
        //}
      } else if (X2 < Y2) {
        X_son = (WINDOW.width / Y2) * X2;
        Y_son = WINDOW.width - 25;
      }
    }*/

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
            position: 'absolute',
            marginTop: this.state.enemyMarginTop,
            marginLeft: this.state.enemyMarginLeft,
          }}
          key={this.displayEnemy.length}
        />
      );
    }

    this.displayBullet.push(
      <Animated.View
        style={{
          backgroundColor: this.getRandomColor(),
          width: myWidth,
          height: myWidth,
          position: 'absolute',
          marginTop: topMargin,
          marginLeft: leftMargin,
          borderRadius: 100 / 2,
        }}
        key={this.displayBullet.length}
        onPress={this.shootBullet(
          myWidth,
          topMargin,
          leftMargin,
          /*
          X
          Y
          let X2 = WINDOW.height - X;
          let Y2 = WINDOW.width - Y;
          let X_artis = X2 - X;
          let Y_artis = Y2 - Y;
          let X_son = (WINDOW.height / X_artis) * X_artis;
          let Y_son = (WINDOW.height / Y_artis) * Y_artis;
          */
          X_son,
          Y_son,
          this.displayBullet.length - 1
        )}
        ref={[WINDOW.height - X, WINDOW.width - Y]}
      />
    );
  };

  render() {
    return (
      <Menu
        style={styles.container}
        buttonStyle={styles.button}
        score={this.state.score}>
        <Animated.View
          {...this.state.panResponder.panHandlers}
          style={[
            this.state.position.getLayout(),
            { height: '100%', width: '100%', backgroundColor: '#D3D3D3' },
          ]}>
          <View>{this.displayBullet}</View>
          <View>{this.displayEnemy}</View>
          <Animated.Image
            style={[
              {
                transform: [{ rotateZ: this.state.deg + 'deg' }],
                width: this.state.arrowWidth,
                height: this.state.arrowHeight,
                alignSelf: 'center',
                marginTop: WINDOW.height / 2 - this.state.arrowHeight / 2,
                position: 'absolute',
              },
            ]}
            source={{
              uri:
                'https://www.gravatar.com/avatar/dd47498503c755ffb2dd760de889fcc5?s=32&d=identicon&r=PG',
            }}
          />
          <Animated.View
            style={{
              transform: [{ rotateZ: this.state.deg + 'deg' }],
              width: 5,
              height: this.state.stickHeight,
              backgroundColor: 'red',
              marginLeft: WINDOW.width / 2,
              marginTop: WINDOW.height / 2 - this.state.arrowHeight / 2,
              position: 'absolute',
            }}
          />
        </Animated.View>
        <StatusBar hidden={true} />

      </Menu>
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
    position: 'absolute',
    marginTop: WINDOW.height / 2 - 100,
    marginLeft: WINDOW.width / 2,
  },
  button: {
    backgroundColor: 'steelblue',
    height: 45,
    marginTop: 20,
    alignSelf: 'center',
  },
});

AppRegistry.registerComponent(appName, () => BestGameEver);
//AppRegistry.registerComponent("BestGameEver", () => tryit);