/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducers from './src/reducers';
import ReduxThunk from 'redux-thunk';
import InputOutComeView from './src/screens/InputOutComeView';
import LoadingView from './src/screens/LoadingView';
import OutcomeRevealView from './src/screens/OutcomeRevealView';


import { createStackNavigator,createAppContainer } from 'react-navigation';
// global.__DEV__=false;
// global.__DEV__=false;
// global.__DEV__=false;
// global.__DEV__=false;
const RootStack = createStackNavigator({
  InputOutcome: {screen: InputOutComeView, navigationOptions:{header:null, gesturesEnabled: false}},
  Loading: {screen: LoadingView, navigationOptions:{header:null,gesturesEnabled: false}},
  OutcomeReveal: {screen: OutcomeRevealView, navigationOptions:{header:null,gesturesEnabled: false}},
});

const AppContainer = createAppContainer(RootStack);

const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));

class Oggs extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    );
  }
}

AppRegistry.registerComponent(appName, () =>  Oggs);

