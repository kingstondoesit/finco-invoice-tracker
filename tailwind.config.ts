import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'login-img': 'url("/images/hero-mobile.png")',
      },
      gridTemplateColumns: {
        13: 'repeat(13, minmax(0, 1fr))'
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        blue: {
          500: "#1D6EF6",
      },
    },
    // screens: {
    //   widescreen:{'raw':'(min-aspect-ratio:3/2)'},
    //   tallscreen:{'raw':'(max-aspect-ratio:13/20)'},
    //   tablet: '640px',
    //   // => @media (min-width: 640px) { ... }
  
    //   laptop: '1024px',
    //   // => @media (min-width: 1024px) { ... }
  
    //   desktop: '1280px',
    //   // => @media (min-width: 1280px) { ... }
    //   },
    },
  },
  plugins: [],
};
export default config;
