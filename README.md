# CineReview - Movie Review Site

## Project Overview

**CineReview** is a modern movie review platform built with a headless CMS architecture. The site features a sleek, Netflix-inspired design that allows users to browse, search, and read detailed movie reviews. Built as a collaborative team project demonstrating full-stack web development skills.

### Review Site Type
**Movie Reviews** - Comprehensive reviews covering blockbusters, indie films, and cinema classics across all genres.

###  Technology Stack

#### Frontend
- **Framework**: Vanilla JavaScript with modern ES6+ features
- **CSS Framework**: Bootstrap 5.3.0
- **Icons**: Font Awesome 6.4.0
- **Design**: Custom CSS with CSS Grid and Flexbox
- **Responsive**: Mobile-first approach

#### Backend (Headless CMS)
- **CMS Choice**: [To be selected - Strapi/Sanity/Contentful]
- **API**: RESTful API endpoints
- **Data Format**: JSON
- **Hosting**: [To be determined based on CMS choice]

##  Features

###  Core Requirements Met
- [x] **10+ Reviews**: 12 comprehensive movie reviews included
- [x] **Search Functionality**: Real-time search across titles, genres, reviewers, and descriptions
- [x] **Individual Review Pages**: Modal-based full review display
- [x] **Responsive Design**: Optimized for mobile, tablet, and desktop
- [x] **Site Navigation**: Smooth scrolling navigation with mobile hamburger menu
- [x] **REST API Integration**: Ready for headless CMS data consumption

### Enhanced Features
- **Genre Filtering**: Filter movies by Action, Drama, Comedy, Sci-Fi, Horror
- **Star Rating System**: Visual 1-10 rating display
- **Modern UI/UX**: Dark theme with hover animations and transitions
- **Search Highlighting**: Real-time search with no-results handling
- **Reviewer Attribution**: Author and publication date for each review
- **Optimized Performance**: Efficient rendering and smooth interactions

## Project Structure

```
CineReview/
├── frontend/
│   ├── index.html              # Main application file
│   ├── assets/
│   │   ├── css/
│   │   │   └── styles.css      # Custom styling
│   │   ├── js/
│   │   │   └── app.js          # Application logic
│   │   └── images/             # Static images
│   └── README.md               # Frontend documentation
├── backend/
│   ├── [CMS-specific files]    # Headless CMS configuration
│   ├── api/                    # API endpoints
│   ├── models/                 # Data models
│   └── README.md               # Backend documentation
└── docs/
    ├── API.md                  # API documentation
    └── DEPLOYMENT.md           # Deployment guide
```

##  Team Members

- **Team Leader**: Natasha Eagles 
- Michael Stuff
- Ali Elsharkawy


##  Getting Started

### Prerequisites
- Node.js (
- Git
- VS Code 

### Frontend Setup
```bash
# Clone the repository
git clone [frontend-repository-url]
cd cinereview-frontend

# Open with live server or serve locally
# Option 1: Using VS Code Live Server extension
# Option 2: Using Python
python -m http.server 8000

# Option 3: Using Node.js http-server
npx http-server
```

### Backend Setup
```bash
# Clone the CMS repository
git clone [backend-repository-url]
cd cinereview-cms

# Install dependencies 
npm install

# Set up environment variables
cp .env.example .env

# Start development server
npm run develop
```

## Data Schema

### Movie Review Model
```json
{
  "id": "number",
  "title": "string",
  "genre": "string",
  "rating": "number (1-10)",
  "year": "number",
  "poster": "string (URL)",
  "description": "string",
  "review": "text (full review content)",
  "reviewer": "string",
  "date": "date",
  "tags": "array of strings"
}
```

### API Endpoints
- `GET /api/movies` - Fetch all movie reviews
- `GET /api/movies/:id` - Fetch specific movie review
- `GET /api/movies?search=query` - Search movie reviews
- `GET /api/movies?genre=genre` - Filter by genre

##  Design System

### Color Palette
- **Primary**: #e50914 (Netflix Red)
- **Secondary**: #221f1f (Dark Gray)
- **Background**: #141414 (Netflix Black)
- **Text Light**: #ffffff
- **Text Muted**: #b3b3b3

### Typography
- **Font Family**: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- **Headings**: Bold weights with gradient effects
- **Body**: Regular weight, optimized line height for readability

### Components
- **Movie Cards**: Hover animations with shadow effects
- **Search Bar**: Rounded with focus states
- **Filter Buttons**: Toggle states with smooth transitions
- **Modals**: Full-screen overlay for review reading


##  Testing

### Manual Testing Checklist
- [ ] All movie cards display correctly
- [ ] Search functionality works across all fields
- [ ] Genre filters function properly
- [ ] Modal popups display full reviews
- [ ] Responsive design works on mobile/tablet
- [ ] Navigation links scroll smoothly
- [ ] No console errors in browser

### Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 📱 Responsive Breakpoints

- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+
- **Large Desktop**: 1200px+

##  Development Workflow

### Git Workflow
1. Create feature branch: `git checkout -b feature/[feature-name]`
2. Make changes and commit: `git commit -m "Add [feature]"`
3. Push to remote: `git push origin feature/[feature-name]`
4. Create pull request for team review
5. Merge to main after approval

### Code Standards
- Use consistent indentation (2 spaces)
- Follow semantic HTML5 structure
- Use CSS BEM methodology for class names
- Comment complex JavaScript functions
- Optimize images for web delivery

## 🚧Future Enhancements

### Phase 2 Features
- User authentication and profiles
- Rating and commenting system
- Advanced search filters (year, rating range)
- Pagination for large datasets
- Social media sharing
- Email newsletter signup

### Technical Improvements
- Progressive Web App (PWA) features
- Image lazy loading optimization
- Search engine optimization (SEO)
- Analytics integration
- Performance monitoring

## Known Issues

- [ ] Search results could benefit from fuzzy matching
- [ ] Image loading states not implemented
- [ ] No offline functionality yet

##  Resources

### Documentation
- [Bootstrap 5 Documentation](https://getbootstrap.com/docs/5.3/)
- [Font Awesome Icons](https://fontawesome.com/icons)
- [MDN Web Docs](https://developer.mozilla.org/)

### CMS Resources
- [Strapi Documentation](https://docs.strapi.io/)
- [Sanity Documentation](https://www.sanity.io/docs)
- [Contentful Documentation](https://www.contentful.com/developers/docs/)

##  License

This project is created for educational purposes as part of a web development course.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request
