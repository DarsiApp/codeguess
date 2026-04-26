import { Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@/state/ThemeContext';
import { PlayerProvider } from '@/state/PlayerContext';
import HomePage from '@/pages/HomePage';
import SoloPage from '@/pages/SoloPage';
import SoloResultsPage from '@/pages/SoloResultsPage';
import DailyPage from '@/pages/DailyPage';
import OnlineMenuPage from '@/pages/OnlineMenuPage';
import OnlineCreatePage from '@/pages/OnlineCreatePage';
import OnlineJoinPage from '@/pages/OnlineJoinPage';
import OnlineFindPage from '@/pages/OnlineFindPage';
import OnlineGamePage from '@/pages/OnlineGamePage';
import RulesPage from '@/pages/RulesPage';
import StatsPage from '@/pages/StatsPage';
import SettingsPage from '@/pages/SettingsPage';
import ShopPage from '@/pages/ShopPage';
import NotFoundPage from '@/pages/NotFoundPage';

export default function App() {
  return (
    <ThemeProvider>
      <PlayerProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/solo" element={<SoloPage />} />
          <Route path="/solo/results" element={<SoloResultsPage />} />
          <Route path="/daily" element={<DailyPage />} />
          <Route path="/online" element={<OnlineMenuPage />} />
          <Route path="/online/create" element={<OnlineCreatePage />} />
          <Route path="/online/join" element={<OnlineJoinPage />} />
          <Route path="/online/find" element={<OnlineFindPage />} />
          <Route path="/online/game/:code" element={<OnlineGamePage />} />
          <Route path="/rules" element={<RulesPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </PlayerProvider>
    </ThemeProvider>
  );
}
