
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				cyber: {
					background: '#111827',
					foreground: '#E2E8F0',
					accent: '#0070F3',
					blue: '#3B82F6',
					purple: '#8B5CF6',
					dark: '#1E293B',
					card: '#1E293B',
					border: '#374151',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'glow': {
					'0%, 100%': { 
						textShadow: '0 0 5px rgba(0, 100, 255, 0.5), 0 0 10px rgba(0, 100, 255, 0.3)' 
					},
					'50%': { 
						textShadow: '0 0 15px rgba(0, 100, 255, 0.8), 0 0 20px rgba(0, 100, 255, 0.5)' 
					},
				},
				'pulse-border': {
					'0%, 100%': { 
						borderColor: 'rgba(0, 100, 255, 0.3)'
					},
					'50%': { 
						borderColor: 'rgba(0, 100, 255, 0.8)'
					},
				},
				'fade-in': {
					'0%': { 
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': { 
						opacity: '1',
						transform: 'translateY(0)'
					},
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'glow': 'glow 2s ease-in-out infinite',
				'pulse-border': 'pulse-border 2s ease-in-out infinite',
				'fade-in': 'fade-in 0.5s ease-out forwards'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
