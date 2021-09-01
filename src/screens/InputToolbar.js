
import React from 'react'
import {
  StyleSheet,
  View,
  Keyboard,
  TextInput,
  TouchableOpacity,
  Image,
  Button
} from 'react-native'

import ImgAddOutcome from '../images/add-icon.png';

const styles = {
  container: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#b2b2b2',
    backgroundColor: '#fff',
    bottom: 0,
    left: 0,
    right: 0,
  },
  primary: {
    flexDirection: 'row',
    justifyContent:'space-between',
    marginLeft:5,
    marginRight:5,
    paddingVertical:5
  },
};

export default class InputToolbar extends React.Component{
  state = {
    position: 'absolute',
    text:''
  }


  componentWillMount() {
    this.keyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow',
      this.keyboardWillShow,
    )
    this.keyboardWillHideListener = Keyboard.addListener(
      'keyboardWillHide',
      this.keyboardWillHide,
    )
  }

  componentWillUnmount() {
    if (this.keyboardWillShowListener) {
      this.keyboardWillShowListener.remove()
    }
    if (this.keyboardWillHideListener) {
      this.keyboardWillHideListener.remove()
    }
  }

  keyboardWillShow = () => {
    if (this.state.position !== 'relative') {
      this.setState({
        position: 'relative',
      })
    }
  }

  keyboardWillHide = () => {
    if (this.state.position !== 'absolute') {
      this.setState({
        position: 'absolute',
      })
    }
  }

  onChangeText = (text) => {
    this.setState({text});
    this.props.onChangeOutCome(text);
  }

  onAddOutCome = () => {
    this.props.onAddOutCome();
    this.setState({text:''});
  }

  onSubmitEditing= () => {
    this.props.onSubmitEditing();
  }

  render() {
    return (
      <View
        style={
          [
            styles.container,
            { position: this.state.position },
          ]
        }
      >
        <View style={[styles.primary]}>
          <TextInput 
            accessible 
            placeholder={'Add an outcome'} 
            autoFocus={true}
            onSubmitEditing={this.onSubmitEditing.bind(this)}
            style={{ flex:1, fontFamily: 'Museo Sans',borderRadius: 30, borderColor:'#EEE', borderWidth: 1, paddingHorizontal: 10,}}
            value={this.state.text}
            onChangeText = {this.onChangeText.bind(this)}
            keyboardType="default"
            returnKeyType="done"
            underlineColorAndroid='transparent'/>
          {/* <TouchableOpacity onPress={this.onAddOutCome.bind(this)}><Image source={ImgAddOutcome} /></TouchableOpacity> */}
          <Button
							onPress={() => {
								this.onAddOutCome();
							}}
							title="Add"
						/>
        </View>
      </View>
    )
  }
}
