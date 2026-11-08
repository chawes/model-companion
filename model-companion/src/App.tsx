import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { GuidePage } from './pages/GuidePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PoseDetailPage } from './pages/PoseDetailPage';
import { PosesPage } from './pages/PosesPage';
import { SavedPage } from './pages/SavedPage';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<PosesPage />} />
        <Route path="/poses/:id" element={<PoseDetailPage />} />
        <Route path="/saved" element={<SavedPage />} />
        <Route path="/guide" element={<GuidePage />} />
        {/* old addresses from version 1.0 */}
        <Route path="/poses" element={<Navigate to="/" replace />} />
        <Route path="/prep" element={<Navigate to="/guide" replace />} />
        <Route path="/guide/:lessonId" element={<Navigate to="/guide" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
}
