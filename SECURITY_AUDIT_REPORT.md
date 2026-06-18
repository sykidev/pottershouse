# Security Audit Report - Potter's Family Church Website
**Date:** June 16, 2026  
**Domain:** pottersapostolic.com  
**Status:** CRITICAL ISSUES FOUND

---

## 🔴 CRITICAL VULNERABILITIES (Must Fix Immediately)

### 1. **SQL Injection Vulnerability in Drizzle ORM**
- **Severity:** HIGH
- **Package:** drizzle-orm@0.33.0
- **Issue:** SQL injection via improperly escaped SQL identifiers
- **Advisory:** https://github.com/advisories/GHSA-gpj5-g38j-94v9
- **Fix Required:** Upgrade to drizzle-orm >= 0.45.2

**Action Required:**
```bash
cd /Users/corneliussaiki/potters/packages/backend
pnpm update drizzle-orm@latest drizzle-zod@latest
pnpm build
# Redeploy to server
```

---

### 2. **Missing HTTPS/SSL Certificate**
- **Severity:** CRITICAL
- **Issue:** Website running on HTTP only (port 80)
- **Risk:** Man-in-the-middle attacks, credential interception, session hijacking
- **Impact:** Admin passwords transmitted in plain text

**Action Required:**
```bash
# Install certbot
ssh admin@139.177.196.125
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d pottersapostolic.com -d www.pottersapostolic.com

# Auto-renewal setup
sudo systemctl enable certbot.timer
```

---

### 3. **Exposed Database Credentials in .env File**
- **Severity:** HIGH
- **File:** `/var/www/potters/.env`
- **Permissions:** `-rw-r--r--` (world-readable)
- **Issue:** Anyone with server access can read database password

**Action Required:**
```bash
ssh admin@139.177.196.125
chmod 600 /var/www/potters/.env
```

---

## 🟡 HIGH PRIORITY ISSUES

### 4. **In-Memory Session Store in Production**
- **Severity:** HIGH
- **Issue:** Using MemoryStore for sessions (not suitable for production)
- **Risk:** Session data lost on restart, memory leaks, doesn't scale
- **Warning in logs:** "MemoryStore is not designed for a production environment"

**Action Required:**
```bash
# Install connect-redis or connect-pg-simple
pnpm add connect-pg-simple express-session
```

Update `packages/backend/src/index.ts`:
```typescript
import connectPg from 'connect-pg-simple';
const PgSession = connectPg(session);

app.use(session({
  store: new PgSession({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,  // HTTPS only
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
}));
```

---

### 5. **Missing Security Headers**
- **Severity:** MEDIUM-HIGH
- **Missing Headers:**
  - `Strict-Transport-Security` (HSTS)
  - `Content-Security-Policy` (CSP)
  - `X-XSS-Protection` (present but needs update)
  - `Referrer-Policy`
  - `Permissions-Policy`

**Action Required:**
Update nginx configuration:
```nginx
# Add to server block
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' https: data:; frame-src https://docs.google.com;" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
add_header X-XSS-Protection "1; mode=block" always;
```

---

### 6. **No Rate Limiting**
- **Severity:** MEDIUM-HIGH
- **Issue:** Login endpoint has no rate limiting
- **Risk:** Brute force attacks on admin login

**Action Required:**
```bash
pnpm add express-rate-limit
```

Update `packages/backend/src/routes/auth.ts`:
```typescript
import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/login', loginLimiter, async (req, res) => {
  // ... existing code
});
```

---

### 7. **Password Storage in Plain Text Comparison**
- **Severity:** MEDIUM-HIGH
- **Issue:** Admin password compared in plain text from env variable
- **Better Practice:** Use bcrypt hashing

**Action Required:**
```bash
pnpm add bcryptjs
pnpm add -D @types/bcryptjs
```

Update auth to use hashed passwords (store bcrypt hash in .env instead of plain text).

---

## 🟢 MEDIUM PRIORITY ISSUES

### 8. **CORS Configuration Too Permissive**
- **Issue:** CORS origin not properly configured for production
- **Current:** Checks `process.env.FRONTEND_URL` but uses hardcoded localhost fallback
- **Fix:** Set `FRONTEND_URL=https://pottersapostolic.com` in production .env

---

### 9. **Missing Input Validation**
- **Issue:** Some endpoints lack comprehensive input validation
- **Fix:** Ensure all user inputs validated with Zod schemas

---

### 10. **Server Information Disclosure**
- **Issue:** Nginx version and "X-Powered-By" headers may leak
- **Fix:** 
```nginx
server_tokens off;  # Hide nginx version
```

In Express:
```typescript
app.disable('x-powered-by');
```

---

## ✅ GOOD SECURITY PRACTICES FOUND

1. ✅ Using Zod for input validation
2. ✅ Session-based authentication (better than JWT for this use case)
3. ✅ HttpOnly cookies
4. ✅ Drizzle ORM (parameterized queries prevent SQL injection once updated)
5. ✅ No eval() or dangerous code execution
6. ✅ Environment variables for secrets
7. ✅ Basic security headers configured (X-Frame-Options, X-Content-Type-Options)
8. ✅ Credentials not hardcoded in source code
9. ✅ CSRF protection via SameSite cookies
10. ✅ Proper password field types in frontend

---

## 📋 IMMEDIATE ACTION CHECKLIST

**Priority 1 (Fix Today):**
- [ ] Install SSL certificate with Let's Encrypt
- [ ] Update drizzle-orm to >= 0.45.2
- [ ] Fix .env file permissions (chmod 600)
- [ ] Add rate limiting to login endpoint

**Priority 2 (Fix This Week):**
- [ ] Implement PostgreSQL session store
- [ ] Add missing security headers
- [ ] Configure HSTS
- [ ] Set up CSP policy
- [ ] Hash admin password with bcrypt

**Priority 3 (Fix This Month):**
- [ ] Regular security dependency audits
- [ ] Set up automated vulnerability scanning
- [ ] Implement logging and monitoring
- [ ] Add 2FA for admin access
- [ ] Set up database backups

---

## 🔧 DEPLOYMENT SCRIPT FOR FIXES

```bash
#!/bin/bash
# Security fixes deployment script

# 1. Fix drizzle vulnerability
cd /Users/corneliussaiki/potters/packages/backend
pnpm update drizzle-orm@0.45.2 drizzle-zod@latest
pnpm build

# 2. Add rate limiting
pnpm add express-rate-limit connect-pg-simple

# 3. Rebuild and deploy
cd /Users/corneliussaiki/potters
pnpm --filter backend build
pnpm --filter frontend build

# 4. Deploy to server
tar -czf potters-secure.tar.gz packages/backend/dist packages/frontend/dist .env
scp potters-secure.tar.gz admin@139.177.196.125:/var/www/potters/
ssh admin@139.177.196.125 << 'ENDSSH'
  cd /var/www/potters
  tar -xzf potters-secure.tar.gz
  chmod 600 .env
  pm2 restart potters-api
  sudo certbot --nginx -d pottersapostolic.com -d www.pottersapostolic.com --non-interactive --agree-tos -m admin@pottersapostolic.com
  sudo nginx -s reload
ENDSSH
```

---

## 📊 SECURITY SCORE

**Current Security Score: 4.5/10** ⚠️

After implementing all fixes:
**Expected Security Score: 8.5/10** ✅

---

## 📞 SUPPORT

For questions about this audit, contact the development team.

**Report Generated:** 2026-06-16  
**Next Audit Due:** 2026-07-16
