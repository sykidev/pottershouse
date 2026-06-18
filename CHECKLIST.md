# Pre-Launch Checklist

Use this checklist to ensure everything is configured correctly before launching.

## Development Setup

- [ ] Node.js 20+ installed
- [ ] PostgreSQL installed and running
- [ ] pnpm installed globally
- [ ] Dependencies installed (`pnpm install`)
- [ ] Database created
- [ ] Migrations run successfully
- [ ] Database seeded with sample data
- [ ] Development servers start without errors
- [ ] Frontend accessible at http://localhost:5173
- [ ] Backend accessible at http://localhost:3000

## Functionality Testing

### Public Site
- [ ] Homepage loads with hero image
- [ ] Service countdown displays and updates
- [ ] Latest announcement appears on homepage
- [ ] About page shows mission, vision, values, team
- [ ] Sermons page displays all sermons
- [ ] Sermon video links work
- [ ] Events page shows upcoming events
- [ ] Connect page displays contact information
- [ ] Navigation works on all pages
- [ ] Mobile responsive on all pages
- [ ] All images load correctly

### Admin Panel
- [ ] Can access login page at /admin/login
- [ ] Can login with default credentials
- [ ] Dashboard shows correct statistics
- [ ] Can create new sermon
- [ ] Can edit existing sermon
- [ ] Can delete sermon
- [ ] Can create new event
- [ ] Can edit existing event
- [ ] Can delete event
- [ ] Can create announcement
- [ ] Can toggle announcement active/inactive
- [ ] Can edit team member
- [ ] Can add new team member
- [ ] Content editor loads JSON correctly
- [ ] Can save content changes
- [ ] Can logout successfully
- [ ] Protected routes redirect to login when not authenticated

## Configuration

### Environment Variables
- [ ] `.env` file exists
- [ ] DATABASE_URL is correct
- [ ] SESSION_SECRET is set
- [ ] ADMIN_USERNAME is set
- [ ] ADMIN_PASSWORD is set
- [ ] PORT is configured (default 3000)

### Content Customization
- [ ] Update church name in Navbar
- [ ] Update hero section content
- [ ] Update about page mission and vision
- [ ] Add real team member information
- [ ] Replace sample sermon data
- [ ] Add real event information
- [ ] Update contact information
- [ ] Update service times
- [ ] Add Google Maps link
- [ ] Update Google Form embed URL

### Images
- [ ] Replace hero background image
- [ ] Add team member photos
- [ ] Add event images
- [ ] Add sermon thumbnails
- [ ] All image URLs are accessible
- [ ] Images are optimized for web

### Branding
- [ ] Update primary color in Tailwind config
- [ ] Add favicon
- [ ] Update page titles
- [ ] Add meta descriptions
- [ ] Update social media preview images

## Security

- [ ] Changed default admin username
- [ ] Changed default admin password
- [ ] SESSION_SECRET is long and random
- [ ] No sensitive data in git repository
- [ ] .env is in .gitignore
- [ ] CORS configured correctly
- [ ] Database credentials are secure

## Production Readiness

### Backend
- [ ] Environment set to production
- [ ] Database backups configured
- [ ] Error logging set up
- [ ] HTTPS/SSL enabled
- [ ] Rate limiting configured
- [ ] Production database ready
- [ ] Migrations run on production DB

### Frontend
- [ ] Build works without errors (`pnpm build`)
- [ ] Production API URL configured
- [ ] Analytics added (optional)
- [ ] Error tracking set up (optional)
- [ ] SEO meta tags added
- [ ] Sitemap generated (optional)

### Deployment
- [ ] Domain name purchased
- [ ] DNS configured
- [ ] SSL certificate installed
- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Database migrations run
- [ ] Environment variables set on hosting
- [ ] CORS allows frontend domain
- [ ] API proxy configured correctly

## Performance

- [ ] Lighthouse score > 90
- [ ] Images optimized and lazy-loaded
- [ ] No console errors in browser
- [ ] API responses < 500ms
- [ ] Database queries optimized
- [ ] Caching headers configured

## Post-Launch

- [ ] Test all forms
- [ ] Test admin CRUD operations
- [ ] Verify email notifications (if configured)
- [ ] Test on multiple browsers
- [ ] Test on mobile devices
- [ ] Monitor error logs
- [ ] Set up uptime monitoring
- [ ] Schedule regular backups
- [ ] Document any custom changes
- [ ] Train admin users

## Maintenance

- [ ] Set calendar reminder for dependency updates
- [ ] Set up automated backups
- [ ] Monitor disk space
- [ ] Monitor database size
- [ ] Keep admin credentials secure
- [ ] Regular security audits

## Optional Enhancements

- [ ] Add search functionality
- [ ] Add newsletter signup
- [ ] Add online giving integration
- [ ] Add sermon podcast feed
- [ ] Add live streaming
- [ ] Add photo gallery
- [ ] Add blog section
- [ ] Add member portal
- [ ] Multi-language support
- [ ] Add calendar export (iCal)

## Notes

Use this space to document any custom configurations or issues encountered:

---

