
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Force set the direction to RTL for the entire application
document.documentElement.dir = "rtl";
document.documentElement.lang = "he";

// Create root and render application
createRoot(document.getElementById("root")!).render(<App />);
