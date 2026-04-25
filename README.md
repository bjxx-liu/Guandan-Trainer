# Guandan Training MVP

This project will become a playable Guandan training app with:

- one human player and three rule-based bots
- a pure, testable rule engine
- structured game history for every move
- real-time heuristic move analysis
- post-game coaching review

The implementation is intentionally staged. The current milestone is only the
architecture and core TypeScript domain types. Game logic starts in Step 1.

See [docs/architecture.md](docs/architecture.md) for the plan.

## Local Setup

This project requires Node.js and npm.

```bash
npm install
npm run typecheck
npm test
npm run dev
```

Production build:

```bash
npm run build
```
