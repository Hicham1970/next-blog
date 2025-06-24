"use client";
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

export default function ThemeCompo({ children }) {
    const [mounted, setMounted] = useState(false);
    const { theme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);
    
    if (!mounted) {
        return null;
    }

    return (
        <div className={theme}>
            <div className="bg-white text-grey-700 dark:bg-secondaryColor dark:text-gray-200 min-h-screen
                          transition-colors duration-300 ease-in-out">
                {children}
            </div>
        </div>
    );
}


