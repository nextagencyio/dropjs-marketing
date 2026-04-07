import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import LandingPage from './App.tsx'
import { Layout } from './components/Layout.tsx'
import { BlogIndex } from './components/BlogIndex.tsx'
import { BlogPost } from './components/BlogPost.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Layout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
      </Routes>
    </Layout>
  </BrowserRouter>
)
