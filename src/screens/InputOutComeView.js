import React from 'react';
import { Platform, Dimensions, Button, StyleSheet, View, Text, Keyboard, Image, TouchableOpacity, ScrollView, TextInput, Animated , InputAccessoryView} from 'react-native';
import {
	responsiveWidth,
	responsiveHeight
} from 'react-native-responsive-dimensions';
import ImgLogo from '../images/logo.png';
import ImgBin from '../images/bin.png';
import { connect } from 'react-redux';
import { BoxShadow } from 'react-native-shadow'
import { SafeAreaView } from 'react-navigation';
import InputToolbar from './InputToolbar';

// console.disableYellowBox = true;

const shadowOpt = {
	width: responsiveWidth(100) - 40,
	height: 80,
	color: '#dce3ee',
	border: 6,
	opacity: 0.8,
	radius: 5,
	alignItems: 'center',
	justifyContent: 'center',
	x: 0,
	y: 3,
}

const elementShadowOpt = {
	width: responsiveWidth(100) - 40,
	height: 70,
	color: '#dce3ee',
	border: 1,
	radius: 20,
	opacity: 0.2,
	alignItems: 'center',
	justifyContent: 'center',
	x: 0,
	y: 5,
}

export const MIN_COMPOSER_HEIGHT = Platform.select({
	ios: 33,
	android: 41,
});
export const MAX_COMPOSER_HEIGHT = 200;

class InputOutComeView extends React.Component {
	state = {
		isInitialized: false,
		readOnly: false,
		disabled: false,
		input_outcome: '',
		floatingKeyboard: false,
		composerHeight: this.props.minComposerHeight,
		messagesContainerHeight: undefined,
		outcomes: [
		],

		_bottomOffset:0,

		lastOutcomeOpacity: new Animated.Value(0),
		lastPaddingTop: new Animated.Value(25),
	}

	_keyboardHeight = 0
	_bottomOffset = 0
	
	constructor(props) {
		super(props);
		this.invertibleScrollViewProps = {
			inverted: this.props.inverted,
			keyboardShouldPersistTaps: this.props.keyboardShouldPersistTaps,
			onKeyboardWillShow: this.onKeyboardWillShow,
			onKeyboardWillHide: this.onKeyboardWillHide,
			onKeyboardDidShow: this.onKeyboardDidShow,
			onKeyboardDidHide: this.onKeyboardDidHide,
		}
	}

	static defaultProps = {
		minComposerHeight: MIN_COMPOSER_HEIGHT,
		maxComposerHeight: MAX_COMPOSER_HEIGHT,
		isAnimated : true,
		minInputToolbarHeight: 44,
		bottomOffset:0,
		keyboardShouldPersistTaps: Platform.select({
			ios: 'never',
			android: 'always',
		  }),
	}

	componentDidMount() {
		this.attachKeyboardListeners();
	}

	attachKeyboardListeners = () => {
		const { invertibleScrollViewProps: invertibleProps } = this;
		if (invertibleProps) {
			Keyboard.addListener(
				'keyboardWillShow',
				invertibleProps.onKeyboardWillShow,
			)
			Keyboard.addListener('keyboardDidShow', invertibleProps.onKeyboardDidShow)
			Keyboard.addListener(
				'keyboardWillHide',
				invertibleProps.onKeyboardWillHide,
			)
			Keyboard.addListener('keyboardDidHide', invertibleProps.onKeyboardDidHide)
		}
	}

	componentWillUnmount() {

	}

	shuffle = (a) => {
		for (let i = a.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[a[i], a[j]] = [a[j], a[i]];
		}
		return a;
	}

	onPlay = () => {
		Keyboard.dismiss();
		let { outcomes } = this.state;
		outcomes = this.shuffle(outcomes);
		this.props.navigation.navigate('OutcomeReveal', { outcomes: outcomes });
		this.setState({ outcomes: [] })
	}

	onKeyboardWillShow = (e) => {
		this.setKeyboardHeight(
		  e.endCoordinates ? e.endCoordinates.height : e.end.height,
		)
		this.setBottomOffset(this.props.bottomOffset)

		const newMessagesContainerHeight = this.getMessagesContainerHeightWithKeyboard()
		
		if (this.props.isAnimated === true) {
		  if(newMessagesContainerHeight)
		  	Animated.timing(this.state.messagesContainerHeight, {
				toValue: newMessagesContainerHeight,
				duration: 210,
		  }).start()
		} else {
		  this.setState({
			messagesContainerHeight: newMessagesContainerHeight,
		  })
		}

	  }
	
	onKeyboardWillHide = (e) => {
		this.setKeyboardHeight(0)
		this.setBottomOffset(0)
		const newMessagesContainerHeight = this.getBasicMessagesContainerHeight()
		if (this.props.isAnimated === true) {
			Animated.timing(this.state.messagesContainerHeight, {
			toValue: newMessagesContainerHeight,
			duration: 210,
			}).start()
		} else {
			this.setState({ messagesContainerHeight: newMessagesContainerHeight});
		}
	}

	onKeyboardDidShow = (e) => {
		if (Platform.OS === 'android') {
			this.onKeyboardWillShow(e)
		}
	}

	onKeyboardDidHide = (e) => {
		if (Platform.OS === 'android') {
			this.onKeyboardWillHide(e)
		}
	}

	onClear = () => {
		this.setState({ outcomes: [] });
	}

	renderEnabledPlayButton = () => {
		return (
			<TouchableOpacity onPress={this.onPlay.bind(this)} style={{ borderRadius: 5, backgroundColor: '#3A86FF', paddingVertical: 10, paddingHorizontal: 15 }}>
				<Text style={{ color: 'white', fontFamily: 'Museo Sans', fontSize: 22, fontWeight: '500' }}>PLAY</Text>
			</TouchableOpacity>
		);
	}

	renderDisabledPlayButton = () => {
		return (
			<TouchableOpacity disabled={true} onPress={this.onPlay.bind(this)} style={{ borderRadius: 5, backgroundColor: 'transparent', paddingVertical: 10, paddingHorizontal: 15 }}>
				<Text style={{ color: '#b1bdd1', fontFamily: 'Museo Sans', fontSize: 22, fontWeight: '500' }}>PLAY</Text>
			</TouchableOpacity>
		);
	}

	renderEnabledClearButton = () => {
		return (
			<TouchableOpacity onPress={this.onClear.bind(this)} style={{ borderRadius: 5, backgroundColor: 'transparent', paddingVertical: 10, paddingHorizontal: 15 }}>
				<Text style={{ color: '#0c1b33', fontFamily: 'Museo Sans', fontSize: 22, fontWeight: '500' }}>Clear</Text>
			</TouchableOpacity>
		);
	}

	renderDisabledClearButton = () => {
		return (
			<TouchableOpacity onPress={this.onClear.bind(this)} style={{ borderRadius: 5, backgroundColor: 'transparent', paddingVertical: 10, paddingHorizontal: 15 }}>
				<Text style={{ color: '#b1bdd1', fontFamily: 'Museo Sans', fontSize: 22, fontWeight: '500' }}>Clear</Text>
			</TouchableOpacity>
		);
	}

	onAddOutCome = () => {
		var new_outcome = new Object();
		new_outcome.title = this.state.input_outcome;

		var outcomes = this.state.outcomes;
		if (this.state.input_outcome == '') {
			return;
		}
		outcomes.push(new_outcome);

		this.setState({ outcomes:outcomes, lastOutcomeOpacity: new Animated.Value(0), lastPaddingTop: new Animated.Value(25)}, ()=> {
			Animated.parallel([
				Animated.timing(this.state.lastOutcomeOpacity, {
					toValue: 1,
					duration: 300
				}),
				Animated.timing(this.state.lastPaddingTop, {
					toValue: 5,
					duration: 300
				})
			]).start(() => {
				
			});
		});

		this.setState({ input_outcome: '' });
	}

	OnRemoveOutCome = (index) => {
		Keyboard.dismiss();
		var outcomes = this.state.outcomes;
		outcomes.splice(index, 1);
		this.setState({ outcomes });
	}


	setMaxHeight(height) {
		this._maxHeight = height
	}

	getMaxHeight() {
		return this._maxHeight
	}

	getBasicMessagesContainerHeight(composerHeight = this.state.composerHeight) {
		if(Platform.OS === 'android')
		return (
			this.getMaxHeight() - this.calculateInputToolbarHeight(composerHeight)
		)
		else
			return this.getMaxHeight();
	}

	getMinInputToolbarHeight() {
		return this.props.minInputToolbarHeight
	}

	calculateInputToolbarHeight(composerHeight) {
		return (
			composerHeight +
			(this.getMinInputToolbarHeight() - this.props.minComposerHeight)
		)
	}

	isIphoneX() {
		const dimen = Dimensions.get('window');
		return (
			Platform.OS === 'ios' &&
			!Platform.isPad &&
			!Platform.isTVOS &&
			((dimen.height === 812 || dimen.width === 812) || (dimen.height === 896 || dimen.width === 896))
		);
	}
	
	ifIphoneX(iphoneXStyle, regularStyle) {
		if (this.isIphoneX()) {
			return iphoneXStyle;
		}
		return regularStyle;
	}
	
	getStatusBarHeight(safe) {
		return Platform.select({
			ios: this.ifIphoneX(safe ? 44 : 30, 20),
			android: StatusBar.currentHeight
		});
	}
	
	getBottomSpace() {
		return this.isIphoneX() ? 34 : 0;
	}

	getMessagesContainerHeightWithKeyboard(
		composerHeight = this.state.composerHeight) {
	
		if(Platform.OS === 'android')
			return (
				this.getBasicMessagesContainerHeight(composerHeight) -
				this.getKeyboardHeight() +
				this.getBottomOffset()
			)
		else 
		return (
			
			this.getBasicMessagesContainerHeight(composerHeight) -
				this.getKeyboardHeight() +
				this.getBottomOffset() + this.getBottomSpace()
		)
	}

	setBottomOffset(value) {
		this.setState({_bottomOffset : value});
	}

	getBottomOffset() {
		return this.state._bottomOffset;
	}

	setKeyboardHeight(height) {
		this._keyboardHeight = height;
	}

	getKeyboardHeight() {
		return this._keyboardHeight
	}

	onInitialLayoutViewLayout = (e) => {
		const { layout } = e.nativeEvent
		if (layout.height <= 0) {
			return
		}


		this.setMaxHeight(layout.height)


		const newComposerHeight = this.props.minComposerHeight
		
		const newMessagesContainerHeight = this.getMessagesContainerHeightWithKeyboard(
			newComposerHeight,
		)

		this.setState({
			isInitialized: true,
			composerHeight: newComposerHeight,
			messagesContainerHeight: this.prepareMessagesContainerHeight(
				newMessagesContainerHeight,
			),
		})
	}

	prepareMessagesContainerHeight(value) {
		if (this.props.isAnimated === true) {
		  return new Animated.Value(value)
		}
		return value
	}

	onChangeOutCome = (input_outcome) => {
		this.setState({ input_outcome });
	}

	onSubmitEditing = () => {
		this.setState({floatingKeyboard: false});
	}

	renderContent = () => {
		const inputAccessoryViewID = "uniqueID";
		return (
			<SafeAreaView style={{ backgroundColor: '#ffffff', height:  this.state.messagesContainerHeight }} keyboardShouldPersistTaps>
					
					<View style={{ backgroundColor: 'white', height: responsiveHeight(12), justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', paddingHorizontal: 20 }}>
						{this.state.outcomes.length > 0 ? this.renderEnabledClearButton() : this.renderDisabledClearButton()}
						<Image source={ImgLogo} style={{ width: 70, height: 50 }} resizeMode="contain"></Image>
						{this.state.outcomes.length > 0 ? this.renderEnabledPlayButton() : this.renderDisabledPlayButton()}
					</View>

					<TextInput
						style={{
						padding: 10,
						position:'absolute',
						top: 0,
						color:'white'
						}}
						ref='hiddenInput'
						autoFocus
						caretHidden  = {true}
						inputAccessoryViewID={inputAccessoryViewID}
						onChangeText={text => this.setState({text})}
						value={this.state.text}
					/>

				{Platform.OS === 'ios'?<InputAccessoryView nativeID={inputAccessoryViewID}>
					<View style={{
						borderTopWidth: StyleSheet.hairlineWidth,
						borderTopColor: '#b2b2b2',
						backgroundColor: '#fff',
						flexDirection: 'row',
						justifyContent:'space-between',
						paddingLeft:5,
						paddingRight:5,
						paddingVertical:5,
					}}>
						<TextInput
							accessible
							placeholder={'Add an outcome'}
							autoFocus={true}
							ref='floatingInput'
							style={{ borderRadius: 30, borderColor:'#EEE', borderWidth: 1, paddingHorizontal: 10,  backgroundColor: 'white', flex: 1, fontFamily: 'Museo Sans' }}
							value={this.state.input_outcome}
							inputAccessoryViewID={inputAccessoryViewID}
							onChangeText={input_outcome => this.setState({ input_outcome })}
							keyboardType="default"
							returnKeyType="done"
							underlineColorAndroid='transparent' />
						<Button
							onPress={() => {
								this.onAddOutCome();
								this.setState({input_outcome:''});
							}}
							title="Add"
						/>
					</View>
				</InputAccessoryView>:null}

					<View style={{ width: responsiveWidth(100), height:1, backgroundColor:'#E5ECF4', }}></View>
					
					<ScrollView style={{backgroundColor: '#f5f7fa', paddingTop:20, paddingBottom:20}}  ref="scrollView" onContentSizeChange={(width,height) => this.refs.scrollView.scrollTo({y:height})}>
						<View>
							{
								this.state.outcomes.map((item, index) => (

									<Animated.View style={{ backgroundColor: '#f5f7fa', paddingLeft: 20, paddingRight: 20, paddingTop: (index===this.state.outcomes.length-1) ?this.state.lastPaddingTop :5, paddingBottom: 7, opacity: (index===this.state.outcomes.length-1) ?this.state.lastOutcomeOpacity:1 }}>
										<BoxShadow setting={elementShadowOpt} style={{ justifyContent: 'center', alignItems: 'center' }}>
											<View style={{ borderRadius: 6, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 }}>
												<Text style={styles.styleName}>{item.title}</Text>
												<TouchableOpacity onPress={() => this.OnRemoveOutCome(index)}><Image source={ImgBin} style={{ tintColor: '#FB5396' }} /></TouchableOpacity>
											</View>
										</BoxShadow>
									</Animated.View>
								))
							}
						</View>
					</ScrollView>


				</SafeAreaView>
		)
	};

	onTouchStart = () => {
		if(this.refs.hiddenInput) {
			this.refs.hiddenInput.focus();
			this.refs.floatingInput.focus();
		}
	}

	render() {
		if (this.state.isInitialized === true) {
			return (
				<View  onTouchStart={this.onTouchStart.bind(this)} style={styles.container} keyboardShouldPersistTaps>
					{this.renderContent()}
					{Platform.OS === 'android'?<InputToolbar onSubmitEditing={this.onSubmitEditing.bind(this)} onAddOutCome = {this.onAddOutCome.bind(this)} onChangeOutCome={this.onChangeOutCome.bind(this)}/>:null}
			  	</View>
			);
		}
		else
			return (
				<View style={styles.container} onLayout={this.onInitialLayoutViewLayout}>

				</View>
			)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f7fa'
	},
	styleShadow: {
		borderRadius: 5,
	},
	styleName: {
		flex: 1,
		backgroundColor: 'transparent',
		color: '#0c1b33',
		justifyContent: 'center',
		fontSize: 24,
		marginLeft: 20,
		fontFamily: 'Museo Sans',
		fontWeight: '300'
	}
})

const mapStateToProps = ({ }) => {
	return {
	};
};

export default connect(mapStateToProps, {
})(InputOutComeView);
