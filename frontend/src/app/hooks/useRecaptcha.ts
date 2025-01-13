import { useEffect } from 'react';

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

export const useRecaptcha = () => {
  useEffect(() => {
    // Load the reCAPTCHA script if it hasn't been loaded yet
    if (!window.grecaptcha) {
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY}`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);

  const executeRecaptcha = async (action: string): Promise<string> => {
    try {
      return await new Promise((resolve, reject) => {
        window.grecaptcha.ready(async () => {
          try {
            const token = await window.grecaptcha.execute(
              process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY!,
              { action }
            );
            resolve(token);
          } catch (error) {
            reject(error);
          }
        });
      });
    } catch (error) {
      console.error('reCAPTCHA execution failed:', error);
      throw new Error('Security verification failed');
    }
  };

  return { executeRecaptcha };
};