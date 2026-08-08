import { jsx as _jsx } from "react/jsx-runtime";
import { ThemeProvider as NextThemesProvider } from 'next-themes';
export function ThemeProvider({ children, defaultTheme = 'system', storageKey = 'clickon-theme', ...props }) {
    return (_jsx(NextThemesProvider, { attribute: "class", defaultTheme: defaultTheme, enableSystem: true, storageKey: storageKey, ...props, children: children }));
}
