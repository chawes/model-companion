import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AdminPage } from './pages/AdminPage';
import { GuidePage } from './pages/GuidePage';
import { InspirationPage } from './pages/InspirationPage';
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
        <Route path="/inspiration" element={<InspirationPage />} />
        <Route path="/saved" element={<SavedPage />} />
        <Route path="/guide" element={<GuidePage />} />
        <Route path="/admin" element={<AdminPage />} />
        {/* old addresses from version 1.0 */}
        <Route path="/poses" element={<Navigate to="/" replace />} />
        <Route path="/prep" element={<Navigate to="/guide" replace />} />
        <Route path="/guide/:lessonId" element={<Navigate to="/guide" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
}
