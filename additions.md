# Enhanced Romantic Couple Website: Harry Potter × The Notebook Theme

**[All previous content remains the same until Section 11. Here are the additions and modifications:]**

---

## NEW SECTION: Authentication & User Management

### 18. Authentication System:

#### Authentication Provider:
- **Primary**: Supabase Auth (built-in authentication)
- **Alternative**: NextAuth.js with multiple providers
- **Session Management**: JWT tokens with refresh mechanism
- **Security**: Row-level security (RLS) policies

#### User Roles & Permissions:

**Couple Account Structure:**
- **Primary Users**: Ichrak and Yassine (two separate accounts)
- **Shared Data**: Both users can access and modify all content
- **Private Data**: Optional private notes/drafts only owner can see
- **Guest Access**: Optional read-only view for selected content

**User Schema:**
```typescript
interface User {
  id: string; // UUID
  email: string;
  name: "Ichrak" | "Yassine";
  role: "primary" | "guest";
  avatar_url?: string;
  created_at: string;
  last_login: string;
  preferences: UserPreferences;
}

interface UserPreferences {
  theme: "light" | "dark";
  sound_enabled: boolean;
  volume_level: number; // 0-100
  notifications_enabled: boolean;
  language: string;
}
```

#### Authentication Flows:

**1. Sign Up Flow:**
- **Step 1**: Email verification required
- **Step 2**: Create profile (name, avatar optional)
- **Step 3**: Link to couple account (unique couple ID)
- **Step 4**: Accept terms and privacy policy
- **Design**: 
  - Background: Dark card with Wine Red accents
  - Form: Clean, centered layout
  - Validation: Real-time email/password checks
  - Password strength: Visual indicator

**2. Login Flow:**
- **Email/Password**: Standard login
- **Magic Link**: Passwordless email link (optional)
- **Remember Me**: Checkbox for persistent session
- **Forgot Password**: Reset via email
- **Design**:
  - Hero image: Romantic background with form overlay
  - "Welcome Back" message with user name
  - Smooth transition to dashboard

**3. Account Linking:**
- **Couple Code**: Unique code to link two accounts
- **Process**:
  1. First user creates account → generates couple code
  2. Second user signs up → enters couple code
  3. Both accounts linked to shared data space
- **Security**: Code expires after 7 days or first use

**4. Password Requirements:**
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 number
- At least 1 special character
- Not previously breached (check against HaveIBeenPwned API)

**5. Two-Factor Authentication (Optional):**
- **Methods**: SMS, Authenticator app, Email
- **Setup**: In account settings
- **Enforcement**: Optional or required by user choice
- **Recovery Codes**: Generate 10 backup codes

#### Protected Routes:

**Public Routes** (No Auth Required):
- `/` - Landing page (marketing/intro)
- `/login` - Login page
- `/signup` - Registration page
- `/forgot-password` - Password reset
- `/terms` - Terms of service
- `/privacy` - Privacy policy

**Protected Routes** (Auth Required):
- `/home` - Homepage (relationship counter)
- `/gallery` - Photo gallery
- `/memories` - Memory jar
- `/letters` - Love letters
- `/playlist` - Shared playlist
- `/library` - Books & movies
- `/adventures` - Adventures pages
- `/settings` - Account settings
- `/profile` - User profile

**Route Guards:**
```typescript
// Middleware to protect routes
export async function middleware(request: NextRequest) {
  const session = await getSession(request);
  
  if (!session && isProtectedRoute(request.nextUrl.pathname)) {
    return NextResponse.redirect('/login');
  }
  
  return NextResponse.next();
}
```

#### Session Management:

**Session Duration:**
- **Default**: 7 days with activity refresh
- **Remember Me**: 30 days
- **Idle Timeout**: 24 hours of inactivity logs out
- **Refresh Token**: Auto-refresh 5 minutes before expiry

**Security Features:**
- **CSRF Protection**: Token validation on state changes
- **Session Hijacking Prevention**: IP and user agent validation
- **Concurrent Sessions**: Allow max 3 devices
- **Logout**: Clear all tokens and session data

#### User Profile Management:

**Profile Settings Page:**
- **Layout**: Two columns (left: nav, right: content)
- **Sections**:
  1. Personal Info (name, email, avatar)
  2. Password Change
  3. Preferences (theme, sound, notifications)
  4. Privacy Settings
  5. Account Linking Status
  6. Delete Account (with confirmation)

**Avatar Upload:**
- **Max Size**: 5MB
- **Formats**: JPG, PNG, WebP
- **Crop**: Square crop tool
- **Storage**: Supabase Storage bucket
- **Fallback**: Initials in colored circle

**Account Deletion:**
- **Process**: 
  1. Enter password confirmation
  2. Select data retention option:
     - Delete all data
     - Transfer data to partner
     - Export data before deletion
  3. 30-day grace period before permanent deletion
  4. Email notification to partner

---

## NEW SECTION: API Endpoints & External Integrations

### 19. API Endpoints:

#### Base URL Structure:
```
Production: https://api.example.com/v1
Development: http://localhost:3000/api
```

#### Authentication Headers:
```typescript
headers: {
  'Authorization': 'Bearer <JWT_TOKEN>',
  'Content-Type': 'application/json',
  'X-API-Version': 'v1'
}
```

---

### API 1: Image URL Access & Management

**Purpose**: Retrieve and manage uploaded photos with public/private URLs

#### Endpoints:

**1. Upload Image**
```typescript
POST /api/images/upload

Request:
- Method: POST (multipart/form-data)
- Body: {
    file: File, // Image file
    caption?: string,
    tags?: string[],
    is_private?: boolean,
    album_id?: string
  }

Response: {
  success: boolean,
  data: {
    id: string,
    url: string, // Public URL
    thumbnail_url: string,
    original_url: string, // Original size
    dimensions: { width: number, height: number },
    file_size: number, // bytes
    format: string, // 'jpg', 'png', 'webp'
    uploaded_at: string,
    uploaded_by: string, // user ID
    caption?: string,
    tags?: string[]
  },
  error?: string
}

Status Codes:
- 201: Created
- 400: Invalid file format or size
- 401: Unauthorized
- 413: File too large (>10MB)
- 500: Server error
```

**2. Get Image by ID**
```typescript
GET /api/images/:id

Query Params:
- size?: 'thumbnail' | 'medium' | 'large' | 'original'
- download?: boolean

Response: {
  success: boolean,
  data: {
    id: string,
    url: string,
    metadata: {
      caption: string,
      uploaded_at: string,
      uploaded_by: string,
      dimensions: { width: number, height: number },
      file_size: number,
      views: number
    }
  }
}

Status Codes:
- 200: Success
- 404: Image not found
- 401: Unauthorized
```

**3. Get All Images**
```typescript
GET /api/images

Query Params:
- page?: number (default: 1)
- limit?: number (default: 20, max: 100)
- sort?: 'date_asc' | 'date_desc' | 'size_asc' | 'size_desc'
- tags?: string[] (filter by tags)
- album_id?: string

Response: {
  success: boolean,
  data: {
    images: Image[],
    pagination: {
      page: number,
      limit: number,
      total: number,
      total_pages: number
    }
  }
}
```

**4. Update Image Metadata**
```typescript
PATCH /api/images/:id

Body: {
  caption?: string,
  tags?: string[],
  is_private?: boolean
}

Response: {
  success: boolean,
  data: Image,
  message: "Image updated successfully"
}
```

**5. Delete Image**
```typescript
DELETE /api/images/:id

Response: {
  success: boolean,
  message: "Image deleted successfully"
}

Status Codes:
- 200: Deleted
- 404: Not found
- 401: Unauthorized
- 403: Forbidden (not owner)
```

**6. Generate Signed URL (Temporary Access)**
```typescript
POST /api/images/:id/signed-url

Body: {
  expiry?: number // minutes (default: 60, max: 1440)
}

Response: {
  success: boolean,
  data: {
    signed_url: string,
    expires_at: string
  }
}

Use Case: Share private images temporarily
```

---

### API 2: External Media Metadata Fetching

**Purpose**: Automatically fetch posters, cover art, and metadata when users add movies, books, or songs

#### Integration Services:

**For Movies & TV Shows:**
- **Primary**: TMDb (The Movie Database) API
- **Alternative**: OMDb API
- **API Key**: Required (free tier: 1000 requests/day)

**For Books:**
- **Primary**: Google Books API
- **Alternative**: Open Library API
- **ISBN Lookup**: Both support ISBN-13 and ISBN-10

**For Songs/Albums:**
- **Primary**: Spotify API
- **Alternative**: iTunes Search API, Last.fm API
- **Album Art**: 300x300px minimum resolution

---

#### Movie/Series Metadata API:

**1. Search Movie/Series**
```typescript
POST /api/media/movies/search

Body: {
  title: string,
  year?: number,
  type?: 'movie' | 'series'
}

Response: {
  success: boolean,
  data: {
    results: [
      {
        id: string, // TMDb ID
        title: string,
        original_title: string,
        overview: string,
        poster_path: string, // URL to poster image
        backdrop_path: string, // URL to backdrop
        release_date: string,
        genres: string[],
        vote_average: number, // Rating 0-10
        runtime?: number, // minutes (for movies)
        number_of_seasons?: number, // for series
        production_companies: string[],
        streaming_platforms?: string[] // Netflix, etc.
      }
    ],
    total_results: number
  }
}

TMDb Poster URL Format:
https://image.tmdb.org/t/p/w500/{poster_path}

Example Implementation:
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

async function searchMovie(title: string, year?: number) {
  const response = await fetch(
    `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${title}&year=${year}`
  );
  return response.json();
}
```

**2. Get Movie Details by ID**
```typescript
GET /api/media/movies/:tmdb_id

Response: {
  success: boolean,
  data: {
    // Full movie details including:
    title: string,
    poster_url: string,
    backdrop_url: string,
    overview: string,
    genres: string[],
    release_date: string,
    runtime: number,
    rating: number,
    cast: Array<{ name: string, character: string }>,
    director: string,
    trailer_url?: string,
    imdb_id?: string
  }
}
```

**3. Auto-populate Movie Form**
```typescript
POST /api/media/movies/autofill

Body: {
  title: string,
  year?: number
}

Response: {
  success: boolean,
  data: {
    title: string,
    type: 'movie' | 'series',
    genres: string[],
    poster_url: string,
    release_year: number,
    rating: number,
    platforms: string[], // Detected streaming platforms
    overview: string
  },
  message: "Auto-filled from TMDb"
}

// This endpoint auto-populates the "Add Movie" form
// User can still edit before saving
```

---

#### Book Metadata API:

**1. Search Books by Title or ISBN**
```typescript
POST /api/media/books/search

Body: {
  query: string, // title or ISBN
  isbn?: string, // ISBN-13 or ISBN-10
  author?: string
}

Response: {
  success: boolean,
  data: {
    results: [
      {
        id: string, // Google Books ID
        title: string,
        authors: string[],
        publisher: string,
        published_date: string,
        isbn_13: string,
        isbn_10: string,
        page_count: number,
        categories: string[], // genres
        cover_image: string, // URL
        thumbnail: string, // smaller version
        description: string,
        language: string,
        average_rating?: number,
        ratings_count?: number
      }
    ],
    total_results: number
  }
}

Google Books API Example:
const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;

async function searchBook(isbn: string) {
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${GOOGLE_BOOKS_API_KEY}`
  );
  return response.json();
}

Cover Image URL Format:
volumeInfo.imageLinks.thumbnail (128x193px)
volumeInfo.imageLinks.smallThumbnail (80x128px)
// Replace zoom=1 with zoom=0 for higher resolution
```

**2. Get Book Details by ISBN**
```typescript
GET /api/media/books/isbn/:isbn

Response: {
  success: boolean,
  data: {
    title: string,
    authors: string[],
    cover_url: string,
    publisher: string,
    published_date: string,
    page_count: number,
    genres: string[],
    description: string,
    isbn_13: string,
    isbn_10: string,
    language: string
  }
}
```

**3. Auto-populate Book Form**
```typescript
POST /api/media/books/autofill

Body: {
  isbn?: string,
  title?: string,
  author?: string
}

Response: {
  success: boolean,
  data: {
    title: string,
    author: string,
    genres: string[],
    cover_url: string,
    page_count: number,
    isbn_13: string,
    description: string
  },
  message: "Auto-filled from Google Books"
}
```

---

#### Song/Album Metadata API:

**1. Search Songs**
```typescript
POST /api/media/songs/search

Body: {
  query: string, // "song title artist"
  track?: string,
  artist?: string,
  album?: string
}

Response: {
  success: boolean,
  data: {
    results: [
      {
        id: string, // Spotify track ID
        title: string,
        artist: string,
        album: string,
        album_art: string, // URL (640x640px)
        duration_ms: number,
        preview_url?: string, // 30s preview
        spotify_url: string,
        isrc?: string, // International Standard Recording Code
        release_date: string,
        genres?: string[]
      }
    ],
    total_results: number
  }
}

Spotify API Implementation:
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

// First, get access token
async function getSpotifyToken() {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(
        SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET
      ).toString('base64')
    },
    body: 'grant_type=client_credentials'
  });
  return response.json();
}

// Then search tracks
async function searchTrack(query: string, token: string) {
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${query}&type=track&limit=10`,
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );
  return response.json();
}
```

**2. Get Song by Spotify ID**
```typescript
GET /api/media/songs/spotify/:track_id

Response: {
  success: boolean,
  data: {
    title: string,
    artist: string,
    album: string,
    album_art_url: string,
    duration: string, // "3:45"
    spotify_url: string,
    preview_url?: string,
    release_date: string
  }
}
```

**3. Get Song by YouTube URL**
```typescript
POST /api/media/songs/youtube

Body: {
  youtube_url: string
}

Response: {
  success: boolean,
  data: {
    title: string,
    artist: string, // Extracted from title
    thumbnail_url: string,
    duration: string,
    youtube_id: string
  }
}

// Extract metadata from YouTube video
// Use YouTube Data API v3
```

**4. Auto-populate Song Form**
```typescript
POST /api/media/songs/autofill

Body: {
  title: string,
  artist: string,
  spotify_url?: string,
  youtube_url?: string
}

Response: {
  success: boolean,
  data: {
    title: string,
    artist: string,
    album: string,
    album_art_url: string,
    duration: string,
    spotify_url: string,
    youtube_url?: string
  },
  message: "Auto-filled from Spotify"
}
```

---

### API Integration in Forms:

#### Enhanced Add Movie Form:

**UI Flow:**
1. User enters movie title
2. Click "Search" or "Auto-Fill" button
3. API searches TMDb
4. Display results in dropdown/modal
5. User selects correct movie
6. Form auto-populates with metadata
7. User can edit before saving
8. Save to database with poster URL

**Implementation:**
```typescript
// Movie form component
const [searchResults, setSearchResults] = useState([]);
const [isSearching, setIsSearching] = useState(false);

async function handleAutoFill() {
  setIsSearching(true);
  
  const response = await fetch('/api/media/movies/autofill', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      title: movieTitle, 
      year: releaseYear 
    })
  });
  
  const result = await response.json();
  
  if (result.success) {
    // Auto-populate form fields
    setFormData({
      title: result.data.title,
      type: result.data.type,
      genres: result.data.genres,
      poster_url: result.data.poster_url,
      release_year: result.data.release_year,
      overview: result.data.overview
    });
    
    toast.success('Movie details auto-filled!');
  }
  
  setIsSearching(false);
}
```

**Form Button:**
```tsx
<button
  onClick={handleAutoFill}
  disabled={!movieTitle || isSearching}
  className="flex items-center gap-2 px-4 py-2 bg-amethyst rounded"
>
  {isSearching ? (
    <>
      <Loader2 className="w-4 h-4 animate-spin" />
      Searching...
    </>
  ) : (
    <>
      <Search className="w-4 h-4" />
      Auto-Fill from TMDb
    </>
  )}
</button>
```

#### Enhanced Add Book Form:

**UI Flow:**
1. User enters ISBN or book title
2. Click "Search ISBN" or "Search Title"
3. API queries Google Books
4. Display results
5. User selects book
6. Form auto-populates
7. User can edit
8. Save with cover image URL

**ISBN Barcode Scanner (Mobile):**
- Use device camera to scan ISBN barcode
- Extract ISBN-13 from barcode
- Auto-search using ISBN
- Library: `react-barcode-reader` or native camera API

#### Enhanced Add Song Form:

**UI Flow:**
1. User enters song title + artist
2. Click "Search Spotify"
3. Display search results with album art
4. User selects correct track
5. Form auto-populates with:
   - Title
   - Artist
   - Album
   - Album art URL
   - Duration
   - Spotify link
6. User can add YouTube link manually
7. Save to playlist

**Paste URL Auto-Detect:**
- If user pastes Spotify URL → Auto-fetch metadata
- If user pastes YouTube URL → Extract video title, thumbnail
- Parse and pre-fill form fields

---

### API Rate Limiting & Caching:

#### Rate Limiting:
```typescript
// Implement rate limiting middleware
import rateLimit from 'express-rate-limit';

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply to all API routes
app.use('/api/', apiLimiter);
```

#### Response Caching:
```typescript
// Cache API responses to reduce external API calls
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 3600 }); // 1 hour TTL

async function getCachedMovieData(title: string) {
  const cacheKey = `movie:${title.toLowerCase()}`;
  
  // Check cache first
  const cached = cache.get(cacheKey);
  if (cached) return cached;
  
  // If not cached, fetch from API
  const data = await fetchFromTMDb(title);
  
  // Store in cache
  cache.set(cacheKey, data);
  
  return data;
}
```

#### Error Handling:
```typescript
// Graceful fallback if external API fails
async function searchMovie(title: string) {
  try {
    const response = await fetch(`${TMDB_URL}/search/movie...`);
    
    if (!response.ok) {
      throw new Error(`TMDb API error: ${response.status}`);
    }
    
    return await response.json();
    
  } catch (error) {
    console.error('Failed to fetch movie data:', error);
    
    // Return partial data or default
    return {
      success: false,
      error: 'Could not fetch movie data. Please enter manually.',
      data: null
    };
  }
}
```

---

### Environment Variables Required:

**.env.local:**
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx

# External APIs
TMDB_API_KEY=xxxxx
GOOGLE_BOOKS_API_KEY=xxxxx
SPOTIFY_CLIENT_ID=xxxxx
SPOTIFY_CLIENT_SECRET=xxxxx
YOUTUBE_API_KEY=xxxxx

# Security
NEXTAUTH_SECRET=xxxxx
NEXTAUTH_URL=https://yourdomain.com

# Optional
SENTRY_DSN=xxxxx
```

---

### API Documentation Page:

**Create Developer Documentation:**
- **Location**: `/docs/api` (protected, only for admins)
- **Content**:
  - API endpoint reference
  - Authentication guide
  - Rate limiting info
  - Example requests/responses
  - Error codes reference
  - Postman collection link

**Interactive API Tester:**
- Embed Swagger UI or similar
- Test endpoints directly from docs
- Auto-generated from OpenAPI spec

---

## Updated File Structure:

```
app/
  (auth)/
    login/page.tsx
    signup/page.tsx
    forgot-password/page.tsx
    verify-email/page.tsx
  (protected)/
    home/page.tsx
    gallery/page.tsx
    memories/page.tsx
    letters/page.tsx
    playlist/page.tsx
    library/page.tsx
    adventures/page.tsx
    settings/page.tsx
    profile/page.tsx
  api/
    auth/
      [...nextauth]/route.ts
      login/route.ts
      signup/route.ts
      logout/route.ts
    images/
      upload/route.ts
      [id]/route.ts
      [id]/signed-url/route.ts
    media/
      movies/
        search/route.ts
        autofill/route.ts
        [tmdb_id]/route.ts
      books/
        search/route.ts
        autofill/route.ts
        isbn/[isbn]/route.ts
      songs/
        search/route.ts
        autofill/route.ts
        spotify/[track_id]/route.ts
        youtube/route.ts

lib/
  auth/
    supabase-auth.ts
    session.ts
    middleware.ts
  api/
    tmdb.ts
    google-books.ts
    spotify.ts
    youtube.ts
    cache.ts
  storage.ts
  validation.ts

middleware.ts // Route protection

components/
  auth/
    login-form.tsx
    signup-form.tsx
    password-reset-form.tsx
    account-linking.tsx
  media/
    movie-search-modal.tsx
    book-isbn-scanner.tsx
    song-spotify-search.tsx
```

---

## Updated Testing Checklist:

### Authentication Tests:
- âœ… Sign up with email verification works
- âœ… Login with correct credentials succeeds
- âœ… Login with wrong password fails
- âœ… Password reset flow works
- âœ… Account linking with couple code works
- âœ… Session expires after timeout
- âœ… Protected routes redirect to login
- âœ… Logout clears session completely
- âœ… Two-factor authentication works (if enabled)

### API Tests:
- âœ… Image upload returns valid URL
- âœ… Image retrieval by ID works
- âœ… Signed URL generation works
- âœ… Image deletion removes file
- âœ… Movie search returns results
- âœ… Movie autofill populates form
- âœ… Book ISBN lookup works
- âœ… Book search by title works
- âœ… Song Spotify search works
- âœ… Song YouTube metadata extraction works
- âœ… API rate limiting enforces limits
- âœ… Caching reduces API calls
- âœ… Error handling shows user-friendly messages

### Security Tests:
- âœ… CSRF protection works
- âœ… SQL injection attempts blocked
- âœ… XSS attempts sanitized
- âœ… Unauthorized API calls rejected
- âœ… File upload validates file types
- âœ… File upload limits file size
- âœ… Password strength requirements enforced
- âœ… Session hijacking prevented

---

## Implementation Priority (Updated):

### Tier 0: Foundation (Must Complete First)
- ✅ Authentication system (Supabase Auth)
- ✅ User accounts and profiles
- ✅ Route protection middleware
- ✅ Session management
- ✅ Account linking for couples

### Tier 1: Core Features
- ✅ Image upload API with URL access
- ✅ Photo gallery with authentication
- ✅ Memory jar (protected)
- ✅ Love letters (protected)
- ✅ Relationship counter
- ✅ Navigation with user menu

### Tier 2: API Integrations
- 🎬 TMDb API for movies/series
- 📚 Google Books API for books
- 🎵 Spotify API for songs
- ▶️ YouTube API for music videos
- 🖼️ Auto-fill forms with metadata

### Tier 3: Polish & Enhancement
- 🎨 All previous Tier 2 features
- 🔔 Push notifications
- 📊 User analytics dashboard
- 🎨 Theme customization per user

---

## Quick Start Guide for Developers:

### 1. Set Up Authentication:
```bash
# Install Supabase
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs

# Initialize Supabase client
# Create lib/supabase.ts
```

### 2. Configure External APIs:
```bash
# Sign up for API keys:
# - TMDb: https://www.themoviedb.org/settings/api
# - Google Books: https://console.cloud.google.com/
# - Spotify: https://developer.spotify.com/dashboard
# - YouTube: https://console.cloud.google.com/

# Add to .env.local
```

### 3. Set Up Database:
```sql
-- Run Supabase migrations
-- Create RLS policies for data access
-- Set up storage buckets for images
```

### 4. Implement Route Protection:
```typescript
// middleware.ts
export { default } from './lib/auth/middleware';

export const config = {
  matcher: ['/home/:path*', '/gallery/:path*', '/api/:path*']
};
```

### 5. Build Image Upload:
```typescript
// Start with /api/images/upload endpoint
// Implement file validation
// Connect to Supabase Storage
// Return public URL
```

### 6. Integrate Media APIs:
```typescript
// Implement TMDb search first (movies)
// Add Google Books second (ISBN lookup)
// Add Spotify third (song search)
// Add caching layer for all
```

---

**This enhanced prompt now includes:**
1. ✅ Complete authentication system with Supabase
2. ✅ User accounts and couple linking
3. ✅ Protected routes and session management
4. ✅ Image upload API with URL access
5. ✅ TMDb API for movie/series posters
6. ✅ Google Books API for book covers
7. ✅ Spotify API for album art
8. ✅ YouTube API for music videos
9. ✅ Auto-fill forms with external data
10. ✅ Rate limiting and caching strategies
11. ✅ Complete API documentation
12. ✅ Updated file structure and testing checklist

The website now has a robust authentication system and powerful API integrations to automatically fetch media metadata and images!