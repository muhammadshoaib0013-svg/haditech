# HADITECH - Next.js Portfolio Website

Welcome to your new premium portfolio built with Next.js 14 App Router, Tailwind CSS, and Framer Motion. 

This project uses a **Single Source of Truth** for all content, meaning you don't need to dive into complex React components to update your portfolio! All your website data is managed from `src/lib/data.ts`.

## 🛠️ How to Manage Content

Open `src/lib/data.ts` in your code editor. Inside you will find different arrays.

---

### 📂 Non-Technical Media Assets Upload Guide
Before adding any new projects or videos to `src/lib/data.ts`, you need to place the corresponding image/video assets into their dedicated public folders:

1. **Project Screenshots & Images:**
   - **Upload Location:** Save your images in [public/images/projects](file:///e:/Projects/Haditech/public/images/projects).
   - **How to Reference in `data.ts`:** Reference the file starting with a slash: `"/images/projects/your-filename.jpg"` (for example, in a project's `thumbnailSrc` or `screenshots` array).

2. **Video Thumbnail Images:**
   - **Upload Location:** Save your thumbnail images in [public/images/videos](file:///e:/Projects/Haditech/public/images/videos).
   - **How to Reference in `data.ts`:** Reference the file starting with a slash: `"/images/videos/your-thumbnail.jpg"` (for the video's `imageSrc` property).

3. **Raw Local Videos (Optional):**
   - **Upload Location:** Save local video files in [public/videos](file:///e:/Projects/Haditech/public/videos).
   - **How to Reference in `data.ts`:** Reference it as `"/videos/your-video.mp4"`.

---

### 1. Update Global Site Settings
Edit `siteConfig` to update your brand name, WhatsApp number, email, and social links.

### 2. How to Add a New Project
Scroll down to the `projects` array and add a new block:
```typescript
{
  title: "My New SaaS",
  description: "A cool new app.",
  category: "SaaS", // Ensure it matches one of your filter categories
  stack: ["React", "Firebase"],
  tags: ["B2B"],
  difficulty: "Beginner",
  featured: true, // Will show on Home page
  thumbnailType: "video-placeholder",
  liveUrl: "https://myapp.com",
  githubUrl: "https://github.com/myrepo",
  duration: "1:00"
}
```

### 3. How to Add a New Service
Scroll to `services` and add:
```typescript
{
  title: "SEO Optimization",
  shortDescription: "Rank higher on Google.",
  features: ["Keyword Research", "On-page SEO"],
  iconName: "Rocket", // Use standard Lucide React icons
  category: "Marketing",
  pricingHint: "$1k+",
  deliveryTime: "1 Week",
  popular: false
}
```

### 4. How to Add a New Video
Scroll to `videos` and add:
```typescript
{
  title: "My Latest Tutorial",
  platform: "YouTube",
  url: "https://youtube.com/watch?v=...",
  featured: true,
  duration: "12:00",
  imageSrc: "/images/thumb1.jpg" // Put images in /public/images/
}
```

## 🚀 Deployment (Vercel)

Deploying this site is completely automated. 
1. Create a GitHub repository and push this code.
2. Go to [Vercel](https://vercel.com) and click **Add New Project**.
3. Import your GitHub repository.
4. Open the `.env.example` file locally to see what variables you need. Add those exact variables in the Vercel **Environment Variables** settings during setup.
5. Click **Deploy**. Vercel will automatically build the site using `npm run build`.

## 🧑‍💻 Running Locally
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
