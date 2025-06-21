import React from 'react';
import { Users, PlusCircle } from 'lucide-react';

const dummyGroups = [
  {
    id: 1,
    name: 'Goa Trip',
    members: 5,
    total: 12000,
    youOwe: 2000,
    color: 'bg-blue-100 text-blue-700',
  },
  {
    id: 2,
    name: 'Flatmates',
    members: 3,
    total: 8000,
    youOwe: -1500,
    color: 'bg-green-100 text-green-700',
  },
  {
    id: 3,
    name: 'Office Lunch',
    members: 8,
    total: 4000,
    youOwe: 0,
    color: 'bg-yellow-100 text-yellow-700',
  },
];

const Splitwise: React.FC = () => {
  return (
    <div className="p-8 min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Users className="w-7 h-7 text-blue-500" /> Splitwise
        </h1>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow font-semibold transition-all">
          <PlusCircle className="w-5 h-5" /> New Group
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {dummyGroups.map(group => (
          <div key={group.id} className={`rounded-xl shadow-lg p-6 flex flex-col gap-2 ${group.color} bg-opacity-60 hover:scale-105 transition-transform`}>
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-6 h-6" />
              <span className="text-lg font-semibold">{group.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Members: <b>{group.members}</b></span>
              <span>Total: <b>₹{group.total.toLocaleString()}</b></span>
            </div>
            <div className="mt-2 text-base font-medium">
              {group.youOwe > 0 && <span className="text-red-600">You owe ₹{group.youOwe}</span>}
              {group.youOwe < 0 && <span className="text-green-600">You get back ₹{Math.abs(group.youOwe)}</span>}
              {group.youOwe === 0 && <span className="text-gray-600">Settled up</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Splitwise;
