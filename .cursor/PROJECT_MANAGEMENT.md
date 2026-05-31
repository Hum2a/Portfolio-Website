# Project Management Guide

## Adding a New Project

To add a new project to your portfolio, follow these steps:

### 1. Add Project Data

Edit `src/config/projects.json` and add your project to the `projects` array:

```json
{
  "id": "project-id",
  "name": "Project Name",
  "description": "Brief description of the project",
  "logo": "ProjectLogo.png",
  "route": "/project-route",
  "tags": ["JavaScript", "React.js", "Node.js"],
  "visible": true,
  "featured": false,
  "priority": 1
}
```

**Fields:**
- `id`: Unique identifier (lowercase, no spaces)
- `name`: Display name of the project
- `description`: Short description shown on project cards
- `logo`: Filename of the logo image (must be in `public/logos/`)
- `route`: URL route for the project detail page
- `tags`: Array of technology tags
- `visible`: Whether to show in the projects list
- `featured`: Whether to highlight as featured project
- `priority`: Display priority (1 = highest, 3 = lowest)

### 2. Add Project Logo

Place your project logo in `public/logos/` directory with the exact filename specified in the JSON.

### 3. Create Project Detail Page

Create a new component in `src/projects/ProjectName.js`:

```javascript
import React from "react";
import Navbar from "../components/Navbar";
import "../styles/ProjectName.css";

const ProjectName = () => {
  return (
    <div className="project-detail">
      <Navbar />
      <div className="project-content">
        {/* Your project content here */}
      </div>
    </div>
  );
};

export default ProjectName;
```

### 4. Add Route

Edit `src/routes/AppRoutes.js` and add the route:

```javascript
import ProjectName from "../projects/ProjectName";

// In the Routes component:
<Route path="/project-route" element={<ProjectName />} />
```

### 5. Create Styles (Optional)

Create `src/styles/ProjectName.css` for project-specific styles.

## Updating Project Information

Simply edit `src/config/projects.json` and update the relevant fields. The changes will automatically reflect across the site.

## Project Visibility

- Set `visible: false` to hide a project from the main list
- Set `featured: true` to highlight important projects
- Adjust `priority` to control display order (lower numbers appear first)

## Tags

Tags are automatically extracted from all visible projects and displayed as filter buttons. Use consistent tag names across projects for better filtering.

Common tags:
- Technologies: `JavaScript`, `React.js`, `Node.js`, `TypeScript`, `Python`
- Platforms: `WebApp`, `Android`, `IOS`
- Categories: `EdTech`, `FinTech`, `HealthTech`, `FoodTech`, `AI`
