# Publish Glide with Community Reporting

This deployment uses Netlify Functions and Netlify Blobs, not a continuously running Node server. Netlify installs the dependency and supplies storage credentials to its Functions automatically. Do not put personal access tokens in the browser or GitHub repository.

## Upload

1. Extract `Glide-Hosted.zip`.
2. Upload **all extracted contents** to the root of the existing GitHub repository: `public`, `netlify`, `lib`, `package.json`, `package-lock.json`, and `netlify.toml`. Preserve the folder structure; the ZIP itself must not be the uploaded source.
3. Commit the changes. The Netlify site must be connected to this repository and branch.
4. Use the root `netlify.toml` configuration. For this prebuilt package the build command is empty, publish directory is `public`, functions directory is `netlify/functions`, and Node is 22. Clear an old custom base directory if one was set.
5. Trigger a new production deploy. A static drag-and-drop deployment of only `index.html` will NOT deploy Functions.
6. Check Netlify's deploy log for dependency installation and both `crowds` and `cleanup-crowds` functions. If Functions or Blobs are unavailable for the site's account, enable the service in Netlify before retrying. Check your account's usage allowances and billing controls before public use.

The original full source ZIP uses the same Functions but builds the self-contained frontend with `node build-netlify.cjs` and publishes `netlify-site`. Do not mix the two sets of build settings.

## Verify After Deploy

Open `https://aitravelappglide.netlify.app/api/crowds?from=gundavali&to=mukesh-patel`. Expect a JSON object with a `reports` array (possibly empty), not a 404 HTML page.

Open Glide in two separate browsers or a normal and private window. Select Now and Safest. In one window submit Packed for the bus segment. Refresh the other window, or wait a minute: it should show the report. Change/remove your report and check again.

## Storage and Privacy

Reports are shared site-wide, remain available across production deployments, and stop affecting crowds after 30 minutes. Each browser keeps its private anonymous reporting token locally; only a SHA-256 digest is stored on the server, never returned by the API. The API returns corridor, transport type, level and timestamp only. No GPS or names are requested.

An hourly scheduled Function deletes obsolete storage buckets. Expired records can remain stored for up to approximately 90 minutes, longer if cleanup is delayed; they are not displayed after 30 minutes. Removal immediately hides the report and writes a temporary tombstone to prevent an older report reappearing.

Netlify applies a configured limit of 60 requests per minute per IP/domain to the crowd endpoint. Writes require the page's actual same-origin header, JSON, valid saved place IDs, a valid transport type and a maximum 4 KB body. Anonymous reports are not verified, and people can reset browser identities. This is basic abuse resistance, not user authentication or full moderation. Multiple people on the same network share the IP request allowance. No public storage tokens are shipped.

Netlify deploy previews on the same site share the site-wide crowd store. Do not submit test reports on public previews unless you intend them to affect production, or use a separate Netlify site for staging.

## Troubleshooting

- **404 on /api/crowds:** Functions were not deployed; upload the complete package and use Git-connected deployment.
- **503:** the Function ran but storage failed. Check Functions logs and Blobs availability. The UI falls back to typical estimates.
- **429:** wait a minute before trying again.
- **400:** a starting place and destination from Glide's saved places are required.

Live cloud storage and platform rate limits must be verified after deployment in the owner's Netlify account. Local automated tests use an in-memory replacement for Blobs and cannot prove the account's cloud configuration.

References: https://docs.netlify.com/build/functions/get-started/ and https://docs.netlify.com/build/data-and-storage/netlify-blobs/
