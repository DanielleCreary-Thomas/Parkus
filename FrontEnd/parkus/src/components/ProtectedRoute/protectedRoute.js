import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../../utils/supabase.ts'; // Ensure Supabase client is correctly initialized

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    checkSession();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Loading while checking the session
  }

  if (!user) {
    return <Navigate to="/signin" />; // Redirect to SignIn if not authenticated
  }

  return children; // Render children (protected component) if authenticated
};

export default ProtectedRoute;
