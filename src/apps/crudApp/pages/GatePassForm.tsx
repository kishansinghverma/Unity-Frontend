import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Save } from 'lucide-react';
import Card from '../../../components/ui/Card';

const GatePassForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    vendorName: '',
    weight: '',
    packageCount: '',
    vehicleNumber: '',
    vehicleType: '',
    firmName: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would handle the form submission, e.g., dispatch a Redux action
    // After success, navigate back to the dashboard
    navigate('/');
  };

  const vehicleTypes = ['ट्रक', 'पिकअप', 'ट्रैक्टर', 'अन्य'];
  const firmNames = ['आदित्य ट्रेडिंग कंपनी', 'आदित्य एग्रो इंडस्ट्रीज़', 'आदित्य फ़ूड्स'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">नया गेटपास बनाएं</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Create a new gate pass record in the system
        </p>
      </div>

      <Card 
        title="नया गेटपास बनाएं" 
        description="Create a new gate pass record"
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Vendor Name */}
            <div>
              <label htmlFor="vendorName" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                विक्रेता का नाम (किसान) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="vendorName"
                name="vendorName"
                value={formData.vendorName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Weight */}
            <div>
              <label htmlFor="weight" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                वजन (क्विंटल में) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Package Count */}
            <div>
              <label htmlFor="packageCount" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                पैकेट की संख्या <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="packageCount"
                name="packageCount"
                value={formData.packageCount}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Vehicle Number */}
            <div>
              <label htmlFor="vehicleNumber" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                गाड़ी नंबर <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="vehicleNumber"
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Vehicle Type */}
            <div>
              <label htmlFor="vehicleType" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                वाहन का प्रकार <span className="text-red-500">*</span>
              </label>
              <select
                id="vehicleType"
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                required
              >
                <option value="" disabled>Select an option</option>
                {vehicleTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Firm Name */}
            <div>
              <label htmlFor="firmName" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                आदित्य फर्म का नाम <span className="text-red-500">*</span>
              </label>
              <select
                id="firmName"
                name="firmName"
                value={formData.firmName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                required
              >
                <option value="" disabled>Select an option</option>
                {firmNames.map(firm => (
                  <option key={firm} value={firm}>{firm}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 border-t border-gray-200 dark:border-gray-700 pt-4">
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <X className="w-4 h-4 mr-2" /> Cancel
            </Link>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-sm font-medium rounded-md text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Save className="w-4 h-4 mr-2" /> गेटपास जारी करें
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default GatePassForm;
