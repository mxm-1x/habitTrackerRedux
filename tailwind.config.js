/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    'min-h-screen',
    'max-w-3xl',
    'mx-auto',
    'py-12',
    'px-4',
    'flex',
    'flex-col',
    'items-center',
    'justify-center',
    'gap-3',
    'gap-6',
    'mb-8',
    'w-8',
    'h-8',
    'text-3xl',
    'font-bold',
    'p-4',
    'rounded-lg',
    'shadow-lg',
    'hover:bg-blue-600',
    'transition-colors',
    'duration-200',
    'rounded-xl',
    'p-6',
    {
      pattern: /^(bg|text)-(blue|green|gray|white)-[0-9]+$/
    }
  ]
}