# Architectural Decisions (ADRs)

This document outlines key technical decisions and trade-offs made during the development of ResumeFlow.

## ADR 1: Redux Toolkit for Form Editor State

- **Context**: The resume builder requires real-time updates as users type descriptions, adjust GPA values, or drag blocks.
- **Decision**: We chose Redux Toolkit over standard React Context.
- **Rationale**: React Context triggers re-renders on all listening elements, which causes noticeable typing lag when modifying deeply nested forms. Redux Toolkit allows components to subscribe to small, specific slices of state via memoized selectors, preventing unnecessary re-renders.

## ADR 2: Client-Side Iframe Rendering instead of PDFViewer

- **Context**: `@react-pdf/renderer` supplies a built-in `<PDFViewer>` component to preview documents.
- **Decision**: We chose to dynamically render the React-PDF document object inside a sandboxed iframe.
- **Rationale**: `<PDFViewer>` has noticeable loading delays of up to 1 second when building PDFs. Rendering components directly as DOM elements in an iframe isolates CSS variables while compiling instantly on every keypress.

## ADR 3: PDF Print-via-Iframe

- **Context**: Hardcopies and PDFs must be exported cleanly from the builder.
- **Decision**: We chose to print PDFs programmatically via a hidden iframe pointing to `instance.url`.
- **Rationale**: `@media print` styles are notoriously difficult to standardize across different browser engines. Printing the pixel-perfect compiled PDF blob directly ensures the hardcopy matches the downloaded version exactly.
