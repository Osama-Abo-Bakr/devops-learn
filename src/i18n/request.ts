import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale ?? "en";
  const validLocale = locale === "ar" ? "ar" : "en";

  return {
    locale: validLocale,
    messages: (await import(`./${validLocale}.json`)).default,
  };
});