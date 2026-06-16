import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './auth/AuthContext';
import AuthGuard from './auth/AuthGuard';
import { EditorProvider } from './store/EditorContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <AuthGuard>
        <EditorProvider>
          <App />
        </EditorProvider>
      </AuthGuard>
    </AuthProvider>
  </StrictMode>
);
