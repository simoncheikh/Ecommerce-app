import React from 'react';
import { RootStack } from './src/navigation/stacks/RootStack';
import { ThemeProvider } from './src/store/themeContext/ThemeContext';


export default function App() {
  return (
      <ThemeProvider>
        <RootStack />
      </ThemeProvider>
  );
}
