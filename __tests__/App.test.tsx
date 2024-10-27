/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';

// Note: import explicitly to use the types shipped with jest.
import {expect, it} from '@jest/globals';

// Note: test renderer must be required after react-native.
import {render, screen} from '@testing-library/react-native';

it('renders correctly', () => {
  render(<App />);

  expect(
    screen.getByText('Read the docs to discover what to do nxt:'),
  ).toBeTruthy();
});
