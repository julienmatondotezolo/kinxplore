import createMiddleware from "next-intl/middleware";

import { locales } from "./src/navigation";

// Note: Authentication is handled client-side in the page component
// This middleware only handles internationalization
export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale: "en",
});

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(fr|en|nl)/:path*"],
};
