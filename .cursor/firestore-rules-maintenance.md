# Firestore Security Rules Maintenance Guide

## Overview
This document provides guidelines for maintaining Firestore security rules when adding new analytics collections or features that interact with Firestore.

## Current Analytics Collections

The following collections contain sensitive analytics data and are **protected** - only users with role "humza" can read them, but anyone can write to them (for anonymous tracking):

1. **analytics_visitors** - Visitor tracking data (location, device info, visit history)
2. **analytics_pageviews** - Page view tracking data (path, title, referrer, timestamp)
3. **analytics_events** - Event tracking data (clicks, form submissions, etc.)
4. **analytics_stats** - Aggregated statistics (visitor counts, page view counts, event counts)
5. **analytics_page_times** - Time spent on each page tracking (startTime, endTime, timeSpent in seconds, path)
6. **analytics_media_clicks** - Media (images/videos) click tracking in project pages (mediaType, mediaSrc, mediaCaption, projectPath)
7. **analytics_sessions** - Session duration tracking (session start/end times, duration)

## Rules for Adding New Analytics Collections

### When Adding a New Analytics Collection:

1. **Add the collection to Firestore rules** (`firestore.rules`):
   ```javascript
   match /analytics_YOUR_COLLECTION/{document=**} {
     allow read: if isHumzaUser();
     allow write: if true; // Anyone can write (for anonymous tracking)
     allow delete: if false; // Prevent deletion for security
   }
   ```

2. **Update the `isNotAnalyticsCollection` helper function**:
   Add your new collection name to the exclusion list:
   ```javascript
   function isNotAnalyticsCollection(collection) {
     return collection != 'analytics_visitors' &&
            collection != 'analytics_pageviews' &&
            collection != 'analytics_events' &&
            collection != 'analytics_stats' &&
            collection != 'analytics_page_times' &&
            collection != 'analytics_media_clicks' &&
            collection != 'analytics_sessions' &&
            collection != 'analytics_YOUR_COLLECTION'; // ADD THIS
   }
   ```

3. **Deploy the updated rules**:
   ```bash
   firebase deploy --only firestore:rules
   ```

4. **Update this documentation**:
   - Add your new collection to the "Current Analytics Collections" list above
   - Document what data it stores and its purpose

## Security Principles

### Read Access
- **Analytics collections**: Only users with role "humza" can read
- **Users collection**: Users can only read their own document
- **All other collections**: Public read access (anyone can read)

### Write Access
- **Analytics collections**: Anyone can write (including anonymous users) - this enables visitor tracking without requiring authentication
- **Users collection**: Users can only create/update their own document
- **All other collections**: Public write access (anyone can write)

### Delete Access
- **Analytics collections**: Delete is explicitly denied (`allow delete: if false`) to prevent accidental data loss
- **Users collection**: Delete not explicitly allowed (implicit deny)
- **All other collections**: Delete allowed (through catch-all rule)

## Helper Functions

### `isHumzaUser()`
Checks if the authenticated user has the "humza" role by:
1. Verifying user is authenticated (`request.auth != null`)
2. Checking if user document exists in `users` collection
3. Verifying the role field equals "humza"

### `isNotAnalyticsCollection(collection)`
Checks if a collection name is NOT an analytics collection. Used to exclude analytics collections from the catch-all public access rule.

## Testing Rules

After updating rules, test:
1. **Unauthenticated user** can write to analytics collections ✓
2. **Unauthenticated user** cannot read analytics collections ✓
3. **User with role "humza"** can read analytics collections ✓
4. **User with role "humza"** can write to analytics collections ✓
5. **Regular user** cannot read analytics collections ✓
6. **No user** can delete analytics collection documents ✓

## Common Patterns

### Pattern 1: Adding a New Analytics Collection
```javascript
// 1. Add match rule
match /analytics_NEW_COLLECTION/{document=**} {
  allow read: if isHumzaUser();
  allow write: if true;
  allow delete: if false;
}

// 2. Update helper function
function isNotAnalyticsCollection(collection) {
  // ... existing checks ...
  return ... && collection != 'analytics_NEW_COLLECTION';
}
```

### Pattern 2: Adding a New Public Collection
No changes needed - the catch-all rule will handle it automatically.

### Pattern 3: Adding a Collection with Custom Rules
Add specific rules BEFORE the catch-all rule, as rules are evaluated in order and more specific rules take precedence.

## Deployment Checklist

Before deploying updated rules:

- [ ] All new analytics collections are added to rules
- [ ] `isNotAnalyticsCollection` function is updated
- [ ] Rules are tested locally (if possible)
- [ ] Documentation is updated
- [ ] Rules are deployed: `firebase deploy --only firestore:rules`
- [ ] Rules are verified in Firebase Console after deployment

## File Locations

- **Firestore Rules**: `firestore.rules` (root directory)
- **Firebase Config**: `firebase.json` (root directory)
- **Documentation**: `.cursor/firestore-rules-maintenance.md` (this file)

## Important Notes

1. **Always update the helper function** when adding new analytics collections - otherwise the catch-all rule will override the restrictive rules.

2. **Deploy rules immediately** after adding new analytics collections - unprotected collections could expose sensitive data.

3. **Test rules after deployment** - verify that read access is properly restricted for non-humza users.

4. **Keep documentation updated** - This file should always reflect the current state of analytics collections and rules.

5. **Use consistent naming** - Analytics collections should follow the pattern `analytics_*` for easy identification and maintenance.

## Troubleshooting

### Issue: Users can read analytics collections even though they shouldn't
- **Check**: Is the collection added to `isNotAnalyticsCollection` function?
- **Check**: Are rules deployed? (`firebase deploy --only firestore:rules`)
- **Check**: Is the user's role correctly set to "humza" in Firestore?

### Issue: Anonymous users cannot write to analytics collections
- **Check**: Is `allow write: if true;` set in the collection rule?
- **Check**: Are rules deployed?

### Issue: Analytics data is being deleted
- **Check**: Is `allow delete: if false;` set in the collection rule?
- **Check**: Are rules deployed?

## Contact

For questions or issues with Firestore rules, refer to this document or the Firebase Security Rules documentation: https://firebase.google.com/docs/firestore/security/get-started
