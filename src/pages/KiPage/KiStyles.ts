import { createGlobalStyle } from 'styled-components';

const KiStyles = createGlobalStyle`
  :root {
    /* Color System - Cool, neutral tones with subtle gradients */
    --primary: #4263EB; /* Indigo */
    --primary-light: #748FFC;
    --primary-dark: #3A56D4;
    --accent: #0CA5E9; /* Teal accent */
    --accent-light: #38BDF8;
    --accent-dark: #0284C7;
    --bg-primary: #FFFFFF;
    --bg-secondary: #F8FAFC;
    --bg-tertiary: #F1F5F9;
    --text-primary: #1E293B;
    --text-secondary: #64748B;
    --text-tertiary: #94A3B8;
    --border-color: #E2E8F0;
    --hover-bg: #EFF6FF;
    --success: #10B981;
    --error: #EF4444;
    --warning: #F59E0B;

    /* Shadows - Subtle and refined */
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.03);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.03);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.04), 0 4px 6px -4px rgba(0, 0, 0, 0.02);
    --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.03), 0 8px 10px -6px rgba(0, 0, 0, 0.02);

    /* Border Radius - Smooth edges */
    --radius-sm: 0.25rem;
    --radius-md: 0.375rem;
    --radius-lg: 0.5rem;
    --radius-xl: 0.75rem;

    /* Spacing - Balanced padding */
    --spacing-xs: 0.5rem;
    --spacing-sm: 0.75rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;
    --spacing-2xl: 3rem;

    /* Typography - Crisp, legible sans-serif */
    --font-ui: 'Inter', system-ui, -apple-system, sans-serif;
    --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    --font-weight-normal: 400;
    --font-weight-medium: 500;
    --font-weight-semibold: 600;
    --font-weight-bold: 700;

    /* Transitions - Smooth micro-interactions */
    --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
    --transition-normal: 200ms cubic-bezier(0.4, 0, 0.2, 1);
    --transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1);

    /* Layout */
    --header-height: 4rem;
    --editor-height: 250px;
    --container-max-width: 65rem;
  }

  /* Animations */
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes fadeSlideUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Accessibility */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    :root {
      --spacing-lg: 1.25rem;
      --spacing-md: 0.875rem;
    }
  }
  
  /* Global styles */
  body {
    font-family: var(--font-ui);
    color: var(--text-primary);
    background-color: var(--bg-secondary);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Buttons and interactive elements */
  button, a {
    transition: all var(--transition-normal);
  }

  /* Focus styles for accessibility */
  :focus-visible {
    outline: 2px solid var(--primary-light);
    outline-offset: 2px;
  }

  /* Code snippets */
  code {
    font-family: var(--font-mono);
    background-color: var(--bg-tertiary);
    padding: 0.2em 0.4em;
    border-radius: var(--radius-sm);
    font-size: 0.9em;
  }
`;

export default KiStyles;
