import { useState, useEffect } from 'react';
import JSONFormatter from './components/JSONFormatter';
import DiffChecker from './components/DiffChecker';
import URLEncoder from './components/URLEncoder';
import JWTDecoder from './components/JWTDecoder';
import Base64Converter from './components/Base64Converter';
import RegexTester from './components/RegexTester';
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
  FileText, ShieldCheck, Palette, Calendar, Image, FileCode, Command, Star
} from 'lucide-react';

const CATEGORIES = [
  {
    id: 'data',
    title: 'Data & Formatters',
    tools: [
      { id: 'json', name: 'JSON Formatter', desc: 'Prettify/Minify JSON', icon: Code, component: JSONFormatter, keywords: ['json', 'format', 'prettify', 'minify'] },
      { id: 'json-tree', name: 'JSON Tree Viewer', desc: 'Collapsible JSON Tree Node inspector', icon: FileCode, component: JSONTreeViewer, keywords: ['json', 'tree', 'view', 'nested'] },
      { id: 'yaml-json', name: 'YAML ↔ JSON', desc: 'YAML/JSON bidirectional parser', icon: FileText, component: YAMLJSONConverter, keywords: ['yaml', 'json', 'convert'] },
      { id: 'csv-json', name: 'CSV ↔ JSON', desc: 'CSV to JSON Array converter', icon: FileText, component: CSVJSONConverter, keywords: ['csv', 'json', 'convert', 'table'] },
    ]
  },
  {
    id: 'encoding',
    title: 'Encoding & Cryptography',
    tools: [
      { id: 'base64', name: 'Base64 Converter', desc: 'String & file base64 encoder', icon: Binary, component: Base64Converter, keywords: ['base64', 'encode', 'decode', 'file'] },
      { id: 'url', name: 'URL Encoder/Decoder', desc: 'Encode/Decode query params', icon: Link2, component: URLEncoder, keywords: ['url', 'query', 'encode', 'decode'] },
      { id: 'html-codec', name: 'HTML Entity Encoder', desc: 'Escape/Unescape HTML tags', icon: Code, component: HTMLEntityCodec, keywords: ['html', 'entities', 'escape', 'unescape'] },
      { id: 'hash', name: 'Hash & HMAC Generator', desc: 'MD5, SHA1, SHA256, SHA512 codes', icon: ShieldCheck, component: HashGenerator, keywords: ['hash', 'md5', 'sha256', 'sha512', 'hmac'] },
      { id: 'aes', name: 'AES Encrypt/Decrypt', desc: 'Advanced Encryption Standard block', icon: ShieldCheck, component: AESEncryptor, keywords: ['aes', 'encrypt', 'decrypt', 'cipher'] },
    ]
  },
  {
    id: 'generators',
    title: 'Generators & Utilities',
    tools: [
      { id: 'uuid', name: 'UUID / ID Generator', desc: 'Bulk UUID, NanoID, ULID generator', icon: Binary, component: UUIDGenerator, keywords: ['uuid', 'guid', 'nanoid', 'ulid', 'generate'] },
      { id: 'password', name: 'Password Generator', desc: 'Secure passwords & strength meter', icon: ShieldCheck, component: PasswordGenerator, keywords: ['password', 'generate', 'strength', 'random'] },
      { id: 'cron', name: 'Cron Builder & Reader', desc: 'Cron string configuration slider', icon: Calendar, component: CronBuilder, keywords: ['cron', 'crontab', 'schedule'] },
      { id: 'timestamp', name: 'Unix Timestamp', desc: 'Epoch time to Date string converter', icon: Calendar, component: UnixTimestamp, keywords: ['unix', 'epoch', 'timestamp', 'date'] },
    ]
  },
  {
    id: 'frontend',
    title: 'Frontend & Visualizers',
    tools: [
      { id: 'color', name: 'Color & Gradient', desc: 'HEX/RGB gradient builder', icon: Palette, component: ColorPicker, keywords: ['color', 'gradient', 'hex', 'rgb'] },
      { id: 'case', name: 'Text Case Converter', desc: 'camelCase, snake_case converter', icon: FileText, component: CaseConverter, keywords: ['case', 'camel', 'snake', 'kebab', 'upper'] },
      { id: 'base64-img', name: 'Base64 Image Preview', desc: 'Render raw Base64 strings to images', icon: Image, component: Base64ImagePreview, keywords: ['base64', 'image', 'preview', 'render'] },
      { id: 'qr', name: 'QR Code Generator', desc: 'Generate QR code images instantly', icon: Image, component: QRGenerator, keywords: ['qr', 'qrcode', 'link', 'generate'] },
    ]
  },
  {
    id: 'editor',
    title: 'Editors & Comparison',
    tools: [
      { id: 'diff', name: 'Diff Checker', desc: 'Compare side-by-side text lines', icon: SplitSquareVertical, component: DiffChecker, keywords: ['diff', 'compare', 'text', 'side'] },
      { id: 'regex', name: 'Regex Tester', desc: 'Realtime RegExp matching checker', icon: Search, component: RegexTester, keywords: ['regex', 'regexp', 'test', 'match'] },
    ]
  }
];

export default function App() {
  const [activeTool, setActiveTool] = useState(() => localStorage.getItem('devkit_last_tool') || 'json');
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState(() => localStorage.getItem('devkit_theme') || 'dark');

  // Favorites & Recents state
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('devkit_favorites')) || []);
  const [recents, setRecents] = useState(() => JSON.parse(localStorage.getItem('devkit_recents')) || []);

  // Sidebar collapsible sections state
  const [expandedSections, setExpandedSections] = useState(() => {
    return JSON.parse(localStorage.getItem('devkit_expanded_sections')) || {
      recents: true, favorites: true, data: true, encoding: true, generators: true, frontend: true, editor: true
    };
  });

  // Command Palette states
  const [showCmdPalette, setShowCmdPalette] = useState(false);
  const [cmdSearch, setCmdSearch] = useState('');
  const [selectedCmdIndex, setSelectedCmdIndex] = useState(0);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('devkit_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('devkit_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('devkit_recents', JSON.stringify(recents));
  }, [recents]);

  useEffect(() => {
    localStorage.setItem('devkit_expanded_sections', JSON.stringify(expandedSections));
  }, [expandedSections]);

  useEffect(() => {
    localStorage.setItem('devkit_last_tool', activeTool);
    // Track recents list (up to 4 unique tools)
    setRecents(prev => {
      const filtered = prev.filter(id => id !== activeTool);
      return [activeTool, ...filtered].slice(0, 4);
    });
  }, [activeTool]);

  // Global Command Palette shortcut trigger (⌘K / Ctrl+K)
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

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const toggleSection = (secId) => {
    setExpandedSections(prev => ({ ...prev, [secId]: !prev[secId] }));
  };

  const toggleFavorite = (toolId, e) => {
    e.stopPropagation();
    setFavorites(prev => {
      if (prev.includes(toolId)) {
        return prev.filter(id => id !== toolId);
      }
      return [...prev, toolId];
    });
  };

  const allTools = CATEGORIES.flatMap(cat => cat.tools);

  // Search filter matching name, description, and keywords
  const filterTool = (t, query) => {
    const q = query.toLowerCase();
    return t.name.toLowerCase().includes(q) ||
           t.desc.toLowerCase().includes(q) ||
           (t.keywords && t.keywords.some(k => k.toLowerCase().includes(q)));
  };

  const filteredCmdTools = allTools.filter(t => filterTool(t, cmdSearch));

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

  const CurrentToolComponent = allTools.find(t => t.id === activeTool)?.component || JSONFormatter;

  // Resolved list of tools for Favorites & Recents
  const favoriteToolsList = allTools.filter(t => favorites.includes(t.id));
  const recentToolsList = allTools.filter(t => recents.includes(t.id) && t.id !== activeTool);

  return (
    <div className="devkit-app">
      {/* Collapsible Left Sidebar */}
      <aside className="devkit-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="brand-logo">🛠️</div>
            <div className="brand-meta">
              <h1>DevKit</h1>
            </div>
          </div>
          <button className="search-shortcut-btn" onClick={() => setShowCmdPalette(true)}>
            <Command size={13} />
            <span>K</span>
          </button>
        </div>

        {/* Global search input */}
        <div className="sidebar-search">
          <Search size={14} className="search-icon-svg" />
          <input
            type="text"
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="sidebar-scrollable">
          {/* Favorites Category */}
          {favoriteToolsList.length > 0 && (
            <div className="sidebar-section">
              <div className="sidebar-section-header" onClick={() => toggleSection('favorites')}>
                <span>Favorites</span>
                <span>{expandedSections.favorites ? '▼' : '▶'}</span>
              </div>
              <div className={`sidebar-section-children ${expandedSections.favorites ? '' : 'collapsed'}`}>
                {favoriteToolsList.map(tool => {
                  const Icon = tool.icon;
                  return (
                    <button
                      key={`fav-${tool.id}`}
                      className={`nav-item ${activeTool === tool.id ? 'active' : ''}`}
                      onClick={() => setActiveTool(tool.id)}
                    >
                      <Icon size={16} className="nav-icon" />
                      <span className="nav-name">{tool.name}</span>
                      <button className="favorite-btn-sidebar is-fav" onClick={(e) => toggleFavorite(tool.id, e)}>
                        ★
                      </button>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recents Category */}
          {recentToolsList.length > 0 && (
            <div className="sidebar-section">
              <div className="sidebar-section-header" onClick={() => toggleSection('recents')}>
                <span>Recents</span>
                <span>{expandedSections.recents ? '▼' : '▶'}</span>
              </div>
              <div className={`sidebar-section-children ${expandedSections.recents ? '' : 'collapsed'}`}>
                {recentToolsList.map(tool => {
                  const Icon = tool.icon;
                  return (
                    <button
                      key={`recent-${tool.id}`}
                      className="nav-item"
                      onClick={() => setActiveTool(tool.id)}
                    >
                      <Icon size={16} className="nav-icon" />
                      <span className="nav-name">{tool.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Main collapsible categories mapping */}
          {CATEGORIES.map(cat => {
            const matchingTools = cat.tools.filter(t => filterTool(t, searchQuery));
            if (matchingTools.length === 0) return null;

            return (
              <div key={cat.id} className="sidebar-section">
                <div className="sidebar-section-header" onClick={() => toggleSection(cat.id)}>
                  <span>{cat.title}</span>
                  <span>{expandedSections[cat.id] ? '▼' : '▶'}</span>
                </div>
                <div className={`sidebar-section-children ${expandedSections[cat.id] ? '' : 'collapsed'}`}>
                  {matchingTools.map(tool => {
                    const Icon = tool.icon;
                    const isFav = favorites.includes(tool.id);
                    return (
                      <button
                        key={tool.id}
                        className={`nav-item ${activeTool === tool.id ? 'active' : ''}`}
                        onClick={() => setActiveTool(tool.id)}
                      >
                        <Icon size={16} className="nav-icon" />
                        <span className="nav-name">{tool.name}</span>
                        <button
                          className={`favorite-btn-sidebar ${isFav ? 'is-fav' : ''}`}
                          onClick={(e) => toggleFavorite(tool.id, e)}
                        >
                          {isFav ? '★' : '☆'}
                        </button>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="sidebar-footer">
          <button className="theme-circle-btn" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>DevKit Desktop</span>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <main className="devkit-main">
        <header className="devkit-header">
          <span className="header-path">{allTools.find(t => t.id === activeTool)?.name}</span>
          <div className="header-actions">
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Press ⌘K to search</span>
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
