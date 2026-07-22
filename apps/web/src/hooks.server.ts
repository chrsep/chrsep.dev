import { redirect, type Handle } from "@sveltejs/kit"
import { paraglideMiddleware } from "$lib/paraglide/server"
import { getLocaleAliasRedirect } from "$lib/url-normalization"

export const handle: Handle = ({ event, resolve }) => {
  const localeAliasRedirect = getLocaleAliasRedirect(event.url)

  if (localeAliasRedirect) {
    redirect(308, localeAliasRedirect)
  }

  return paraglideMiddleware(event.request, ({ request, locale }) => {
    event.request = request

    return resolve(event, {
      transformPageChunk: ({ html }) => html.replace("%lang%", locale),
    })
  })
}
