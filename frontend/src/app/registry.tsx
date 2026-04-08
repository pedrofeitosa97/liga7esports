'use client';
import React, { useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';
import { ThemeProvider } from 'styled-components';

import { theme } from '@/styles/theme';
import GlobalStyles from '@/styles/GlobalStyles';

export function StyledComponentsRegistry({ children }: { children: React.ReactNode }) {
  const [styleSheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = styleSheet.getStyleElement();
    styleSheet.instance.clearTag();
    return <>{styles}</>;
  });

  if (typeof window !== 'undefined') {
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        {children}
      </ThemeProvider>
    );
  }

  return (
    <StyleSheetManager sheet={styleSheet.instance}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        {children}
      </ThemeProvider>
    </StyleSheetManager>
  );
}
