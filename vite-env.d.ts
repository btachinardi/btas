/// <reference types="vite/client" />

// Raw file imports
declare module '*?raw' {
  const content: string;
  export default content;
}

// Markdown file imports
declare module '*.md' {
  const content: string;
  export default content;
}
