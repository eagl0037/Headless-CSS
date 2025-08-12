# CineReview - Movie Review Site

## Project Overview

**CineReview** is a modern movie review platform built with a headless CMS architecture. The site features a sleek, Netflix-inspired design that allows users to browse, search, and read detailed movie reviews. Built as a collaborative team project demonstrating full-stack web development skills.


# CineReview CMS

A simple movie review management system with a modern interface.

## What It Is

CineReview CMS is a web-based admin panel for managing movie reviews. Think of it like WordPress but specifically for movie content. You can:

- Add movie reviews with ratings, posters, and details
- See all your movies in a searchable table
- Get dashboard statistics (total movies, views, likes)
- Publish or save movies as drafts

## How It Works

**Frontend**: Single HTML file with everything built-in
- Uses Bootstrap for styling
- JavaScript handles all the functionality
- Works in any modern web browser
- No server setup required for demo mode

**Backend**: Connects to any REST API
- Sends HTTP requests (GET, POST, PUT, DELETE) 
- Currently uses a demo API for testing
- Easy to switch to your own API

**Data Flow**:
1. You interact with the web interface
2. JavaScript makes API calls to your server
3. Server responds with data (movies, user info, etc.)
4. Interface updates to show the results

## Quick Start

1. **Download the HTML file**
2. **Open it in a web browser**
3. **Login with any email/password**
4. **Start managing movies!**

## Features

- Add, edit, delete movies
- Dashboard with statistics
- Search and filter movies
- Responsive design
- Works offline (demo mode)

## Using with Your API

Replace this line in the code:

```javascript
API_BASE_URL: 'https://jsonplaceholder.typicode.com'
```

With your API URL:

```javascript
API_BASE_URL: 'https://your-api.com/api'
```

## API Endpoints Needed

- `GET /movies` - Get all movies
- `POST /movies` - Create movie
- `PUT /movies/:id` - Update movie  
- `DELETE /movies/:id` - Delete movie
- `POST /auth/login` - Login

## That's it!

No installation, no dependencies. Just open the HTML file and it works.
