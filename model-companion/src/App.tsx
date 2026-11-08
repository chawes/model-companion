import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { GuideLessonPage } from './pages/GuideLessonPage';
import { GuidePage } from './pages/GuidePage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PoseDetailPage } from './pages/PoseDetailPage';
import { PosesPage } from './pages/PosesPage';
import { PrepPage } from './pages/PrepPage';
import { SavedPage } from './pages/SavedPage';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/poses" element={<PosesPage />} />
        <Route path="/poses/:id" element={<PoseDetailPage />} />
        <Route path="/guide" element={<GuidePage />} />
        <Route path="/guide/:lessonId" element={<GuideLessonPage />} />
        <Route path="/saved" element={<SavedPage />} />
        <Route path="/prep" element={<PrepPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
}
