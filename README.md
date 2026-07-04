# ResumeFlow

ResumeFlow is an enterprise-grade, high-performance, open-source resume builder and ATS optimizer built on Next.js. It features a real-time responsive form editor, live PDF rendering using `@react-pdf/renderer`, automatic local storage autosaving, conventional git commit hooks, and dynamic style templates.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router & Pages Router hybrid)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) (with custom debounced autosave middleware)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **PDF Compiler**: [@react-pdf/renderer](https://react-pdf.org/)
- **Testing**: [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- **Git Quality Gates**: Husky, lint-staged, commitlint

## Features

1.  **Dual-Pane Editor Layout**: Side-by-side editing pane and pixel-perfect PDF rendering pane.
2.  **State Auto-Saving**: Debounced middleware automatically saves state changes to localStorage to prevent layout lag.
3.  **Dynamic Style Templates**: Select between Classic Minimal (serif), Modern Executive (accented sans-serif), and Professional Tech (monospace Courier) layouts.
4.  **Accessibility**: Fully focusable controls, ARIA radiogroups, and screen-reader `aria-live` validation announcers.
5.  **Hardcopy/PDF Printing**: Prints compiled resume PDF directly using browser print dialogs.

## Installation & Running Locally

1.  **Install dependencies**:

    ```bash
    npm install
    ```

2.  **Run development server**:

    ```bash
    npm run dev
    ```

3.  **Run test suite**:

    ```bash
    npm run test:ci
    ```

4.  **Compile production bundle**:
    ```bash
    npm run build
    ```

## Project Structure

- `src/app/` - Application entrypoints, page routing, and context layouts.
- `src/app/components/` - Form inputs, button controls, and custom layouts.
- `src/app/components/Resume/ResumePDF/` - React-PDF subcomponents and style schemes.
- `src/app/lib/` - Redux store configuration, hooks, parsing engines, and schemas.

## License

MIT License. See [LICENSE](LICENSE) for details.
