import { useState, useEffect } from 'react';
import JSONFormatter from './components/JSONFormatter';
import DiffChecker from './components/DiffChecker';
import URLEncoder from './components/URLEncoder';
import JWTDecoder from './components/JWTDecoder';
import Base64Converter from './components/Base64Converter';
import RegexTester from './components/RegexTester';

// New Imports
import YAMLJSONConverter from './components/YAMLJSONConverter';
import CSVJSONConverter from './components/CSVJSONConverter';
import HashGenerator from './components/HashGenerator';
import UUIDGenerator from './components/UUIDGenerator';
import PasswordGenerator from './components/PasswordGenerator';
import HTMLEntityCodec from './components/HTMLEntityCodec';
import AESEncryptor from './components/AESEncryptor';
import CronBuilder from './components/CronBuilder';
import UnixTimestamp from './components/UnixTimestamp';
import ColorPicker from './components/ColorPicker';
import CaseConverter from './components/CaseConverter';
import Base64ImagePreview from './components/Base64ImagePreview';
import QRGenerator from './components/QRGenerator';
import JSONTreeViewer from './components/JSONTreeViewer';

import {
  Code, SplitSquareVertical, Link2, KeyRound, Binary, Search, Sun, Moon,
  FileText, ShieldCheck, Palette, Calendar, Image, FileCode, Command
} from 'lucide-react';

const CATEGORIES = [
  {
    id: 'data',
    title: 'Data & Formatters',
    tools: [
      { id: 'json', name: 'JSON Formatter', desc: 'Prettify/Minify JSON', icon: Code, component: JSONFormatter },
      { id: 'json-tree', name: 'JSON Tree Viewer', desc: 'Collapsible JSON Tree Node inspector', icon: FileCode, component: JSONTreeViewer },
      { id: 'yaml-json', name: 'YAML ↔ JSON', desc: 'YAML/JSON bidirectional parser', icon: FileText, component: YAMLJSONConverter },
      { id: 'csv-json', name: 'CSV ↔ JSON', desc: 'CSV to JSON Array converter', icon: FileText, component: CSVJSONConverter },
    ]
  },
  {
    id: 'encoding',
    title: 'Encoding & Cryptography',
    tools: [
      { id: 'base64', name: 'Base64 Converter', desc: 'String & file base64 encoder', icon: Binary, component: Base64Converter },
      { id: 'url', name: 'URL Encoder/Decoder', desc: 'Encode/Decode query params', icon: Link2, component: URLEncoder },
      { id: 'html-codec', name: 'HTML Entity Encoder', desc: 'Escape/Unescape HTML tags', icon: Code, component: HTMLEntityCodec },
      { id: 'hash', name: 'Hash & HMAC Generator', desc: 'MD5, SHA1, SHA256, SHA512 codes', icon: ShieldCheck, component: HashGenerator },
      { id: 'aes', name: 'AES Encrypt/Decrypt', desc: 'Advanced Encryption Standard block', icon: ShieldCheck, component: AESEncryptor },
    ]
  },
  {
    id: 'generators',
    title: 'Generators & Utilities',
    tools: [
      { id: 'uuid', name: 'UUID / ID Generator', desc: 'Bulk UUID, NanoID, ULID generator', icon: Binary, component: UUIDGenerator },
      { id: 'password', name: 'Password Generator', desc: 'Secure passwords & strength meter', icon: ShieldCheck, component: PasswordGenerator },
      { id: 'cron', name: 'Cron Builder & Reader', desc: 'Cron string configuration slider', icon: Calendar, component: CronBuilder },
      { id: 'timestamp', name: 'Unix Timestamp', desc: 'Epoch time to Date string converter', icon: Calendar, component: UnixTimestamp },
    ]
  },
  {
    id: 'frontend',
    title: 'Frontend & Visualizers',
    tools: [
      { id: 'color', name: 'Color & Gradient', desc: 'HEX/RGB gradient builder', icon: Palette, component: ColorPicker },
      { id: 'case', name: 'Text Case Converter', desc: 'camelCase, snake_case converter', icon: FileText, component: CaseConverter },
      { id: 'base64-img', name: 'Base64 Image Preview', desc: 'Render raw Base64 strings to images', icon: Image, component: Base64ImagePreview },
      { id: 'qr', name: 'QR Code Generator', desc: 'Generate QR code images instantly', icon: Image, component: QRGenerator },
    ]
  },
  {
    id: 'editor',
    title: 'Editors & Comparison',
    tools: [
      { id: 'diff', name: 'Diff Checker', desc: 'Compare side-by-side text lines', icon: SplitSquareVertical, component: DiffChecker },
      { id: 'regex', name: 'Regex Tester', desc: 'Realtime RegExp matching checker', icon: Search, component: RegexTester },
    ]
  }
];

export default function App() {
  const [activeTool, setActiveTool] = useState('json');
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState(() => localStorage.getItem('devkit_theme') || 'dark');
  
  // Sidebar category toggle states (expanded by default)
  const [expandedCats, setExpandedCats] = useState({
    data: true, encoding: true, generators: true, frontend: true, editor: true
  });

  // Command Palette states
  const [showCmdPalette, setShowCmdPalette] = useState(false);
  const [cmdSearch, setCmdSearch] = useState('');
  const [selectedCmdIndex, setSelectedCmdIndex] = useState(0);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('devkit_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Keyboard shortcut listener (Cmd+K or Ctrl+K opens Command Palette)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCmdPalette(prev => !prev);
        setCmdSearch('');
        setSelectedCmdIndex(0);
      }
      if (e.key === 'Escape') {
        setShowCmdPalette(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleCategory = (catId) => {
    setExpandedCats(prev => ({ ...prev, [catId]: !prev[catId] }));
  };

  // Flattened tools list for search and Command Palette
  const allTools = CATEGORIES.flatMap(cat => cat.tools);

  const filteredCmdTools = allTools.filter(t =>
    t.name.toLowerCase().includes(cmdSearch.toLowerCase()) ||
    t.desc.toLowerCase().includes(cmdSearch.toLowerCase())
  );

  const handleCmdKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedCmdIndex(prev => (prev + 1) % filteredCmdTools.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedCmdIndex(prev => (prev - 1 + filteredCmdTools.length) % filteredCmdTools.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCmdTools[selectedCmdIndex]) {
        setActiveTool(filteredCmdTools[selectedCmdIndex].id);
        setShowCmdPalette(false);
      }
    }
  };

  // Find component to render
  const CurrentToolComponent = allTools.find(t => t.id === activeTool)?.component || JSONFormatter;

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
          <div className="shortcut-hint" style={{ position: 'absolute', right: 10, opacity: 0.8 }}>
            <span className="shortcut-key" style={{ fontSize: 10, padding: '2px 5px' }}>⌘K</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {CATEGORIES.map(cat => {
            // Filter tools within category based on global search query
            const matchingTools = cat.tools.filter(t =>
              t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              t.desc.toLowerCase().includes(searchQuery.toLowerCase())
            );

            if (matchingTools.length === 0) return null;

            return (
              <div key={cat.id} className="sidebar-cat-group">
                <div className="sidebar-cat-header" onClick={() => toggleCategory(cat.id)}>
                  <span>{cat.title}</span>
                  <span className="sidebar-cat-arrow">{expandedCats[cat.id] ? '▼' : '▶'}</span>
                </div>
                <div className={`sidebar-cat-children ${expandedCats[cat.id] ? '' : 'collapsed'}`}>
                  {matchingTools.map(tool => {
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
                </div>
              </div>
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
            <span className="active-path">{allTools.find(t => t.id === activeTool)?.name}</span>
          </div>
        </header>
        <div className="devkit-content-wrap">
          <CurrentToolComponent />
        </div>
      </main>

      {/* Command Palette Modal */}
      {showCmdPalette && (
        <div className="cmd-palette-backdrop" onClick={() => setShowCmdPalette(false)}>
          <div className="cmd-palette-box" onClick={e => e.stopPropagation()}>
            <div className="cmd-palette-search">
              <Command size={18} className="search-icon-svg" style={{ position: 'static' }} />
              <input
                type="text"
                placeholder="Search tools or features..."
                autoFocus
                value={cmdSearch}
                onChange={e => { setCmdSearch(e.target.value); setSelectedCmdIndex(0); }}
                onKeyDown={handleCmdKeyDown}
              />
            </div>
            <div className="cmd-palette-results">
              {filteredCmdTools.length > 0 ? (
                filteredCmdTools.map((t, index) => (
                  <button
                    key={t.id}
                    className={`cmd-palette-item ${selectedCmdIndex === index ? 'selected' : ''}`}
                    onClick={() => {
                      setActiveTool(t.id);
                      setShowCmdPalette(false);
                    }}
                    onMouseEnter={() => setSelectedCmdIndex(index)}
                  >
                    <span className="nav-name">{t.name}</span>
                    <span className="nav-desc" style={{ fontSize: 11, marginLeft: 8, opacity: 0.7 }}>— {t.desc}</span>
                  </button>
                ))
              ) : (
                <div style={{ padding: '16px 18px', fontSize: 13, color: 'var(--text-muted)' }}>
                  No tools found matching your search.
                </div>
              )}
            </div>
            <div className="cmd-palette-hint">
              <span>Use ↑↓ to navigate, Enter to select</span>
              <span>ESC to close</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
