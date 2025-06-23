import flowbite from 'flowbite-react/tailwind';

/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
        flowbite.content(),
    ],
    theme: {
        screens: {
            sm: '480px',
            md: '768px',
            lg: '1024px',
        },
        container: {
          center:true,
            padding: {
                DEFAULT: '1rem',
                sm: '1.5rem',
                md: '2rem',
                lg: '2.5rem',
            }  
        },
        extend: {
            colors: {
                primaryColor: '#f7aa1d',
                primaryColorLight: '#1e3133',
                secondaryColor: '#121d1e',
                paragraphColor: "#888",
                whiteColor:'#d3d3d3'
            },
        },
    },
    plugins: [flowbite.plugin()],
};