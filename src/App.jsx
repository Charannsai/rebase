import Chatbot from './components/Chatbot';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-500/30 font-sans flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-slate-900 mb-8 tracking-tight">Example Email Application</h1>
      <Chatbot />
    </div>
  )
}

export default App;
