import { useState, useEffect } from 'react';
import JSONFormatter from './components/JSONFormatter';
import DiffChecker from './components/DiffChecker';
import URLEncoder from './components/URLEncoder';
import JWTDecoder from './components/JWTDecoder';
import Base64Converter from './components/Base64Converter';
import RegexTester from './components/RegexTester';
import { 
  Code, SplitSquareVertical, Link2, KeyRound, Binary, Search, Sun, Moon 
} from 'lucide-react';

const TOOLS = [
  { id: 'json', name: 'JSON Formatter', desc: 'Prettify/Minify JSON', icon: Code, component: JSONFormatter },
  { id: 'diff', name: 'Diff Checker', desc: 'Compare side-by-side texts', icon: SplitSquareVertical, component: DiffChecker },
  { id: 'url', name: 'URL Encoder/Decoder', desc: 'Encode/Decode query params', icon: Link2, component: URLEncoder },
  { id: 'jwt', name: 'JWT Decoder', desc: 'Decode header & payload', icon: KeyRound, component: JWTDecoder },
  { id: 'base64', name: 'Base64 Converter', desc: 'String & file converter', icon: Binary, component: Base64Converter },
  { id: 'regex', name: 'Regex Tester', desc: 'Realtime RegExp builder', icon: Search, component: RegexTester },
];

export default function App() {
  const [activeTool, setActiveTool] = useState('json');
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState(() => localStorage.getItem('devkit_theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('devkit_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const filteredTools = TOOLS.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const CurrentToolComponent = TOOLS.find(t => t.id === activeTool)?.component || JSONFormatter;

  return (
    <div className="devkit-app">
      {/* Sidebar navigation */}
      <aside className="devkit-sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo">🛠️</div>
          <div className="brand-meta">
            <h1>DevKit</h1>
            <span>v1.0.0</span>
          </div>
        </div>

        <div className="sidebar-search">
          <Search size={16} className="search-icon-svg" />
          <input
            type="text"
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <nav className="sidebar-nav">
          {filteredTools.map(tool => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                className={`nav-item ${activeTool === tool.id ? 'active' : ''}`}
                onClick={() => setActiveTool(tool.id)}
              >
                <Icon size={18} className="nav-icon" />
                <div className="nav-text">
                  <span className="nav-name">{tool.name}</span>
                  <span className="nav-desc">{tool.desc}</span>
                </div>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="theme-toggle-btn" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            <span>Theme Toggle</span>
          </button>
        </div>
      </aside>

      {/* Main content viewport */}
      <main className="devkit-main">
        <header className="devkit-header">
          <div className="header-breadcrumbs">
            <span>DevKit</span>
            <span className="separator">/</span>
            <span className="active-path">{TOOLS.find(t => t.id === activeTool)?.name}</span>
          </div>
        </header>
        <div className="devkit-content-wrap">
          <CurrentToolComponent />
        </div>
      </main>
    </div>
  );
}
