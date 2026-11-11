import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AtlasProvider } from './context/AtlasContext';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import BookmarkDrawer from './components/BookmarkDrawer';
import AuthModal from './components/AuthModal';
import Toast from './components/Toast';
import HomePage from './pages/HomePage';
import ComparePage from './pages/ComparePage';
import TasksPage from './pages/TasksPage';
import QuizPage from './pages/QuizPage';
import SavedPage from './pages/SavedPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AtlasProvider>
          <div className="bg-background text-on-surface antialiased min-h-screen pb-28 lg:pb-12">
            <Header />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/country/:countryId" element={<HomePage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/saved" element={<SavedPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <BottomNav />
            <BookmarkDrawer />
            <AuthModal />
            <Toast />
          </div>
        </AtlasProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
