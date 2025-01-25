import { useMain } from './context'; // Assuming the path to the context file

export const MainViewModel = () => {
  const { user, setUser, isAuthenticated, setIsAuthenticated, loading, setLoading } = useMain();

  const loginUser = async (email: string, password: string) => {
    try {
      setLoading(true);
      // Example API call
      const response = await fetch('your-api-endpoint/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) throw new Error('Login failed');

      const userData = await response.json();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login error:', error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const getPlayer = async (userId: string, callback: () => void) => {
    try {
      setLoading(true);
      // Fetch user data
      const response = await fetch(`your-api-endpoint/user/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch user data');
      const userData = await response.json();
      setUser(userData);
      callback();
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    isAuthenticated,
    loading,
    loginUser,
    logoutUser,
    getPlayer,
  };
};
