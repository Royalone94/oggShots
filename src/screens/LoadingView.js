import React from 'react';
import { StyleSheet, View, Image} from 'react-native';
import ImgSplash from '../images/splash.png';

export default class LoadingView extends React.Component {
		
	componentDidMount() {
		const outcomes = this.props.navigation.getParam('outcomes', []);

		setTimeout(()=> {
			this.props.navigation.navigate('OutcomeReveal', {outcomes: outcomes});
		},2000);
	}

	render(){
		return (
			<View style={styles.styleContainer}>
				<Image source={ImgSplash} style={styles.styleSplash} />
			</View>
		);
	}
}

const styles = StyleSheet.create ({
	styleContainer: {
		flex:1, 
		backgroundColor:'#0C1B33', 
		alignItems:'center', 
		justifyContent:'center'
	},
	styleSplash: {
		marginBottom: 100
	}
})
