# DashboardHost - Micro Frontend Host

A React 18 host application providing a unified navigation shell and dynamic integration of remote micro frontends (Asset, Templates, Explorer) using Webpack Module Federation.

## Features

- Unified shell: header, top navigation, sidebar, breadcrumbs
- Dynamic Module Federation with runtime remote loading
- Routing and deep linking (react-router-dom v6)
- Shared state and authentication context (Context + localStorage)
- Error boundaries, accessible skip links, ARIA attributes
- Cypress e2e scaffolding

## Getting Started

1) Install
- Copy `.env.example` to `.env` and set remote URLs
- Run `npm install`

2) Develop
- `npm start` to run dev server (Craco + CRA)

3) Test
- Unit tests: `npm test`
- Cypress e2e: `npm run cypress:open` or `npm run cypress:run`

## Environment Variables

Place in `.env` at repo root:
- `REACT_APP_ASSET_REMOTE_URL=https://asset.example.com`
- `REACT_APP_TEMPLATES_REMOTE_URL=https://templates.example.com`
- `REACT_APP_EXPLORER_REMOTE_URL=https://explorer.example.com`
Optional:
- `REACT_APP_SITE_URL=` base site URL used by auth providers if needed.

These endpoints must host `remoteEntry.js` at the root path.

## Module Federation

This host uses Craco to inject Webpack's `ModuleFederationPlugin` and share React as singletons. Remotes are loaded at runtime via script injection to `remoteEntry.js`. Each remote should expose `./App` as its root component and have a `scope` matching its name (e.g., `asset`, `templates`, `explorer`).

## Accessibility

- Semantic landmarks (banner, contentinfo)
- Skip to content link
- Breadcrumbs with `aria-current="page"`
- Keyboard focus styles

## Project Structure (selected)

- `src/App.js` — Shell layout and routing
- `src/state/AppStateProvider.jsx` — Shared state and auth contexts
- `src/components/RemoteComponent.jsx` — Remote dynamic loader
- `src/mf/loadRemote.js` — Module Federation runtime loader
- `src/mf/remotes.js` — Remote URL configuration

