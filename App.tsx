/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {SafeAreaView, useColorScheme} from 'react-native';

import {makeNextEventPage} from './src/main/next-event-page-factory';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  return <SafeAreaView>{makeNextEventPage()}</SafeAreaView>;
}

export default App;
