import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ApiProvider } from "@/lib/api/ApiContext";
import { ReactQueryProvider } from "@/lib/reactQuery/ReactQueryProvider";
import { DARK_MODE_STORAGE_KEY } from "@/lib/theme";

/**
 * Applies the persisted (or OS-level) dark mode preference to <html> before
 * first paint. Runs synchronously, ahead of React hydration, so there is no
 * flash of the wrong theme — `useDarkMode` (src/hooks/useDarkMode.ts) then
 * only needs to stay in sync with whatever this already applied.
 */
const themeInitScript = `(function(){try{var s=localStorage.getItem(${JSON.stringify(
	DARK_MODE_STORAGE_KEY,
)});var d=s!==null?s==="true":window.matchMedia("(prefers-color-scheme: dark)").matches;if(d)document.documentElement.classList.add("dark");}catch(e){}})();`;

const inter = Inter({
	variable: "--font-sans",
	subsets: ["latin"],
	display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
	variable: "--font-mono",
	subsets: ["latin"],
	display: "swap",
});

export const metadata: Metadata = {
	metadataBase: new URL("https://stellvexprotocol.com"),
	title: {
		default: "Stellvex Protocol",
		template: "%s | Stellvex Protocol",
	},
	description:
		"Stellvex Protocol — a modular, non-custodial DeFi platform for cross-chain liquidity, leveraged trading, and yield optimization.",
	keywords: [
		"Stellvex Protocol",
		"DeFi",
		"cross-chain",
		"liquidity",
		"leveraged trading",
		"yield optimization",
		"non-custodial",
	],
	authors: [{ name: "Stellvex" }],
	creator: "Stellvex",
	publisher: "Stellvex",
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://stellvexprotocol.com",
		siteName: "Stellvex Protocol",
		title: "Stellvex Protocol",
		description:
			"Stellvex Protocol — a modular, non-custodial DeFi platform for cross-chain liquidity, leveraged trading, and yield optimization.",
		images: [
			{
				url: "/og-image.png",
				width: 1200,
				height: 630,
				alt: "Stellvex Protocol",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		site: "@StellvexProtocol",
		creator: "@StellvexProtocol",
		title: "Stellvex Protocol",
		description:
			"Stellvex Protocol — a modular, non-custodial DeFi platform for cross-chain liquidity, leveraged trading, and yield optimization.",
		images: ["/og-image.png"],
	},
	icons: {
		icon: [
			{ url: "/favicon.ico", sizes: "any" },
			{ url: "/favicon.svg", type: "image/svg+xml" },
		],
		apple: "/apple-touch-icon.png",
	},
	manifest: "/site.webmanifest",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				{/* biome-ignore lint/security/noDangerouslySetInnerHtml: static, non-user-controlled theme-init script; must run before hydration to prevent a flash of the wrong theme */}
				<script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
			</head>
			<body
				className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
			>
				<a
					href="#main-content"
					className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white"
				>
					Skip to content
				</a>
				<AuthProvider>
					<ReactQueryProvider>
						<ApiProvider>{children}</ApiProvider>
					</ReactQueryProvider>
				</AuthProvider>
			</body>
		</html>
	);
}
