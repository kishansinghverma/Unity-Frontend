import React, { useState } from 'react';
import { Lightbulb, Snowflake, Lock, Speaker, Info, Edit2, PlusCircle } from 'lucide-react';

const initialDevices = [
	{
		id: 1,
		name: 'Living Room Light',
		type: 'Light',
		status: 'On',
		icon: <Lightbulb className="w-10 h-10 text-yellow-400" />,
		lastActive: '2 min ago',
		connected: true,
	},
	{
		id: 2,
		name: 'Bedroom AC',
		type: 'Air Conditioner',
		status: 'Off',
		icon: <Snowflake className="w-10 h-10 text-blue-400" />,
		lastActive: '10 min ago',
		connected: false,
	},
	{
		id: 3,
		name: 'Main Door Lock',
		type: 'Lock',
		status: 'Locked',
		icon: <Lock className="w-10 h-10 text-blue-700" />,
		lastActive: 'Just now',
		connected: true,
	},
	{
		id: 4,
		name: 'Kitchen Speaker',
		type: 'Speaker',
		status: 'Playing',
		icon: <Speaker className="w-10 h-10 text-purple-500" />,
		lastActive: '5 min ago',
		connected: true,
	},
];

const statusColors: Record<string, string> = {
	On: 'bg-green-100 text-green-700',
	Off: 'bg-gray-100 text-gray-700',
	Locked: 'bg-blue-100 text-blue-700',
	Playing: 'bg-purple-100 text-purple-700',
};

const deviceTypes = [
	{
		type: 'Light',
		icon: <Lightbulb className="w-6 h-6 text-yellow-400" />,
		color: 'text-yellow-400',
	},
	{
		type: 'Air Conditioner',
		icon: <Snowflake className="w-6 h-6 text-blue-400" />,
		color: 'text-blue-400',
	},
	{
		type: 'Lock',
		icon: <Lock className="w-6 h-6 text-blue-700" />,
		color: 'text-blue-700',
	},
	{
		type: 'Speaker',
		icon: <Speaker className="w-6 h-6 text-purple-500" />,
		color: 'text-purple-500',
	},
];

const DevicesPage: React.FC = () => {
	const [devices, setDevices] = useState(initialDevices);
	const [showAdd, setShowAdd] = useState(false);
	const [newDevice, setNewDevice] = useState({
		name: '',
		type: deviceTypes[0].type,
		status: 'Off',
		lastActive: 'Just now',
		connected: true,
	});

	const handleToggle = (id: number) => {
		setDevices(devices =>
			devices.map(device =>
				device.id === id
					? {
							...device,
							status:
								device.status === 'On'
									? 'Off'
									: device.status === 'Off'
									? 'On'
									: device.status,
					  }
					: device
			)
		);
	};

	const handleRemove = (id: number) => {
		setDevices(devices => devices.filter(device => device.id !== id));
	};

	const handleAddDevice = (e: React.FormEvent) => {
		e.preventDefault();
		const typeObj = deviceTypes.find(dt => dt.type === newDevice.type);
		setDevices(devices => [
			...devices,
			{
				id: Date.now(),
				name: newDevice.name || `${newDevice.type} ${devices.length + 1}`,
				type: newDevice.type,
				status: newDevice.status,
				icon: typeObj
					? typeObj.icon
					: <Lightbulb className="w-10 h-10 text-yellow-400" />,
				lastActive: 'Just now',
				connected: true,
			},
		]);
		setShowAdd(false);
		setNewDevice({
			name: '',
			type: deviceTypes[0].type,
			status: 'Off',
			lastActive: 'Just now',
			connected: true,
		});
	};

	return (
		<div className="p-8 min-h-screen bg-gray-50 space-y-8">
			{/* Header and Add Button styled like Dashboard Quick Actions */}
			<section className="flex items-center justify-between mb-8">
				<h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
					Smart Home Devices
				</h1>
				<button
					className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-500 text-white px-4 py-2 rounded-lg shadow transition-all duration-300 font-semibold"
					onClick={() => setShowAdd(true)}
				>
					<PlusCircle className="w-5 h-5" /> Add Device
				</button>
			</section>
			{/* Add Device Modal with fade-in animation */}
			{showAdd && (
				<div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 animate-fade-in">
					<form
						onSubmit={handleAddDevice}
						className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-2xl w-full max-w-md flex flex-col gap-4 border border-slate-100 dark:border-slate-700 animate-fade-in"
					>
						<h2 className="text-xl font-bold mb-2 text-slate-800 dark:text-slate-100">
							Add New Device
						</h2>
						<input
							className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400 dark:bg-slate-700 dark:text-slate-100"
							placeholder="Device Name"
							value={newDevice.name}
							onChange={e =>
								setNewDevice({ ...newDevice, name: e.target.value })
							}
							required
						/>
						<select
							className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400 dark:bg-slate-700 dark:text-slate-100"
							value={newDevice.type}
							onChange={e =>
								setNewDevice({ ...newDevice, type: e.target.value })
							}
						>
							{deviceTypes.map(dt => (
								<option key={dt.type} value={dt.type}>
									{dt.type}
								</option>
							))}
						</select>
						<div className="flex gap-4 items-center">
							<label className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
								<input
									type="checkbox"
									checked={newDevice.status === 'On'}
									onChange={e =>
										setNewDevice({
											...newDevice,
											status: e.target.checked ? 'On' : 'Off',
										})
									}
								/>
								On
							</label>
							<label className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
								<input
									type="checkbox"
									checked={newDevice.connected}
									onChange={e =>
										setNewDevice({
											...newDevice,
											connected: e.target.checked,
										})
									}
								/>
								Connected
							</label>
						</div>
						<div className="flex gap-2 mt-2">
							<button
								type="submit"
								className="bg-sky-500 hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-500 text-white px-4 py-2 rounded-lg shadow font-semibold"
							>
								Add
							</button>
							<button
								type="button"
								className="bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-200 px-4 py-2 rounded-lg"
								onClick={() => setShowAdd(false)}
							>
								Cancel
							</button>
						</div>
					</form>
				</div>
			)}
			{/* Device Cards Grid with Dashboard-inspired animation and style */}
			<section>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 items-start">
					{devices.map(device => (
						<div
							key={device.id}
							className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 flex flex-col items-center border border-gray-100 dark:border-slate-700 hover:scale-[1.03] hover:shadow-2xl transition-all duration-300 group relative animate-fade-in"
						>
							<div className="rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4 w-20 h-20 shadow-inner">
								{device.icon}
							</div>
							<div className="text-xl font-semibold text-slate-700 dark:text-slate-100 mb-1 flex items-center gap-2">
								{device.name}
								{device.connected ? (
									<span
										className="ml-1 w-2 h-2 bg-green-400 rounded-full"
										title="Connected"
									></span>
								) : (
									<span
										className="ml-1 w-2 h-2 bg-gray-400 rounded-full"
										title="Disconnected"
									></span>
								)}
							</div>
							<div className="text-sm text-slate-400 dark:text-slate-300 mb-2">
								{device.type}
							</div>
							<div className="flex items-center gap-2 mb-4">
								<span
									className={`px-3 py-1 rounded-full text-xs font-medium ${
										statusColors[device.status] ||
										'bg-gray-100 text-gray-700'
									}`}
								>
									{device.status}
								</span>
								<span className="text-xs text-slate-400 dark:text-slate-300">
									• {device.lastActive}
								</span>
							</div>
							{/* Toggle switch for On/Off devices */}
							{(device.status === 'On' || device.status === 'Off') && (
								<button
									onClick={() => handleToggle(device.id)}
									className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none ${
										device.status === 'On'
											? 'bg-green-400'
											: 'bg-gray-300'
									} mb-4`}
									aria-label="Toggle device"
								>
									<span
										className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ${
											device.status === 'On' ? 'translate-x-6' : ''
										}`}
									/>
								</button>
							)}
							{/* Action icons */}
							<div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
								<button
									className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700"
									title="Edit"
								>
									<Edit2 className="w-4 h-4 text-gray-500 dark:text-slate-300" />
								</button>
								<button
									className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700"
									title="Info"
								>
									<Info className="w-4 h-4 text-gray-500 dark:text-slate-300" />
								</button>
								<button
									className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900"
									title="Remove"
									onClick={() => handleRemove(device.id)}
								>
									<span className="w-4 h-4 text-red-500 dark:text-red-400 font-bold">
										×
									</span>
								</button>
							</div>
						</div>
					))}
				</div>
			</section>
		</div>
	);
};

export default DevicesPage;
