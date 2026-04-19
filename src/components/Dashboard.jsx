import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase/supabaseClient';

function HabitForm({ session, onHabitAdded }) {
  const [habitName, setHabitName] = useState('');
  const [loading, setLoading] = useState(false);

  const addHabit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const user = session.user;

    const { data: userHabit, error } = await supabase
      .from('user_habits')
      .insert({
        user_id: user.id,
        name: habitName,
        frequency: 'daily', // Por ahora solo diario
      })
      .select();

    if (error) {
      console.error('Error adding habit:', error.message);
      alert('Error al añadir hábito: ' + error.message);
    } else {
      setHabitName('');
      onHabitAdded(userHabit[0]);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={addHabit} className="bg-gray-50 p-6 rounded-lg shadow-inner space-y-4">
      <h3 className="text-xl font-semibold text-gray-800">Crear Nuevo Hábito</h3>
      <input
        type="text"
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Nombre del hábito (ej: Leer 10 páginas)"
        value={habitName}
        onChange={(e) => setHabitName(e.target.value)}
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200 disabled:opacity-50"
      >
        {loading ? 'Creando...' : 'Añadir Hábito'}
      </button>
      <p className="text-sm text-gray-500">Puedes crear hasta 2 hábitos.</p>
    </form>
  );
}

function HabitItem({ habit, onCheckIn }) {
  const [streak, setStreak] = useState(0);
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getStreakAndCheckInStatus();
  }, [habit]);

  async function getStreakAndCheckInStatus() {
    setLoading(true);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if user has checked in today for this habit
    const { data: checkinData, error: checkinError } = await supabase
      .from('checkins')
      .select('id')
      .eq('user_habit_id', habit.id)
      .gte('checked_at', today.toISOString())
      .limit(1);

    if (checkinError) {
      console.error('Error checking check-in status:', checkinError.message);
    } else if (checkinData.length > 0) {
      setHasCheckedInToday(true);
    }

    // Calculate streak
    const { data: allCheckins, error: allCheckinsError } = await supabase
      .from('checkins')
      .select('checked_at')
      .eq('user_habit_id', habit.id)
      .order('checked_at', { ascending: false });

    if (allCheckinsError) {
      console.error('Error fetching all checkins for streak:', allCheckinsError.message);
    } else {
      let currentStreak = 0;
      let previousDay = new Date();
      previousDay.setHours(0, 0, 0, 0);
      previousDay.setDate(today.getDate() + 1); // Start from tomorrow and go backwards

      for (const checkin of allCheckins) {
        const checkinDate = new Date(checkin.checked_at);
        checkinDate.setHours(0, 0, 0, 0);

        const diffTime = Math.abs(previousDay.getTime() - checkinDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) { // If check-in is for the immediately preceding day
          currentStreak++;
          previousDay = checkinDate;
        } else if (diffDays > 1) { // Gap in streak
          break;
        } else { // Same day, or Future day (shouldn't happen with order desc and previousDay logic)
          // Do nothing, already counted or ignored
        }
      }
      setStreak(currentStreak);
    }
    setLoading(false);
  }

  const handleCheckIn = async () => {
    setLoading(true);
    const { error } = await supabase.from('checkins').insert({
      user_habit_id: habit.id,
      checked_at: new Date().toISOString(),
    });

    if (error) {
      console.error('Error during check-in:', error.message);
      alert('Error al registrar check-in: ' + error.message);
    } else {
      setHasCheckedInToday(true);
      getStreakAndCheckInStatus(); // Recalculate streak after check-in
    }
    setLoading(false);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
      <div>
        <h4 className="text-lg font-semibold text-gray-800">{habit.name}</h4>
        <p className="text-gray-600">Racha: {streak} días</p>
      </div>
      {!hasCheckedInToday ? (
        <button
          onClick={handleCheckIn}
          disabled={loading}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 disabled:opacity-50"
        >
          {loading ? 'Registrando...' : 'Check-in'}
        </button>
      ) : (
        <span className="text-green-600 font-semibold">¡Hecho hoy!</span>
      )}
    </div>
  );
}

function Dashboard({ session }) {
  const [loading, setLoading] = useState(true);
  const [userHabits, setUserHabits] = useState([]);

  useEffect(() => {
    getHabits();
  }, [session]);

  async function getHabits() {
    setLoading(true);
    const user = session.user;
    const { data, error } = await supabase
      .from('user_habits')
      .select('id, name, description')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching habits:', error.message);
    } else {
      setUserHabits(data);
    }
    setLoading(false);
  }

  const handleHabitAdded = (newHabit) => {
    setUserHabits((prevHabits) => [...prevHabits, newHabit]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Bienvenido a HabitFlow</h1>

      <div className="max-w-xl mx-auto space-y-8">
        {userHabits.length < 2 && (
          <HabitForm session={session} onHabitAdded={handleHabitAdded} />
        )}

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">Mis Hábitos</h2>
          {loading ? (
            <p className="text-center text-gray-600">Cargando hábitos...</p>
          ) : userHabits.length > 0 ? (
            userHabits.map((habit) => (
              <HabitItem key={habit.id} habit={habit} />
            ))
          ) : (
            <p className="text-center text-gray-600">Aún no tienes hábitos registrados. ¡Crea uno!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
