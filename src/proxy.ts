import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./i18n/config";

const intlProxy = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

export function proxy(...args: Parameters<typeof intlProxy>) {
  return intlProxy(...args);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};