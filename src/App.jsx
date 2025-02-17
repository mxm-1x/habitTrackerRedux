import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { HabitForm } from './components/HabitForm';
import { HabitList } from './components/HabitList';
import { CheckCheck } from 'lucide-react';

function App() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-950">
        <div className="max-w-3xl mx-auto py-12 px-4">
          <div className="flex flex-col items-center justify-center gap-6 mb-8">
            <div className="flex items-center gap-3">
              <CheckCheck className="w-8 h-8 text-green-500" />
              <h1 className="text-3xl font-bold text-gray-200">Habit Tracker</h1>
            </div>
          </div>
          <div className="bg-grey rounded-xl shadow-lg p-6">
            <HabitForm />
            <HabitList />
          </div>
        </div>
      </div>
    </Provider>
  );
}

export default App;