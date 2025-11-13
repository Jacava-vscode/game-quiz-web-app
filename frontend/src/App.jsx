import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import HomePage from './pages/HomePage.jsx'
import QuizPage from './pages/QuizPage.jsx'
import LeaderboardPage from './pages/LeaderboardPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import AdminPage from './pages/AdminPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import FeaturedPage from './pages/FeaturedPage.jsx'
import LatestPage from './pages/LatestPage.jsx'
import TestimonialsPage from './pages/TestimonialsPage.jsx'
import CategoryPage from './pages/CategoryPage.jsx'
import QuizzesPage from './pages/QuizzesPage.jsx'
import MyQuizzesPage from './pages/MyQuizzesPage.jsx'
import ChallengePage from './pages/ChallengePage.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import AdminUsers from './pages/AdminUsers.jsx'
import AdminQuizzes from './pages/AdminQuizzes.jsx'
import AdminCategories from './pages/AdminCategories.jsx'
import ProfileEdit from './pages/ProfileEdit.jsx'
import ProfileHistory from './pages/ProfileHistory.jsx'
import ProfileAchievements from './pages/ProfileAchievements.jsx'
import ProfileChallenges from './pages/ProfileChallenges.jsx'
import ProfileActiveChallenges from './pages/ProfileActiveChallenges.jsx'
import ProfileChallengeHistory from './pages/ProfileChallengeHistory.jsx'
import HelpFAQ from './pages/HelpFAQ.jsx'
import HelpSupport from './pages/HelpSupport.jsx'
import LegalTerms from './pages/LegalTerms.jsx'
import LegalPrivacy from './pages/LegalPrivacy.jsx'
import LogoutPage from './pages/LogoutPage.jsx'
import './styles/app.css'

const App = () => (
  <div className="app-shell">
    <Navbar />
    <main className="app-main">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/featured" element={<FeaturedPage />} />
        <Route path="/latest" element={<LatestPage />} />
        <Route path="/testimonials" element={<TestimonialsPage />} />
        <Route path="/categories/:category" element={<CategoryPage />} />
        <Route path="/quizzes" element={<QuizzesPage />} />
        <Route path="/my-quizzes" element={<MyQuizzesPage />} />
        <Route path="/challenge" element={<ChallengePage />} />
        <Route path="/play" element={<QuizPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/edit" element={<ProfileEdit />} />
        <Route path="/profile/history" element={<ProfileHistory />} />
        <Route path="/profile/achievements" element={<ProfileAchievements />} />
        <Route path="/profile/challenges" element={<ProfileChallenges />} />
        <Route path="/profile/challenges/active" element={<ProfileActiveChallenges />} />
        <Route path="/profile/challenges/history" element={<ProfileChallengeHistory />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/quizzes" element={<AdminQuizzes />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/help/faq" element={<HelpFAQ />} />
        <Route path="/help/support" element={<HelpSupport />} />
        <Route path="/legal/terms" element={<LegalTerms />} />
        <Route path="/legal/privacy" element={<LegalPrivacy />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </main>
    <Footer />
  </div>
)

export default App
