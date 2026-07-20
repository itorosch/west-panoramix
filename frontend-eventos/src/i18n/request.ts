import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export default getRequestConfig(async () => {
  // Lee idioma de cookie, si no usa 'es' por defecto
  const cookieStore = await cookies();
  const locale = cookieStore.get('locale')?.value || 'es';
  const validLocales = ['es', 'en'];
  const finalLocale = validLocales.includes(locale) ? locale : 'es';

  return {
    locale: finalLocale,
    messages: (await import(`../../messages/${finalLocale}.json`)).default,
  };
});
