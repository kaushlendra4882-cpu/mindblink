/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ExternalLink,
  Code2,
  BookOpen,
  Copy,
  Check,
  Download,
  Database,
  Github,
  QrCode,
  Sparkles,
  Columns,
  RefreshCw,
  Monitor,
  Smartphone,
  Share2
} from 'lucide-react';

const CLOUDSQL_SCHEMA_CODE = `/**
 * MindBlink - Cloud SQL (PostgreSQL) Drizzle Schema
 * Path: src/db/schema.ts
 */

import { pgTable, text, serial, timestamp, integer } from 'drizzle-orm/pg-core';

// 1. Categories Table
export const categories = pgTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  subcategories: text('subcategories').array().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// 2. Puzzles Table
export const puzzles = pgTable('puzzles', {
  id: text('id').primaryKey(),
  question: text('question').notNull(),
  imageUrl: text('image_url').notNull(),
  answer: text('answer').notNull(),
  hint: text('hint'),
  category: text('category').notNull(),
  subcategory: text('subcategory').notNull(),
  difficulty: text('difficulty').default('Medium').notNull(),
  publishedAt: timestamp('published_at').defaultNow().notNull()
});

// 3. FCM Push Device Tokens Table
export const fcmTokens = pgTable('fcm_tokens', {
  token: text('token').primaryKey(),
  platform: text('platform').default('web').notNull(),
  registeredAt: timestamp('registered_at').defaultNow().notNull()
});

// 4. Notifications Broadcast Log Table
export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  body: text('body').notNull(),
  targetUrl: text('target_url'),
  recipientCount: integer('recipient_count').default(0).notNull(),
  sentAt: timestamp('sent_at').defaultNow().notNull()
});
`;

const FIREBASE_RULES_CODE = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} { allow read, write: if false; }

    function isValidId(id) {
      return id is string && id.size() <= 128 && id.matches('^[a-zA-Z0-9_\\\\-]+$');
    }

    match /puzzles/{puzzleId} {
      allow get, list: if isValidId(puzzleId);
      allow create, update, delete: if isValidId(puzzleId);
    }

    match /categories/{categoryId} {
      allow get, list: if isValidId(categoryId);
      allow create, update, delete: if isValidId(categoryId);
    }

    match /fcm_tokens/{tokenId} {
      allow get, list, create, update, delete: if true;
    }

    match /notifications/{notifId} {
      allow get, list, create: if true;
    }
  }
}`;

export default function App() {
  const [activeTab, setActiveTab] = useState<'preview' | 'cloudsql' | 'github' | 'code' | 'guide'>('preview');
  const [previewMode, setPreviewMode] = useState<'split' | 'admin' | 'user'>('split');
  const [deviceFrame, setDeviceFrame] = useState<'responsive' | 'mobile'>('responsive');
  const [selectedCodeFile, setSelectedCodeFile] = useState<'admin' | 'user' | 'sw' | 'schema' | 'rules'>('admin');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [adminHtmlContent, setAdminHtmlContent] = useState<string>('');
  const [userHtmlContent, setUserHtmlContent] = useState<string>('');
  const [swContent, setSwContent] = useState<string>('');
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [customTestId, setCustomTestId] = useState<string>('mb_illusion_01');
  const [githubUser, setGithubUser] = useState<string>('kaushlendra4882');
  const [githubRepo, setGithubRepo] = useState<string>('mindblink-platform');

  useEffect(() => {
    fetch('/admin.html')
      .then(res => res.text())
      .then(text => setAdminHtmlContent(text))
      .catch(err => console.error('Failed to load admin.html:', err));

    fetch('/user.html')
      .then(res => res.text())
      .then(text => setUserHtmlContent(text))
      .catch(err => console.error('Failed to load user.html:', err));

    fetch('/firebase-messaging-sw.js')
      .then(res => res.text())
      .then(text => setSwContent(text))
      .catch(err => console.error('Failed to load firebase-messaging-sw.js:', err));
  }, []);

  const handleCopyCode = (code: string, key: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    });
  };

  const handleDownloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const reloadIframes = () => {
    setIframeKey(prev => prev + 1);
  };

  const getCodeContent = () => {
    switch (selectedCodeFile) {
      case 'admin':
        return adminHtmlContent || '<!-- Loading admin.html... -->';
      case 'user':
        return userHtmlContent || '<!-- Loading user.html... -->';
      case 'sw':
        return swContent || '/* Loading firebase-messaging-sw.js... */';
      case 'schema':
        return CLOUDSQL_SCHEMA_CODE;
      case 'rules':
        return FIREBASE_RULES_CODE;
      default:
        return '';
    }
  };

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://ais-dev-2fralkpqdwdpbgxu4aewq4-38212745428.asia-east1.run.app';
  const fullAdminUrl = `${currentOrigin}/admin.html`;
  const fullUserUrl = `${currentOrigin}/user.html`;
  const fullDynamicSampleUrl = `${currentOrigin}/user.html?id=mb_illusion_01`;
  const githubHttpsUrl = `https://github.com/${githubUser}/${githubRepo}.git`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-400">
      
      {/* TOP HEADER */}
      <header className="border-b border-slate-800 bg-slate-900/90 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
          
          <div className="flex items-center gap-3">
            <img
              src="/assets/images/mindblink_logo.png"
              alt="MindBlink"
              className="h-10 w-auto object-contain rounded-lg shadow-md shadow-cyan-500/20"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 font-semibold">
                  Firestore & Cloud SQL Live
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Bar */}
          <nav className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-xl overflow-x-auto">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'preview'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Interactive Simulator</span>
            </button>
            <button
              onClick={() => setActiveTab('cloudsql')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'cloudsql'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span>Cloud SQL</span>
            </button>
            <button
              onClick={() => setActiveTab('github')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'github'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Github className="w-3.5 h-3.5 text-purple-400" />
              <span>GitHub Private</span>
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'code'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Source Files</span>
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'guide'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Setup Guide</span>
            </button>
          </nav>

          {/* Direct File Launchers */}
          <div className="flex items-center gap-2">
            <a
              href="/admin.html"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-amber-400 text-slate-950 hover:bg-amber-300 flex items-center gap-1.5 transition shadow"
            >
              <span>Admin</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="/user.html"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 flex items-center gap-1.5 transition"
            >
              <span>User Site</span>
              <ExternalLink className="w-3 h-3 text-emerald-400" />
            </a>
          </div>

        </div>
      </header>

      {/* DEDICATED SEPARATE PUBLIC & PRIVATE LINKS STRIP */}
      <section className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-emerald-500/10 border-b border-slate-800/80 px-4 py-2.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-bold text-amber-300">Generated Public & Private URLs:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Admin Panel Link */}
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 gap-1.5">
              <span className="font-bold text-amber-300">Admin:</span>
              <code className="font-mono text-slate-300 select-all max-w-[150px] truncate">{fullAdminUrl}</code>
              <button
                onClick={() => handleCopyCode(fullAdminUrl, 'admin-full')}
                className="px-1.5 py-0.5 rounded bg-slate-850 hover:bg-slate-800 text-[11px] text-amber-300"
              >
                {copiedKey === 'admin-full' ? 'Copied!' : 'Copy'}
              </button>
              <a href="/admin.html" target="_blank" rel="noreferrer" className="text-amber-400 hover:underline">
                Open ↗
              </a>
            </div>

            {/* Public User Website Link */}
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 gap-1.5">
              <span className="font-bold text-emerald-300">Public User:</span>
              <code className="font-mono text-slate-300 select-all max-w-[150px] truncate">{fullUserUrl}</code>
              <button
                onClick={() => handleCopyCode(fullUserUrl, 'user-full')}
                className="px-1.5 py-0.5 rounded bg-slate-850 hover:bg-slate-800 text-[11px] text-emerald-300"
              >
                {copiedKey === 'user-full' ? 'Copied!' : 'Copy'}
              </button>
              <a href="/user.html" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">
                Open ↗
              </a>
            </div>

            {/* Public Dynamic Puzzle Link */}
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 gap-1.5">
              <span className="font-bold text-cyan-300">Dynamic Link:</span>
              <code className="font-mono text-slate-300 select-all max-w-[170px] truncate">{fullDynamicSampleUrl}</code>
              <button
                onClick={() => handleCopyCode(fullDynamicSampleUrl, 'dyn-full')}
                className="px-1.5 py-0.5 rounded bg-slate-850 hover:bg-slate-800 text-[11px] text-cyan-300"
              >
                {copiedKey === 'dyn-full' ? 'Copied!' : 'Copy'}
              </button>
              <a href="/user.html?id=mb_illusion_01" target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">
                Open ↗
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* SUB-HEADER / CONTROLS (Simulator mode) */}
      {activeTab === 'preview' && (
        <div className="bg-slate-900 border-b border-slate-800 px-4 py-2">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs">
            
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Layout:</span>
              <div className="flex items-center gap-1 p-0.5 bg-slate-950 rounded-lg border border-slate-800">
                <button
                  onClick={() => setPreviewMode('split')}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                    previewMode === 'split' ? 'bg-slate-800 text-amber-400' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Dual Split View
                </button>
                <button
                  onClick={() => setPreviewMode('admin')}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                    previewMode === 'admin' ? 'bg-slate-800 text-amber-400' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Admin Only
                </button>
                <button
                  onClick={() => setPreviewMode('user')}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                    previewMode === 'user' ? 'bg-slate-800 text-amber-400' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  User Only
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Dynamic ID Test (?id=):</span>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={customTestId}
                  onChange={(e) => setCustomTestId(e.target.value)}
                  placeholder="e.g. mb_illusion_01"
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 font-mono text-[11px] text-amber-300 w-36 focus:border-amber-400 outline-none"
                />
                <button
                  onClick={reloadIframes}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                  title="Reload"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">User Device:</span>
              <div className="flex items-center gap-1 p-0.5 bg-slate-950 rounded-lg border border-slate-800">
                <button
                  onClick={() => setDeviceFrame('responsive')}
                  className={`p-1 rounded transition ${
                    deviceFrame === 'responsive' ? 'bg-slate-800 text-amber-400' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Desktop Canvas"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeviceFrame('mobile')}
                  className={`p-1 rounded transition ${
                    deviceFrame === 'mobile' ? 'bg-slate-800 text-amber-400' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Mobile Phone"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* VIEWPORT BODY */}
      <main className="flex-1 flex flex-col">
        
        {/* TAB 1: SIMULATOR */}
        {activeTab === 'preview' && (
          <div className="flex-1 p-4 bg-slate-950 overflow-hidden flex flex-col">
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-140px)] min-h-[640px]">
              
              {/* ADMIN PANEL */}
              {(previewMode === 'split' || previewMode === 'admin') && (
                <div className={`${previewMode === 'split' ? 'lg:col-span-6' : 'lg:col-span-12'} flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl`}>
                  <div className="bg-slate-850 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                      <span className="font-semibold text-xs text-white">Admin Dashboard Preview</span>
                      <span className="text-[11px] font-mono text-slate-500">/admin.html</span>
                    </div>
                    <a href="/admin.html" target="_blank" rel="noreferrer" className="text-xs text-amber-400 hover:underline flex items-center gap-1">
                      <span>Full View</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <iframe
                    key={`admin-${iframeKey}`}
                    src="/admin.html"
                    title="Admin"
                    className="flex-1 w-full h-full border-none bg-slate-950"
                  />
                </div>
              )}

              {/* USER WEBSITE */}
              {(previewMode === 'split' || previewMode === 'user') && (
                <div className={`${previewMode === 'split' ? 'lg:col-span-6' : 'lg:col-span-12'} flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl`}>
                  <div className="bg-slate-850 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                      <span className="font-semibold text-xs text-white">User Site & Dynamic Viewer</span>
                      <span className="text-[11px] font-mono text-slate-500">/user.html?id={customTestId}</span>
                    </div>
                    <a href={`/user.html?id=${encodeURIComponent(customTestId)}`} target="_blank" rel="noreferrer" className="text-xs text-emerald-400 hover:underline flex items-center gap-1">
                      <span>Full View</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="flex-1 w-full h-full flex items-center justify-center bg-slate-950 p-2 overflow-auto">
                    <div className={`h-full w-full ${deviceFrame === 'mobile' ? 'max-w-sm rounded-2xl border-4 border-slate-800 shadow-2xl overflow-hidden' : ''}`}>
                      <iframe
                        key={`user-${iframeKey}-${customTestId}`}
                        src={`/user.html?id=${encodeURIComponent(customTestId)}`}
                        title="User"
                        className="w-full h-full border-none bg-slate-950"
                      />
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* TAB 2: CLOUD SQL POSTGRESQL BRIDGE */}
        {activeTab === 'cloudsql' && (
          <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-cyan-400" />
                  <span>Cloud SQL (PostgreSQL) Integration & Bridge</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Relational PostgreSQL schema & analytics bridge for MindBlink puzzles, categories, and device tokens.
                </p>
              </div>
              <button
                onClick={() => handleCopyCode(CLOUDSQL_SCHEMA_CODE, 'cloudsql-schema')}
                className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition"
              >
                {copiedKey === 'cloudsql-schema' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Drizzle Schema</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <span className="text-xs text-slate-400">Relational Engine</span>
                <div className="text-sm font-bold text-cyan-300 mt-1">PostgreSQL 16 / Cloud SQL</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <span className="text-xs text-slate-400">ORM & Driver</span>
                <div className="text-sm font-bold text-white mt-1">Drizzle ORM + node-postgres (pg)</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <span className="text-xs text-slate-400">Dual Sync Architecture</span>
                <div className="text-sm font-bold text-emerald-400 mt-1">Firestore Realtime + SQL Analytics</div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between">
                <span>src/db/schema.ts (Drizzle PostgreSQL Definition)</span>
                <span className="text-cyan-400">Type-Safe Relational Model</span>
              </div>
              <pre className="p-5 font-mono text-xs text-cyan-200/90 overflow-x-auto leading-relaxed">
                <code>{CLOUDSQL_SCHEMA_CODE}</code>
              </pre>
            </div>
          </div>
        )}

        {/* TAB 3: GITHUB PRIVATE REPOSITORY & GIT SYNC */}
        {activeTab === 'github' && (
          <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
                <Github className="w-5 h-5 text-purple-400" />
                <span>GitHub Private Repository Setup</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Push this complete codebase directly to your private GitHub repository via HTTPS.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-2">GitHub Username</label>
                  <input
                    type="text"
                    value={githubUser}
                    onChange={(e) => setGithubUser(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs font-mono text-white outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-2">Private Repo Name</label>
                  <input
                    type="text"
                    value={githubRepo}
                    onChange={(e) => setGithubRepo(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs font-mono text-white outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-2">Your Private Git Remote HTTPS URL</label>
                <div className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 font-mono text-xs text-purple-300">
                  <span className="select-all">{githubHttpsUrl}</span>
                  <button
                    onClick={() => handleCopyCode(githubHttpsUrl, 'git-remote')}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition"
                  >
                    {copiedKey === 'git-remote' ? 'Copied!' : 'Copy URL'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-2">Terminal CLI Commands</label>
                <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-emerald-300 select-all overflow-x-auto leading-relaxed">
{`# 1. Initialize local Git repository
git init

# 2. Add all project files
git add .

# 3. Commit files
git commit -m "MindBlink dual website release with Firebase Firestore and Cloud SQL"

# 4. Set main branch & add private remote
git branch -M main
git remote add origin ${githubHttpsUrl}

# 5. Push to your private repository
git push -u origin main`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CODE & FILES EXPORTER */}
        {activeTab === 'code' && (
          <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold font-display text-white">Full Source Code Files</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Single-page HTML5 files with live pre-configured Firebase Firestore and FCM credentials.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyCode(getCodeContent(), selectedCodeFile)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  {copiedKey === selectedCodeFile ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                  <span>Copy Code</span>
                </button>
                <button
                  onClick={() => handleDownloadFile(
                    selectedCodeFile === 'admin' ? 'admin.html' :
                    selectedCodeFile === 'user' ? 'user.html' :
                    selectedCodeFile === 'sw' ? 'firebase-messaging-sw.js' :
                    selectedCodeFile === 'schema' ? 'schema.ts' : 'firestore.rules',
                    getCodeContent()
                  )}
                  className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition shadow"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download File</span>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
              <button
                onClick={() => setSelectedCodeFile('admin')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition ${
                  selectedCodeFile === 'admin'
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                    : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
                }`}
              >
                admin.html
              </button>
              <button
                onClick={() => setSelectedCodeFile('user')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition ${
                  selectedCodeFile === 'user'
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                    : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
                }`}
              >
                user.html
              </button>
              <button
                onClick={() => setSelectedCodeFile('sw')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition ${
                  selectedCodeFile === 'sw'
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                    : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
                }`}
              >
                firebase-messaging-sw.js
              </button>
              <button
                onClick={() => setSelectedCodeFile('schema')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition ${
                  selectedCodeFile === 'schema'
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                    : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
                }`}
              >
                src/db/schema.ts
              </button>
              <button
                onClick={() => setSelectedCodeFile('rules')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition ${
                  selectedCodeFile === 'rules'
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                    : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
                }`}
              >
                firestore.rules
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              <pre className="p-5 font-mono text-xs text-amber-200/90 overflow-x-auto leading-relaxed max-h-[600px]">
                <code>{getCodeContent()}</code>
              </pre>
            </div>
          </div>
        )}

        {/* TAB 5: GUIDE */}
        {activeTab === 'guide' && (
          <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6">
            <h2 className="text-2xl font-bold font-display text-white">MindBlink Platform Architecture</h2>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 text-xs text-slate-300 leading-relaxed">
              <div className="font-bold text-white text-sm">Live Provisioned Firebase Credentials:</div>
              <ul className="list-disc list-inside space-y-1 text-slate-300 font-mono">
                <li>Project ID: <span className="text-amber-300">gen-lang-client-0728617441</span></li>
                <li>Database ID: <span className="text-emerald-300">ai-studio-mindblink-93047e9c-a584-4475-87f2-e2a9f241dddf</span></li>
                <li>Auth Domain: <span className="text-slate-300">gen-lang-client-0728617441.firebaseapp.com</span></li>
                <li>Messaging Sender ID: <span className="text-slate-300">48667653274</span></li>
              </ul>
              <p>
                Both <code className="text-amber-400 font-mono">admin.html</code> and <code className="text-emerald-400 font-mono">user.html</code> are already pre-wired with these live credentials and ready for production usage.
              </p>
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
