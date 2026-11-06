# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-11-06

### Added
- Password visibility toggle and a confirm-password field on signup.
- Entry details modal: click a cup icon in History to see the exact time, cost, and remaining caffeine per entry.
- Custom delete-confirmation dialog (replaces the browser-blocking window.confirm).
- `firestore.rules` file documenting per-user document access rules.
- `.env.example` with Firebase configuration placeholders.
- This changelog.

### Changed
- Firestore reads now use an `onSnapshot` listener, so data stays in sync across tabs and devices.
- Firestore writes are centralized in `src/services/coffee-service.js`; components no longer import Firestore directly.
- Stats calculations are memoized (`useMemo`) and remaining caffeine is precomputed per entry.
- Firebase auth errors are mapped to friendly, uniform messages (avoids revealing whether an email exists); password-reset errors use the same mapping.
- Form validation shows inline messages instead of failing silently.
- Cost input starts empty with a visible placeholder and clears after submit.

### Fixed
- `getTopThreeCoffees` could crash on an empty history (missing `|| {}` fallback in `Stats.jsx`).
- Removed leftover debug `console.log` statements that printed user data.
- Text typo in the delete confirmation dialog.
