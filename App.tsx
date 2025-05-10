import React from 'react';
import { RootStack } from './src/navigation/stacks/RootStack';
import { AuthProvider } from './src/store/AuthContext/AuthContext';
import { ThemeProvider } from './src/store/themeContext/ThemeContext';


export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <RootStack />
      </ThemeProvider>
    </AuthProvider>
  );
}
