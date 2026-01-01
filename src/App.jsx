import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/Login';
import Home from './components/Home';
import ProtectedRoute from './components/ProtectedRoute';
import BreatheScreen from './components/BreatheScreen';
import BreathingInfoScreen from './components/BreathingInfoScreen';
import BreathingExerciseScreen from './components/BreathingExerciseScreen';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/breathe"
            element={
              <ProtectedRoute>
                <BreatheScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/breathe/:type/info"
            element={
              <ProtectedRoute>
                <BreathingInfoScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/breathe/:type/exercise"
            element={
              <ProtectedRoute>
                <BreathingExerciseScreen />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
