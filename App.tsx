/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {SafeAreaView} from 'react-native';
import { makeNextEventPage } from './src/main/factories/ui/pages/next_event_page_factory';

function App(): React.JSX.Element {
  return <SafeAreaView>{makeNextEventPage()}</SafeAreaView>;
}

export default App;
