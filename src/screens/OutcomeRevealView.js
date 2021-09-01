import React, { Component } from 'react';
import { Platform, StyleSheet, View, Vibration, Text, TouchableOpacity, PixelRatio, Image,Animated } from 'react-native';
import {
	responsiveWidth,
	responsiveHeight
} from 'react-native-responsive-dimensions';
import { connect } from 'react-redux';
import Canvas, {Image as CanvasImage}  from 'react-native-canvas';
import { NavigationActions, StackActions } from 'react-navigation'
import ImgHandIcon from '../images/hand-icon.png';
import ImgArrowLeft from '../images/arrow-left.png';

var isPress = false;
var old = null;

class OutcomeRevealView extends React.Component {
	constructor(props, context) {
		super(props, context);
		
	}

	componentDidMount() {
		
	}

	

	render() {
		return (
			<View>

			</View>
		  )
	}
}

const styles = StyleSheet.create({
	styleContainer: {
		flex:1, 
		backgroundColor:'#FFF', 
		alignItems:'center', 
		justifyContent:'center',
	},
	drawSurface: {
		backgroundColor: 'transparent'
	  },
	styleScratch: {
		marginBottom: 100,
		zIndex:100
	},
	WebViewStyle:
	{
		justifyContent: 'center',
		alignItems: 'center',
		flex:1,
		marginTop: (Platform.OS) === 'ios' ? 20 : 0,
		backgroundColor:'transparent'
	},
	styleRevealText: {
		fontSize: 16,
		color: '#000',
		marginLeft:20,
		fontFamily:'Museo Sans'
	},
	styleHand: {
		position: 'absolute',
		bottom:responsiveHeight(5),
		left:0, 
		right: 0,
		justifyContent:'center',
		alignItems:'center',
		flexDirection: 'row',
		textAlign:'center',
		height:responsiveHeight(10)
	},
	styleCenter: {
		position: 'absolute',
		bottom:0,
		top:0,
		left:0, 
		right: 0,
		justifyContent:'center',
		alignItems:'center',
		flexDirection: 'row',
		textAlign:'center',
	}
})

const mapStateToProps = ({ }) => {
	return {
	};
};

export default connect(mapStateToProps, {
})(OutcomeRevealView);

