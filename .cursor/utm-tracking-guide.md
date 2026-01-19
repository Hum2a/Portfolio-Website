# UTM Parameter Tracking Guide

## Overview
Your portfolio now tracks campaign sources, allowing you to see exactly where your visitors are coming from, even when the referrer shows as "direct".

## How It Works
When someone visits your site with special parameters in the URL, the system captures and stores this information along with their visit data.

## URL Parameters Supported

### Standard UTM Parameters (Recommended)
- `utm_source` - The source of the traffic (e.g., linkedin, discord, cv, whatsapp)
- `utm_medium` - The medium (e.g., social, email, pdf, message)
- `utm_campaign` - Campaign name (e.g., job-search-2026, networking)
- `utm_term` - Keywords (optional)
- `utm_content` - Content identifier (optional)

### Custom Parameters (Alternative)
- `source` or `ref` - Simple source identifier

## Example URLs for Different Sources

### LinkedIn
```
https://yourportfolio.com?utm_source=linkedin&utm_medium=social&utm_campaign=job-search
```

### Discord
```
https://yourportfolio.com?utm_source=discord&utm_medium=message&utm_campaign=networking
```

### WhatsApp
```
https://yourportfolio.com?utm_source=whatsapp&utm_medium=chat
```

### Your CV (PDF)
```
https://yourportfolio.com?utm_source=cv&utm_medium=pdf&utm_campaign=job-applications
```

### Email Signature
```
https://yourportfolio.com?utm_source=email-signature&utm_medium=email
```

### GitHub Profile
```
https://yourportfolio.com?utm_source=github&utm_medium=profile
```

### Twitter/X
```
https://yourportfolio.com?utm_source=twitter&utm_medium=social
```

### Simple Version (using custom parameter)
```
https://yourportfolio.com?source=linkedin
https://yourportfolio.com?source=cv
https://yourportfolio.com?ref=discord
```

## Where to Add These URLs

### 1. **LinkedIn**
   - Profile "Website" field
   - Posts and articles
   - InMail messages
   - Bio sections

### 2. **CV/Resume (PDF)**
   - In the contact section
   - Next to your portfolio link
   - In the header or footer

### 3. **Discord**
   - Server profile
   - Direct messages
   - Channel descriptions

### 4. **WhatsApp**
   - Status updates
   - Bio
   - Messages

### 5. **Email Signature**
   - Add to your signature with proper tracking

### 6. **GitHub Profile**
   - Profile README
   - Repository links
   - Project descriptions

## Creating Shortened URLs

You can use URL shorteners with UTM parameters:

1. Create your full URL with parameters
2. Use a shortener like:
   - Bitly: https://bitly.com
   - TinyURL: https://tinyurl.com
   - Rebrandly: https://www.rebrandly.com

Example:
```
Original: https://yourportfolio.com?utm_source=linkedin&utm_medium=social
Shortened: https://bit.ly/your-portfolio
```

## Viewing Campaign Data

Once visitors arrive via these URLs, you can see the campaign data in your Traffic dashboard:

1. Go to `/traffic` page
2. Click on "Visitors" tab
3. Expand any visitor
4. Go to "Visit History" tab
5. Look for the "Campaign Source" field in each session

Campaign data will show:
- **Campaign Source** - Where they came from (highlighted badge)
- **Medium** - How they arrived
- **Campaign** - Which campaign
- **Landing Page** - The exact URL they landed on

## Best Practices

1. **Be Consistent**: Use the same source names across all platforms
   - Good: `utm_source=linkedin`
   - Avoid: Sometimes `linkedin`, sometimes `LinkedIn`, sometimes `ln`

2. **Be Descriptive**: Use meaningful campaign names
   - Good: `utm_campaign=q1-2026-job-search`
   - Avoid: `utm_campaign=test1`

3. **Keep It Simple**: For personal use, `source` parameter might be enough
   ```
   ?source=linkedin
   ?source=cv
   ?source=discord
   ```

4. **Test Your Links**: Click them yourself to make sure they work

5. **Update Regularly**: 
   - Change campaign names for different job search periods
   - Use different campaigns for different types of networking

## Tools to Generate UTM URLs

### Online Generators
- [Google Campaign URL Builder](https://ga-dev-tools.google/campaign-url-builder/)
- [UTM.io](https://utm.io/)

### Example Spreadsheet Template
Create a spreadsheet to manage your URLs:

| Platform | Source | Medium | Campaign | Full URL |
|----------|--------|--------|----------|----------|
| LinkedIn | linkedin | social | job-search-2026 | https://yourportfolio.com?utm_source=linkedin&utm_medium=social&utm_campaign=job-search-2026 |
| CV PDF | cv | pdf | applications | https://yourportfolio.com?utm_source=cv&utm_medium=pdf&utm_campaign=applications |
| Discord | discord | chat | networking | https://yourportfolio.com?utm_source=discord&utm_medium=chat&utm_campaign=networking |

## Tracking Impact

After setting up your URLs, you'll be able to answer questions like:
- How many people visited from my LinkedIn profile?
- Is my CV generating traffic?
- Which platform brings the most visitors?
- When do people from different sources visit?

## Notes

- UTM parameters don't affect your website functionality
- They're only visible in the URL, not to regular visitors
- The data is stored with each visitor session
- Previous visitors without UTM parameters will still show as "direct" with their referrer
- New visitors with UTM parameters will have campaign data tracked

## Quick Reference Card

**Simple Format:**
```
https://yourportfolio.com?source=PLATFORM_NAME
```

**Full Format:**
```
https://yourportfolio.com?utm_source=SOURCE&utm_medium=MEDIUM&utm_campaign=CAMPAIGN
```

**Common Sources to Track:**
- linkedin
- cv
- resume
- discord
- whatsapp
- twitter
- github
- email-signature
- business-card
- networking-event
