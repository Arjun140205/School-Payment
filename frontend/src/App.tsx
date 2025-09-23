import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';

// Force import CSS at the top level
import './index.css'; 

// Add a direct style tag to ensure basic styles are applied even if CSS imports fail
const inlineStyles = `
  body { font-family: sans-serif; }
  .bg-blue-500 { background-color: #3b82f6 !important; }
  .text-white { color: white !important; }
  .p-4 { padding: 1rem !important; }
  .rounded { border-radius: 0.25rem !important; }
`;

function App() {
  return (
    <>
      {/* Add a style tag to ensure minimal styling even if Tailwind fails */}
      <style>{inlineStyles}</style>
      
      <AuthProvider>
        <ThemeProvider>
          <RouterProvider router={router} />
        </ThemeProvider>
      </AuthProvider>
    </>
  );
}

export default App;