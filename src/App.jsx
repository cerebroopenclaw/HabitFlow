import React, { useState, useEffect } from 'react';
import { supabase } from './supabase/supabaseClient';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
// Importa el archivo CSS de Tailwind. Nada de App.css aquí.
import './index.css'; 

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Suscripción a cambios de autenticación
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => authListener.subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {!session ? (
        <Auth />
      ) : (
        <div className="flex flex-col items-center justify-center p-4">
          <Dashboard key={session.user.id} session={session} />
          <button
            onClick={() => supabase.auth.signOut()}
            className="mt-8 px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
          >
            Cerrar Sesión
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
