import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Save, X } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Checkbox from '../../../components/ui/Checkbox';
import { getMockPartyById, createMockParty, updateMockParty } from '../services/mockPartyData';

interface PartyFormData {
  name: string;
  mandi: string;
  state: string;
  distance: string;
  licence: string;
  licenceNotRequired: boolean;
}

const STATES = [
  { value: '', label: 'राज्य का नाम' },
  { value: 'Delhi', label: 'Delhi' },
  { value: 'Haryana', label: 'Haryana' },
  { value: 'Uttar Pradesh', label: 'Uttar Pradesh' },
  { value: 'Rajasthan', label: 'Rajasthan' },
  { value: 'Bihar', label: 'Bihar' },
  { value: 'Madhya Pradesh', label: 'Madhya Pradesh' },
  { value: 'Maharashtra', label: 'Maharashtra' },
  { value: 'Chhattishgarh', label: 'Chhattishgarh' },
  { value: 'Gujarat', label: 'Gujarat' },
  { value: 'Punjab', label: 'Punjab' }
];

const PartyForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<PartyFormData>({
    name: '',
    mandi: '',
    state: '',
    distance: '',
    licence: '',
    licenceNotRequired: false
  });

  const [errors, setErrors] = useState<Partial<PartyFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditMode && id) {
      const party = getMockPartyById(id);
      if (party) {
        setFormData({
          name: party.name,
          mandi: party.mandi,
          state: party.state,
          distance: party.distance,
          licence: party.licence,
          licenceNotRequired: party.licence === ''
        });
      }
    }
  }, [id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setFormData(prev => ({
      ...prev,
      licenceNotRequired: checked,
      licence: checked ? '' : prev.licence
    }));
  };

  const validateForm = () => {
    const newErrors: Partial<PartyFormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Party name is required';
    }
    
    if (!formData.mandi.trim()) {
      newErrors.mandi = 'Mandi is required';
    }
    
    if (!formData.state) {
      newErrors.state = 'State is required';
    }
    
    if (!formData.distance.trim()) {
      newErrors.distance = 'Distance is required';
    } else if (isNaN(Number(formData.distance))) {
      newErrors.distance = 'Distance must be a number';
    }
    
    if (!formData.licenceNotRequired && !formData.licence.trim()) {
      newErrors.licence = 'License number is required unless not needed';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const partyData = {
        name: formData.name,
        mandi: formData.mandi,
        state: formData.state,
        distance: formData.distance,
        licence: formData.licenceNotRequired ? '' : formData.licence
      };
      
      if (isEditMode && id) {
        await updateMockParty(id, partyData);
      } else {
        await createMockParty(partyData);
      }
      
      navigate('/parties');
    } catch (error) {
      console.error('Error saving party:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isEditMode ? 'पार्टी अपडेट करें' : 'नई पार्टी जोड़ें'}
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {isEditMode ? 'Update party information in the system' : 'Create a new party record in the system'}
        </p>
      </div>

      <Card 
        title={isEditMode ? 'पार्टी अपडेट करें' : 'नई पार्टी जोड़ें'}
        description={isEditMode ? 'Update party details' : 'Add new party details'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                आदमिया फर्म का नाम <span className="text-red-500">*</span>
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="आदमिया फर्म का नाम"
                error={errors.name}
                required
              />
            </div>
            
            <div>
              <label htmlFor="mandi" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                मंडी का नाम <span className="text-red-500">*</span>
              </label>
              <Input
                id="mandi"
                name="mandi"
                value={formData.mandi}
                onChange={handleChange}
                placeholder="मंडी का नाम"
                error={errors.mandi}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="state" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                राज्य का नाम <span className="text-red-500">*</span>
              </label>
              <Select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                options={STATES}
                error={errors.state}
                required
              />
            </div>
            
            <div>
              <label htmlFor="distance" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                दूरी (K.M.) <span className="text-red-500">*</span>
              </label>
              <Input
                id="distance"
                name="distance"
                value={formData.distance}
                onChange={handleChange}
                placeholder="दूरी"
                type="number"
                error={errors.distance}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="licence" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                लाइसेंस संख्या {!formData.licenceNotRequired && <span className="text-red-500">*</span>}
              </label>
              <Input
                id="licence"
                name="licence"
                value={formData.licence}
                onChange={handleChange}
                placeholder="लाइसेंस संख्या"
                disabled={formData.licenceNotRequired}
                error={errors.licence}
                required={!formData.licenceNotRequired}
              />
            </div>
            
            <div className="flex items-center mt-8">
              <Checkbox
                id="licenceNotRequired"
                name="licenceNotRequired"
                checked={formData.licenceNotRequired}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="licenceNotRequired" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                लाइसेंस नंबर की आवश्यकता नहीं है
              </label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('/parties')}
              leftIcon={<X className="w-4 h-4" />}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              leftIcon={<Save className="w-4 h-4" />}
            >
              {isSubmitting 
                ? 'प्रोसेसिंग...' 
                : isEditMode 
                  ? 'पार्टी अपडेट करें' 
                  : 'पार्टी जोड़ें'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default PartyForm; 