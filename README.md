# uMail with Aura AI

uMail is a high-security, zero-knowledge sovereign email client designed to mitigate modern email vulnerabilities (phishing, spoofing, tracking) while solving identity bloat through a unified, encrypted local bridge.

## Architectural Reasoning & Feature Inclusion Strategy

*   **Zero-Knowledge Multi-Account Bridge:** Users suffer from identity bloat, switching between Gmail, Outlook, and personal apps. The design includes an OAuth/IMAP bridge that pulls external mail into the local AES-GCM-256 encrypted SQLite database, allowing unified management without giving external servers access to the hardware master keys.
*   **Cryptographic Origin Watermarking:** To solve spoofing and phishing, the UI strictly segregates `uSafe` enclave emails from external bridges. External emails receive an indelible `[GMAIL IMPORT]` badge and an ambient background watermark to prevent users from being socially engineered into trusting unverified origins.
*   **Aura AI Neural Screener:** Instead of basic spam filters, the system uses a local LLM "Aura" to strip tracking pixels before rendering, summarize complex corporate threads (Executive 3-Bullet), and draft replies directly from a "Make Formal" split-composer.

## Tech Stack
*   React 18+ & TypeScript
*   Tailwind CSS (Matte dark aesthetic, zero neon glare)
*   Framer Motion (for fluid popLayout transitions, accordion animations, and onboarding)
*   Lucide React (Icons)

## Visual Design Language
*   **Base Surfaces:** Base Canvas at `#0E0E10` (Deep Matte Charcoal), Elevated Panels at `#14161D`, Focused Cards at `#181A22`, with 1px structural borders at `#232836`.
*   **Functional Color Hierarchy:**
    *   Primary Action / Brand: Warm Golden Amber (`#DDA15E` / `#E07A5F`)
    *   Enclave, Mesh Heartbeat & Verification: Sage Green (`#52B788`)
    *   External Bridges: Steel Blue (`#4A6FA5`)
    *   Aura AI Processing: Muted Violet (`#7E78D2`)

## Core Features
1.  **First-Time Onboarding Flow:** Seamlessly walks the user through syncing external accounts and choosing their preferred workspace architecture (Unified vs. Separate), concluding with a download recommendation for native OS clients.
2.  **Right-Side Command Dashboard:** Always visible when the enclave is empty, collapsing away smoothly to maximize space when the user engages in deep work reading an email.
3.  **Accordion vs. Focus Mode:** The reading canvas allows switching between isolated "Focus Mode" and a stacked "Accordion Mode" for rapidly reviewing threaded history.
