import React from 'react';
import { RootStack } from './src/navigation/stacks/RootStack';
import { AuthProvider } from './src/store/AuthContext/AuthContext';


export default function App() {
  return (
    <AuthProvider>
        <RootStack />
    </AuthProvider>
  );
}
