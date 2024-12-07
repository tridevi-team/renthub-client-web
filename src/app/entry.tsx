import { generateToken, messaging } from '@app/firebase';
import { ConfigProvider } from 'antd';
import vi_VN from 'antd/lib/locale/vi_VN';
import { onMessage } from 'firebase/messaging';
import { StrictMode, useEffect } from 'react';
import { Toaster } from 'sonner';
import { Devtools } from './devtools';
import { AppI18nProvider } from './providers/i18n/provider';
import { AppQueryProvider } from './providers/query/provider';
import { AppRouterProvider } from './providers/router/provider';
import { AppToastProvider } from './providers/toast/provider';
import { ReloadPromptSw } from './reload-prompt-sw';

export function Entry() {
    useEffect(() => {
        generateToken();
        onMessage(messaging, (payload) => {
            console.log(payload);
        });
    }, []);
  return (
    <StrictMode>
      <ConfigProvider locale={vi_VN}>
        <AppQueryProvider>
          <AppI18nProvider>
            <AppToastProvider>
              {/* router entry point */}
              <AppRouterProvider />

              {/* PWA */}
              <ReloadPromptSw />

              <Devtools />
            </AppToastProvider>
          </AppI18nProvider>
        </AppQueryProvider>
      </ConfigProvider>
      <Toaster
        richColors
        expand
        closeButton
        visibleToasts={3}
        toastOptions={{
          style: {
            zIndex: 9999,
          },
        }}
      />
    </StrictMode>
  );
}
