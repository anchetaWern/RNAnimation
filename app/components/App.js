import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  Switch,
  Animated,
  Easing,
  ScrollView,
  Dimensions,
  LayoutAnimation,
  Platform,
  UIManager
} from 'react-native';

var { width } = Dimensions.get('window');

import AnimateNumber from 'react-native-animate-number';
import * as Animatable from 'react-native-animatable';

export class App extends Component {

  constructor(props) {
    super(props);
    this.spinValue = new Animated.Value(0);
    this.scaleValue = new Animated.Value(0);
    this.opacityValue = new Animated.Value(0);
    this.colorValue = new Animated.Value(0);

    this.blue_box_X = new Animated.Value(0);
    this.green_box_X = new Animated.Value(0);

    var animations = [
      {
        animation: 'spin',
        enabled: false
      },
      {
        animation: 'scale',
        enabled: false
      },
      {
        animation: 'opacity',
        enabled: false
      },
      {
        animation: 'colorChange',
        enabled: false
      },
      {
        animation: 'parallelTranslateX',
        enabled: false
      }
    ];
   
    this.state = {
      squares: 0,
      animations: animations,
      animated_number: 10
    }

    if(Platform.OS === 'android'){
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }

  }


  toggleAnimation(animation, value) {
    var animations = this.state.animations;
    var index = animations.findIndex((obj) => {
      return obj.animation == animation;
    });

    animations[index].enabled = value;

    this.setState({
      animations: animations
    });

    animations.forEach((item) => {
      if(item.enabled){
        this[item.animation]();
      }
    });
  }

  spin() {
    this.spinValue.setValue(0);
    Animated.timing(
      this.spinValue,
      {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear
      }
    ).start(() => {
      if(this.state.animations[0].enabled){
        this.spin();
      }
    });
  }

  scale() {
    this.scaleValue.setValue(0);
    Animated.timing(
      this.scaleValue,
      {
        toValue: 1,
        duration: 1500,
        easing: Easing.easeOutBack
      }
    ).start(() => {
      if(this.state.animations[1].enabled){
        this.scale();
      }
    });
  }  

  opacity() {
    this.opacityValue.setValue(0);
    Animated.timing(
      this.opacityValue,
      {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear
      }
    ).start(() => {
      if(this.state.animations[2].enabled){
        this.opacity();
      }
    });
  }


  colorChange() {
    this.colorValue.setValue(0);
    Animated.timing(this.colorValue, {
      toValue: 100,
      duration: 5000
    }).start(() => {
      if(this.state.animations[3].enabled){
        this.colorChange();
      }
    });  

  }

  parallelTranslateX() {
    this.blue_box_X.setValue(0);
    this.green_box_X.setValue(0);
    Animated.parallel([
      Animated.timing(
        this.blue_box_X,
        {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear
        }
      ),
      Animated.timing(
        this.green_box_X,
        {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear
        }
      )        
    ]).start(() => {
      if(this.state.animations[4].enabled){
        this.parallelTranslateX();
      }
    });
  }

  addSquares() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    var squares = this.state.squares;
    
    if(squares == 0){
      this.setState({
        squares: squares + 3 
      }, () => {
        this.refs.squares.zoomInDown(1);
      });
    }else{
      this.setState({
        squares: squares + 3 
      });
    }
  }

  resetSquares() { 
    this.refs.squares.zoomOutUp(1500).then(() => {
      this.setState({
        squares: 0
      });
    });
  }

  renderAnimationsList() {
    return this.state.animations.map((item) => {
      return (
        <View style={styles.item} key={item.animation}>
          <Switch
            onValueChange={(value) => this.toggleAnimation(item.animation, value)}
            style={styles.switch}
            value={item.enabled} />
          <Text style={styles.animation_type}>{item.animation}</Text>
        </View>
      );
    });
  }

  renderSquare(key) {
    return (
      <Animatable.View key={key} style={styles.square} />
    );
  }

  render() {

    const spin = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    });

    const nearFar = this.scaleValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 7, 1]
    });

    const opacity = this.opacityValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 0, 1]
    });

    const blue_box_translateX = this.blue_box_X.interpolate({
      inputRange: [0, 1],
      outputRange: [0, width - 50],
    })

    const green_box_translateX = this.green_box_X.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -width + 50],
    })

    const colorAnimation = this.colorValue.interpolate({
      inputRange: [0, 50, 100],
      outputRange: ['yellow', 'orange', 'red']
    });

    var squares = [];
    for (var i = 0; i < this.state.squares; i++) {
      squares.push(this.renderSquare(i));
    }

    return (
      <View style={styles.container}>
          
        <Animatable.View style={styles.squares_container} ref="squares">
          {squares}
        </Animatable.View>
      
        <AnimateNumber style={styles.number} value={100} countBy={1} />
    
        <Animated.Image
          style={[
            styles.spinner,
            {
              transform: [
                {rotate: spin},
                {scale: nearFar}
              ]
            }
          ]}
            source={{uri: '../../img/loading.png'}}
        />

        <Animated.View style={[
          styles.box, {opacity}, 
          {backgroundColor: colorAnimation},
          ]}
        />
        
        <ScrollView>
        {this.renderAnimationsList()}
        </ScrollView>

        <View>
          <TouchableHighlight style={[styles.button]}  onPress={this.addSquares.bind(this)}>
            <Text>Add Squares</Text>
          </TouchableHighlight>
          <TouchableHighlight style={[styles.button]}  onPress={this.resetSquares.bind(this)}>
            <Text>Reset Squares</Text>
          </TouchableHighlight>
        </View>

        <Animated.View style={[
          styles.box, 
          styles.blue_box, 
          {
            transform: [
              {
                translateX: blue_box_translateX
              }
            ]
          }]} 
        />

        <Animated.View style={[
          styles.box, 
          styles.green_box, 
          {
            transform: [
              {
                translateX: green_box_translateX
              }
            ]
          }
        ]} />
          
      </View>
    );
  }
}

const styles = StyleSheet.create({
 container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column'
  },
  button: {
    height: 40,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },
  item: {
    flex: 2,
    flexDirection: 'row',
    height: 50,
  },
  switch: {
    marginBottom: 10
  },
  animation_type: {
    marginLeft: 10
  },
  spinner: {
    marginTop: 20,
    alignSelf: 'center',
    width: 50,
    height: 50
  },
  box: {
    width: 50,
    height: 50,
    zIndex: 100
  },
  red_box: {
    backgroundColor: 'red',
    marginBottom: 20
  },
  blue_box: {
    alignSelf: 'flex-start',
    backgroundColor: 'blue'
  },
  green_box: {
    alignSelf: 'flex-end',
    backgroundColor: 'green'
  },
  squares_container: {
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap'
  },
  square: {
    width: 35, 
    height: 35, 
    backgroundColor: 'lightblue', 
    margin: 10
  },
  number: {
    fontSize: 20,
    fontWeight: 'bold'
  }
});