import React, { useState } from 'react';
import { supabase } from '../supabase/supabaseClient';

function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) alert(error.message);
    setLoading(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) alert(error.message);
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">HabitFlow</h1>
        <p className="text-center text-gray-600">Inicia sesión o regístrate para usar HabitFlow</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="email"
            placeholder="Tu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="password"
            placeholder="Tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200" disabled={loading}>
            {loading ? 'Cargando' : 'Iniciar Sesión'}
          </button>
        </form>
        <button className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition duration-200" onClick={handleSignUp} disabled={loading}>
          {loading ? 'Cargando' : 'Registrarse'}
        </button>
      </div>
    </div>
  );
}

export default Auth;
