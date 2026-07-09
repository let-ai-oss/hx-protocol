# Security Policy

`@let-ai/hx-protocol` is a shared wire-protocol library: TypeScript type
definitions plus a JSON frame codec. It contains no transport, auth, or
application logic — those live in the consuming repositories (`hx-fortress`,
`hx`).

## Supported Versions

Pre-1.0. Only the latest `main` / latest published version is supported.

| Version        | Supported          |
| -------------- | ------------------ |
| latest (main)  | :white_check_mark: |
| older releases | :x:                |

## Reporting a Vulnerability

**Please do not open a public GitHub issue for security vulnerabilities.**

Report privately through either channel:

- **Preferred:** GitHub Private Vulnerability Reporting — the "Report a
  vulnerability" button under this repository's **Security** tab.
- **Email:** security@let.ai. A PGP key for encrypted reports is available on
  request (ask in your first message and we will supply the current key
  fingerprint before you send any sensitive detail).

## Response Targets

| Stage                              | Target                  |
| ---------------------------------- | ----------------------- |
| Acknowledge receipt                | within 2 business days  |
| Initial assessment / triage        | within 7 days           |
| Fix or coordinated-disclosure plan | within 90 days          |

Timelines may be adjusted for complex issues by mutual agreement.

## Scope

In scope: the codec and type definitions in this repository. **Out of scope:**
transport security, authentication, and authorization — this package only
*computes* commitments and *parses* frames; the sign/verify and trust
decisions are enforced by the consuming layers. Report those against
`hx-fortress` / `hx`.

## Safe Harbor

We will not pursue legal action against researchers who act in good faith,
avoid privacy violations and service disruption, and give us a reasonable
opportunity to remediate before public disclosure.
