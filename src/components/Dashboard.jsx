import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-black">HUM Sound Therapy</h1>
            <button
              onClick={handleLogout}
              className="px-6 py-2 border-2 border-black rounded-full font-medium text-black hover:bg-black hover:text-white transition-colors"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl border border-gray-300 shadow-sm p-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-semibold text-black mb-2">
              Welcome back!
            </h2>
            <p className="text-gray-600">
              You're successfully logged in to HUM Sound Therapy
            </p>
          </div>

          {/* User Info */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-black mb-4">Account Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {currentUser?.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="text-base font-medium text-black">
                    {currentUser?.displayName || 'N/A'}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-base font-medium text-black">
                  {currentUser?.email || 'N/A'}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Provider</p>
                <p className="text-base font-medium text-black">
                  {currentUser?.providerData?.[0]?.providerId === 'google.com' ? 'Google' :
                   currentUser?.providerData?.[0]?.providerId === 'apple.com' ? 'Apple' :
                   'Unknown'}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">User ID</p>
                <p className="text-base font-mono text-xs text-gray-600 break-all">
                  {currentUser?.uid}
                </p>
              </div>
            </div>
          </div>

          {/* Placeholder for future features */}
          <div className="border-t border-gray-200 mt-8 pt-6">
            <h3 className="text-lg font-semibold text-black mb-4">Your Sessions</h3>
            <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
              <p className="text-gray-500">No therapy sessions yet</p>
              <button className="mt-4 px-6 py-2 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors">
                Start a Session
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
