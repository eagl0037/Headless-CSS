// server.js - Express.js Server with REST API
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Data storage (in production, use a real database like MongoDB, PostgreSQL, etc.)
let movies = [
  {
    id: 1,
    title: "The Dark Knight",
    slug: "the-dark-knight",
    genre: "Action",
    rating: 9.0,
    year: 2008,
    director: "Christopher Nolan",
    duration: "152 min",
    poster: "https://images.unsplash.com/photo-1489599162993-6c5c82dfee8a?w=400&h=600&fit=crop",
    description: "When the menace known as the Joker emerges, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    review: "Christopher Nolan's masterpiece delivers a gripping tale of heroism and chaos that transcends the superhero genre. Heath Ledger's portrayal of the Joker is absolutely phenomenal, bringing a terrifying yet captivating energy to every scene he dominates...",
    reviewer: "Alex Thompson",
    reviewerTitle: "Senior Film Critic",
    reviewerEmail: "alex@cinereview.com",
    publishedAt: "2024-01-15T10:00:00Z",
    status: "published",
    tags: ["superhero", "psychological thriller", "masterpiece"],
    featured: true,
    views: 1520,
    likes: 89,
    metaDescription: "Expert review of The Dark Knight - Christopher Nolan's superhero masterpiece",
    metaKeywords: ["Dark Knight", "Batman", "Joker", "Heath Ledger", "Christopher Nolan"]
  },
  {
    id: 2,
    title: "Pulp Fiction",
    slug: "pulp-fiction",
    genre: "Drama",
    rating: 8.9,
    year: 1994,
    director: "Quentin Tarantino",
    duration: "154 min",
    poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop",
    description: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    review: "Quentin Tarantino's non-linear narrative creates a unique cinematic experience that keeps viewers engaged from start to finish. The dialogue is sharp, witty, and memorable...",
    reviewer: "Sarah Martinez",
    reviewerTitle: "Film Studies Professor",
    reviewerEmail: "sarah@cinereview.com",
    publishedAt: "2024-01-10T14:30:00Z",
    status: "published",
    tags: ["crime", "nonlinear", "classic"],
    featured: false,
    views: 983,
    likes: 67,
    metaDescription: "Professional review of Pulp Fiction - Tarantino's crime masterpiece",
    metaKeywords: ["Pulp Fiction", "Tarantino", "John Travolta", "Samuel L Jackson"]
  },
  // Add more movies as needed...
];

let users = [
  {
    id: 1,
    email: "admin@cinereview.com",
    password: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy", // password: admin123
    role: "admin",
    name: "Admin User",
    createdAt: "2024-01-01T00:00:00Z"
  }
];

let reviews = [];
let settings = {
  siteName: "CineReview Pro",
  siteDescription: "Professional movie reviews and ratings",
  contactEmail: "contact@cinereview.com",
  socialMedia: {
    twitter: "@cinereviewpro",
    facebook: "cinereviewpro",
    instagram: "cinereviewpro"
  }
};

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Admin middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Helper function to save data (in production, use a real database)
const saveData = async () => {
  try {
    await fs.writeFile('./data.json', JSON.stringify({ movies, users, reviews, settings }, null, 2));
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

// Helper function to load data
const loadData = async () => {
  try {
    const data = await fs.readFile('./data.json', 'utf8');
    const parsed = JSON.parse(data);
    movies = parsed.movies || movies;
    users = parsed.users || users;
    reviews = parsed.reviews || reviews;
    settings = parsed.settings || settings;
  } catch (error) {
    console.log('No existing data file found, using default data');
  }
};

// Load data on startup
loadData();

// ===============================
// PUBLIC API ENDPOINTS
// ===============================

// Get all published movies with filtering and pagination
app.get('/api/movies', (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12,
      genre,
      rating,
      year,
      search,
      sort = 'publishedAt',
      order = 'desc',
      featured
    } = req.query;

    let filteredMovies = movies.filter(movie => movie.status === 'published');

    // Apply filters
    if (genre && genre !== 'all') {
      filteredMovies = filteredMovies.filter(movie => 
        movie.genre.toLowerCase() === genre.toLowerCase()
      );
    }

    if (rating) {
      const minRating = parseFloat(rating.replace('+', ''));
      filteredMovies = filteredMovies.filter(movie => movie.rating >= minRating);
    }

    if (year) {
      filteredMovies = filteredMovies.filter(movie => movie.year == year);
    }

    if (featured === 'true') {
      filteredMovies = filteredMovies.filter(movie => movie.featured);
    }

    if (search) {
      const searchTerm = search.toLowerCase();
      filteredMovies = filteredMovies.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm) ||
        movie.description.toLowerCase().includes(searchTerm) ||
        movie.genre.toLowerCase().includes(searchTerm) ||
        movie.director.toLowerCase().includes(searchTerm) ||
        movie.reviewer.toLowerCase().includes(searchTerm) ||
        movie.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Apply sorting
    filteredMovies.sort((a, b) => {
      let aValue = a[sort];
      let bValue = b[sort];
      
      if (sort === 'title') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (order === 'desc') {
        return bValue > aValue ? 1 : bValue < aValue ? -1 : 0;
      } else {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      }
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedMovies = filteredMovies.slice(startIndex, endIndex);

    // Calculate pagination info
    const totalMovies = filteredMovies.length;
    const totalPages = Math.ceil(totalMovies / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      success: true,
      data: paginatedMovies,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalMovies,
        hasNextPage,
        hasPrevPage,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single movie by ID or slug
app.get('/api/movies/:identifier', (req, res) => {
  try {
    const { identifier } = req.params;
    const movie = movies.find(m => 
      (m.id == identifier || m.slug === identifier) && m.status === 'published'
    );

    if (!movie) {
      return res.status(404).json({ success: false, error: 'Movie not found' });
    }

    // Increment view count
    movie.views = (movie.views || 0) + 1;
    saveData();

    res.json({ success: true, data: movie });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get movie statistics
app.get('/api/movies/stats', (req, res) => {
  try {
    const publishedMovies = movies.filter(m => m.status === 'published');
    const genres = [...new Set(publishedMovies.map(m => m.genre))];
    const reviewers = [...new Set(publishedMovies.map(m => m.reviewer))];
    const avgRating = publishedMovies.reduce((sum, m) => sum + m.rating, 0) / publishedMovies.length;

    res.json({
      success: true,
      data: {
        totalMovies: publishedMovies.length,
        totalGenres: genres.length,
        totalReviewers: reviewers.length,
        averageRating: parseFloat(avgRating.toFixed(1)),
        genres,
        reviewers
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get featured movies
app.get('/api/movies/featured', (req, res) => {
  try {
    const featuredMovies = movies.filter(m => m.status === 'published' && m.featured);
    res.json({ success: true, data: featuredMovies });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get site settings
app.get('/api/settings', (req, res) => {
  try {
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ===============================
// AUTHENTICATION ENDPOINTS
// ===============================

// User login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Verify token
app.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({ success: true, data: req.user });
});

// ===============================
// ADMIN ENDPOINTS (Protected)
// ===============================

// Get all movies (including unpublished)
app.get('/api/admin/movies', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { page = 1, limit = 12, status, search } = req.query;

    let filteredMovies = [...movies];

    if (status && status !== 'all') {
      filteredMovies = filteredMovies.filter(movie => movie.status === status);
    }

    if (search) {
      const searchTerm = search.toLowerCase();
      filteredMovies = filteredMovies.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm) ||
        movie.reviewer.toLowerCase().includes(searchTerm)
      );
    }

    // Sort by creation date (newest first)
    filteredMovies.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedMovies = filteredMovies.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedMovies,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredMovies.length / limit),
        totalMovies: filteredMovies.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new movie
app.post('/api/admin/movies', authenticateToken, requireAdmin, upload.single('poster'), async (req, res) => {
  try {
    const movieData = req.body;
    
    // Generate slug from title
    const slug = movieData.title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');

    // Check if slug already exists
    if (movies.some(m => m.slug === slug)) {
      return res.status(400).json({ success: false, error: 'Movie with this title already exists' });
    }

    const newMovie = {
      id: movies.length > 0 ? Math.max(...movies.map(m => m.id)) + 1 : 1,
      slug,
      poster: req.file ? `/uploads/${req.file.filename}` : movieData.poster,
      publishedAt: new Date().toISOString(),
      status: movieData.status || 'draft',
      views: 0,
      likes: 0,
      tags: movieData.tags ? JSON.parse(movieData.tags) : [],
      featured: movieData.featured === 'true',
      ...movieData
    };

    movies.push(newMovie);
    await saveData();

    res.status(201).json({ success: true, data: newMovie });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update movie
app.put('/api/admin/movies/:id', authenticateToken, requireAdmin, upload.single('poster'), async (req, res) => {
  try {
    const { id } = req.params;
    const movieIndex = movies.findIndex(m => m.id == id);

    if (movieIndex === -1) {
      return res.status(404).json({ success: false, error: 'Movie not found' });
    }

    const movieData = req.body;
    
    // Update slug if title changed
    if (movieData.title && movieData.title !== movies[movieIndex].title) {
      const newSlug = movieData.title.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
      
      if (movies.some(m => m.slug === newSlug && m.id != id)) {
        return res.status(400).json({ success: false, error: 'Movie with this title already exists' });
      }
      
      movieData.slug = newSlug;
    }

    // Handle poster upload
    if (req.file) {
      movieData.poster = `/uploads/${req.file.filename}`;
    }

    // Parse tags if provided
    if (movieData.tags && typeof movieData.tags === 'string') {
      movieData.tags = JSON.parse(movieData.tags);
    }

    // Handle boolean fields
    if (movieData.featured) {
      movieData.featured = movieData.featured === 'true';
    }

    movies[movieIndex] = { ...movies[movieIndex], ...movieData };
    await saveData();

    res.json({ success: true, data: movies[movieIndex] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete movie
app.delete('/api/admin/movies/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const movieIndex = movies.findIndex(m => m.id == id);

    if (movieIndex === -1) {
      return res.status(404).json({ success: false, error: 'Movie not found' });
    }

    movies.splice(movieIndex, 1);
    await saveData();

    res.json({ success: true, message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update site settings
app.put('/api/admin/settings', authenticateToken, requireAdmin, async (req, res) => {
  try {
    settings = { ...settings, ...req.body };
    await saveData();
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get dashboard stats
app.get('/api/admin/dashboard', authenticateToken, requireAdmin, (req, res) => {
  try {
    const publishedMovies = movies.filter(m => m.status === 'published');
    const draftMovies = movies.filter(m => m.status === 'draft');
    const featuredMovies = movies.filter(m => m.featured);
    const totalViews = movies.reduce((sum, m) => sum + (m.views || 0), 0);
    const totalLikes = movies.reduce((sum, m) => sum + (m.likes || 0), 0);

    res.json({
      success: true,
      data: {
        totalMovies: movies.length,
        publishedMovies: publishedMovies.length,
        draftMovies: draftMovies.length,
        featuredMovies: featuredMovies.length,
        totalViews,
        totalLikes,
        recentMovies: movies
          .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
          .slice(0, 5)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// File upload endpoint
app.post('/api/admin/upload', authenticateToken, requireAdmin, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    res.json({
      success: true,
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        url: `/uploads/${req.file.filename}`,
        size: req.file.size
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ===============================
// ERROR HANDLING MIDDLEWARE
// ===============================

// Handle multer errors
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ success: false, error: 'File too large' });
    }
  }
  
  if (error.message === 'Only image files are allowed!') {
    return res.status(400).json({ success: false, error: 'Only image files are allowed' });
  }
  
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 CineReview CMS API Server running on port ${PORT}`);
  console.log(`📚 API Documentation available at http://localhost:${PORT}/api`);
  console.log(`🔐 Admin login: admin@cinereview.com / admin123`);
  
  // Create uploads directory if it doesn't exist
  const uploadsDir = './uploads';
  if (!require('fs').existsSync(uploadsDir)) {
    require('fs').mkdirSync(uploadsDir);
    console.log('📁 Created uploads directory');
  }
});

module.exports = app;