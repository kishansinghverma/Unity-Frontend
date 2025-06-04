import React, { useState } from 'react';

// Import Lucide icons
import {
    ChevronDown,
    ChevronRight,
    Lightbulb,
    Thermometer,
    Tv2,
    Speaker,
    BedDouble,
    CookingPot,
    Sofa,
    Bath,
    Zap,
    Droplets,
    Power,
    Moon,
    ShieldCheck,
    Clapperboard,
    Coffee,
    PartyPopper,
    PlusCircle,
    Activity,
    AirVent,
    Fan,
    Router,
    Smartphone,
    Palette,
    Music2,
    Briefcase,
    CloudSun,
    Sunrise,
} from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string;
    icon: React.ElementType;
    iconColor?: string;
    trend?: string;
    trendColor?: string;
}

interface QuickActionButtonProps {
    label: string;
    icon: React.ElementType;
    bgColor?: string;
    textColor?: string;
    onClick?: () => void;
}

interface Room {
    id: string;
    name: string;
    icon: React.ElementType;
    iconColor?: string;
    deviceCount: number;
    status: string; // e.g., "3 lights on", "AC at 22°C"
    devices?: Device[];
}

interface Device {
    id: string;
    name: string;
    icon: React.ElementType;
    isOn: boolean;
}

interface Scene {
    id: string;
    name: string;
    icon: React.ElementType;
    iconColor?: string;
    isActive?: boolean;
}

// Sample Data
const roomsData: Room[] = [
    {
        id: 'living', name: 'Living Room', icon: Sofa, iconColor: 'text-amber-500', deviceCount: 5, status: 'TV On, 2 lights on', devices: [
            { id: 'lr-light1', name: 'Ceiling Light', icon: Lightbulb, isOn: true },
            { id: 'lr-light2', name: 'Lamp', icon: Lightbulb, isOn: true },
            { id: 'lr-tv', name: 'Smart TV', icon: Tv2, isOn: true },
            { id: 'lr-speaker', name: 'Soundbar', icon: Speaker, isOn: false },
            { id: 'lr-thermostat', name: 'Thermostat', icon: Thermometer, isOn: true },
        ]
    },
    {
        id: 'kitchen', name: 'Kitchen', icon: CookingPot, iconColor: 'text-orange-500', deviceCount: 3, status: 'All devices off', devices: [
            { id: 'k-light1', name: 'Main Light', icon: Lightbulb, isOn: false },
            { id: 'k-fan', name: 'Exhaust Fan', icon: Fan, isOn: false },
            { id: 'k-fridge', name: 'Smart Fridge', icon: Smartphone, isOn: true },
        ]
    },
    {
        id: 'bedroom', name: 'Master Bedroom', icon: BedDouble, iconColor: 'text-purple-500', deviceCount: 4, status: 'Night mode active', devices: [
            { id: 'b-light1', name: 'Bedside Lamp L', icon: Lightbulb, isOn: true },
            { id: 'b-light2', name: 'Bedside Lamp R', icon: Lightbulb, isOn: true },
            { id: 'b-ac', name: 'Air Conditioner', icon: AirVent, isOn: true },
            { id: 'b-curtains', name: 'Smart Curtains', icon: Palette, isOn: false },
        ]
    },
    {
        id: 'bathroom', name: 'Bathroom', icon: Bath, iconColor: 'text-cyan-500', deviceCount: 2, status: '1 light on', devices: [
            { id: 'ba-light1', name: 'Mirror Light', icon: Lightbulb, isOn: true },
            { id: 'ba-fan', name: 'Ventilation Fan', icon: Fan, isOn: false },
        ]
    },
    {
        id: 'office', name: 'Office', icon: Briefcase, iconColor: 'text-gray-500', deviceCount: 3, status: 'PC On', devices: [
            { id: 'o-light1', name: 'Desk Lamp', icon: Lightbulb, isOn: true },
            { id: 'o-pc', name: 'Computer', icon: Smartphone, isOn: true },
            { id: 'o-router', name: 'Wi-Fi Router', icon: Router, isOn: true },
        ]
    },
];

const scenesData: Scene[] = [
    { id: 'movie', name: 'Movie Night', icon: Clapperboard, iconColor: 'text-red-500', isActive: false },
    { id: 'morning', name: 'Good Morning', icon: Sunrise, iconColor: 'text-yellow-500', isActive: true },
    { id: 'focus', name: 'Focus Mode', icon: Activity, iconColor: 'text-blue-500', isActive: false },
    { id: 'relax', name: 'Relax Time', icon: Music2, iconColor: 'text-green-500', isActive: false },
    { id: 'party', name: 'Party Time', icon: PartyPopper, iconColor: 'text-pink-500', isActive: false },
    { id: 'bedtime', name: 'Bedtime', icon: Moon, iconColor: 'text-indigo-500', isActive: false },
];

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, iconColor = 'text-indigo-600', trend, trendColor = 'text-green-500' }) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg dark:shadow-slate-700/50 hover:shadow-xl dark:hover:shadow-slate-600/60 transition-shadow duration-300 flex items-center space-x-4">
    <div className={`p-3 rounded-full bg-opacity-10 ${iconColor.replace('text-', 'bg-')} dark:${iconColor.replace('text-', 'dark:bg-').replace('500', '500/30')}`}>
      <Icon size={28} className={`${iconColor} dark:${iconColor.replace('500', '400')}`} />
    </div>
    <div>
      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{title}</p>
      <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
      {trend && <p className={`text-xs font-medium ${trendColor} dark:${trendColor.replace('500', '400')}`}>{trend}</p>}
    </div>
  </div>
);

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ label, icon: Icon, bgColor = 'bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-500', textColor = 'text-white', onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-4 rounded-xl shadow-lg dark:shadow-md dark:shadow-slate-700/50 hover:shadow-xl dark:hover:shadow-slate-600/60 transition-all duration-300 transform hover:-translate-y-1 ${bgColor} ${textColor} w-full h-full min-h-[100px]`}
    >
      <Icon size={32} className="mb-2" />
      <span className="text-sm font-semibold text-center">{label}</span>
    </button>
  );
};

const DeviceToggle: React.FC<{device: Device, onToggle: (id: string) => void}> = ({ device, onToggle }) => {
  return (
    <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700/50 rounded-md hover:bg-slate-100 dark:hover:bg-slate-600/70 transition-colors">
      <div className="flex items-center">
        <device.icon size={18} className={`mr-2 ${device.isOn ? 'text-yellow-500 dark:text-yellow-400' : 'text-slate-400 dark:text-slate-500'}`} />
        <span className="text-xs text-slate-600 dark:text-slate-300">{device.name}</span>
      </div>
      <button
        onClick={() => onToggle(device.id)}
        className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 flex items-center ${device.isOn ? 'bg-green-500 dark:bg-green-600 justify-end' : 'bg-slate-300 dark:bg-slate-600 justify-start'}`}
      >
        <span className="block w-4 h-4 bg-white dark:bg-slate-200 rounded-full shadow-md transform transition-transform duration-200"></span>
      </button>
    </div>
  );
};


const RoomCard: React.FC<{ room: Room, onDeviceToggle: (roomId: string, deviceId: string) => void }> = ({ room, onDeviceToggle }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg dark:shadow-slate-700/50 overflow-hidden hover:shadow-2xl dark:hover:shadow-slate-600/60 transition-shadow duration-300">
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <room.icon size={28} className={`${room.iconColor || 'text-indigo-600'} dark:${room.iconColor?.replace('500', '400') || 'dark:text-indigo-400'} mr-3`} />
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{room.name}</h3>
          </div>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 p-1 rounded-full hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors"
          >
            {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{room.deviceCount} devices</p>
        <p className={`text-sm ${room.iconColor || 'text-indigo-600'} dark:${room.iconColor?.replace('500', '400') || 'dark:text-indigo-400'} font-medium`}>{room.status}</p>
      </div>
      {isOpen && room.devices && room.devices.length > 0 && (
        <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-slate-700">
          <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase">Devices</h4>
          <div className="space-y-2">
            {room.devices.map(device => (
              <DeviceToggle key={device.id} device={device} onToggle={(deviceId) => onDeviceToggle(room.id, deviceId)} />
            ))}
          </div>
        </div>
      )}
      <div className={`h-1 ${room.iconColor?.replace('text-', 'bg-') || 'bg-indigo-600'} dark:${room.iconColor?.replace('text-','dark:bg-') || 'dark:bg-indigo-500'}`}></div>
    </div>
  );
};

const SceneButton: React.FC<{ scene: Scene, onToggle: (id: string) => void }> = ({ scene, onToggle }) => {
  const activeClass = `${scene.iconColor?.replace('text-','bg-')} bg-opacity-20 dark:bg-opacity-30 border-2 ${scene.iconColor?.replace('text-','border-')} dark:${scene.iconColor?.replace('text-','dark:border-').replace('500','400')}`;
  const inactiveClass = 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700';
  
  return (
  <button
    onClick={() => onToggle(scene.id)}
    className={`
      p-4 rounded-xl shadow-lg dark:shadow-md dark:shadow-slate-700/50 hover:shadow-xl dark:hover:shadow-slate-600/60 transition-all duration-300 transform hover:-translate-y-1
      flex flex-col items-center justify-center text-center w-full h-full min-h-[120px]
      ${scene.isActive ? activeClass : inactiveClass}
    `}
  >
    <scene.icon size={32} className={`${scene.iconColor || 'text-indigo-600'} mb-2 ${scene.isActive ? (scene.iconColor + ` dark:${scene.iconColor?.replace('500','400')}`) : 'text-slate-500 dark:text-slate-400'}`} />
    <span className={`text-sm font-semibold ${scene.isActive ? (scene.iconColor + ` dark:${scene.iconColor?.replace('500','400')}`) : 'text-slate-700 dark:text-slate-200'}`}>{scene.name}</span>
    {scene.isActive && <span className="text-xs mt-1 font-medium text-green-600 dark:text-green-400">Active</span>}
  </button>
  );
};


const DashboardPage: React.FC = () => {
  const [currentRooms, setCurrentRooms] = useState<Room[]>(roomsData);
  const [currentScenes, setCurrentScenes] = useState<Scene[]>(scenesData);

  const handleDeviceToggle = (roomId: string, deviceId: string) => {
    setCurrentRooms(prevRooms => 
      prevRooms.map(room => 
        room.id === roomId 
        ? {
            ...room,
            devices: room.devices?.map(device => 
              device.id === deviceId ? {...device, isOn: !device.isOn} : device
            )
          }
        : room
      )
    );
  };

  const handleSceneToggle = (sceneId: string) => {
    setCurrentScenes(prevScenes =>
      prevScenes.map(scene =>
        scene.id === sceneId ? { ...scene, isActive: !scene.isActive } : scene 
      )
    );
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <section>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-1">Welcome back, Alex!</h2>
        <p className="text-slate-500 dark:text-slate-400">Here's what's happening in your smart home today.</p>
      </section>

      {/* Overview Stats */}
      <section>
        <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-4">Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <StatCard title="Indoor Temp" value="23°C" icon={Thermometer} iconColor="text-red-500" trend="+0.5°C Today" trendColor="text-red-500" />
          <StatCard title="Outdoor Temp" value="28°C" icon={CloudSun} iconColor="text-orange-500" trend="Sunny" />
          <StatCard title="Humidity" value="55%" icon={Droplets} iconColor="text-sky-500" trend="-2% Stable" trendColor="text-green-500"/>
          <StatCard title="Energy Usage" value="12 kWh" icon={Zap} iconColor="text-yellow-500" trend="Normal" />
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <QuickActionButton label="All Lights Off" icon={Power} bgColor="bg-slate-700 hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-500" />
          <QuickActionButton label="Good Night" icon={Moon} bgColor="bg-indigo-700 hover:bg-indigo-800 dark:bg-indigo-600 dark:hover:bg-indigo-500" />
          <QuickActionButton label="Secure Home" icon={ShieldCheck} bgColor="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600" />
          <QuickActionButton label="Morning Routine" icon={Coffee} bgColor="bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500" />
          <QuickActionButton label="Add New Device" icon={PlusCircle} bgColor="bg-sky-500 hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-500" />
        </div>
      </section>
      
      {/* Rooms Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200">Rooms</h3>
          <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center">
            Manage Rooms <ChevronRight size={18} className="ml-1" />
          </button>
        </div>
        {/* Added items-start to prevent cards in the same row from stretching */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
          {currentRooms.map((room) => (
            <RoomCard key={room.id} room={room} onDeviceToggle={handleDeviceToggle} />
          ))}
        </div>
      </section>

      {/* Scenes Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200">Scenes</h3>
           <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center">
            Manage Scenes <ChevronRight size={18} className="ml-1" />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {currentScenes.map((scene) => (
            <SceneButton key={scene.id} scene={scene} onToggle={handleSceneToggle} />
          ))}
        </div>
      </section>
    </div>
  );
};

const Dashboard: React.FC = () => {
    return (
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 dark:bg-slate-900 p-6 md:p-8 lg:p-10 transition-colors duration-300">
          <DashboardPage />
        </main>
    );
};

export default Dashboard;
