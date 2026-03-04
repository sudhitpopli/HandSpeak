import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import type { Metadata } from 'next';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'HandSpeak Studio',
    description: 'Translating sign language into speech with ESP Wi-Fi sensor and HuggingFace AI',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${spaceGrotesk.className} layout-wrapper`}>
                {children}
            </body>
        </html>
    );
}
