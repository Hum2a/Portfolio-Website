# Firebase Setup Notes

## Firebase Authentication - Authorized Domains

### Error: `auth/unauthorized-domain`

If you see this error when trying to sign in with Google on production:
```
FirebaseError: Firebase: Error (auth/unauthorized-domain)
```

**Solution:** You need to add your production domain to Firebase Console:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Authentication** > **Settings** > **Authorized domains**
4. Click **Add domain**
5. Add your Render domain: `humza-butt.onrender.com`
6. Also add any custom domain you're using (e.g., `humzabutt.com`)

### Local Development

For local development, these domains are automatically authorized:
- `localhost`
- `127.0.0.1`

### Important Notes

- You can add up to 20 authorized domains per project
- Changes take effect immediately (no deployment needed)
- Subdomains are treated as separate domains (e.g., `www.humzabutt.com` and `humzabutt.com` are different)

## Content Security Policy (CSP) Warnings

### Warning: `frame-ancestors` in meta tag

The CSP `frame-ancestors` directive **cannot** be set via a `<meta>` tag. It only works in HTTP headers.

**Current Status:** The meta tag warning can be ignored. To properly set this:
- Set it in your HTTP server headers (e.g., in Render's headers configuration)
- Or use a service like Cloudflare to add HTTP headers

### Warning: X-Frame-Options in meta tag

Similar to `frame-ancestors`, `X-Frame-Options` should be set in HTTP headers, not meta tags.

**Current Status:** The meta tag will be ignored by browsers. Set it in HTTP headers for proper functionality.

## IP Geolocation API Issues

### ip-api.com 403 Forbidden

If you see 403 errors from `ip-api.com`:
- The API has rate limits (45 requests/minute for free tier)
- Some domains/IPs may be blocked
- The code now automatically falls back to `bigdatacloud.net` and browser geolocation

**Current Fallback Order:**
1. ipinfo.io (if API key configured)
2. bigdatacloud.net (free, more reliable)
3. ip-api.com (may have rate limits)
4. Browser geolocation (requires user permission)
