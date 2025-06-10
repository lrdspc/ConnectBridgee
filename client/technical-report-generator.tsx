import React, { useState } from 'react';
import { Download } from 'lucide-react';

const TechnicalReportGenerator = () => {
  const [formData, setFormData] = useState({
    protocol: '',
    subject: '',
    technician: '',
    area: '',
    unit: '',
    date: '',
    client: '',
    project: '',
    location: '',
    address: '',
    tileModel: '',
    issues: {
      incorrectStorage: false,
      permanentLoad: false,
      cornerCut: false,
      misalignedStructure: false,
      irregularFixing92: false,
      irregularFixing110: false,
      lowInclination: false,
      walkingMarks: false,
      incorrectOverhang: false,
      inadequateSupports: false,
      incorrectOverlap: false,
      incorrectMountingDirection: false,
      mortarUse: false,
      ceramicRidge: false,
    }
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        issues: {
          ...prev.issues,
          [name]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const generateReport = () => {
    // In a real application, this would generate a .doc file
    // For demo purposes, we'll just show an alert
    alert('Report generation would start here with the collected data');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Technical Report Generator</h1>
        
        {/* Basic Information Section */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Protocol</label>
              <input
                type="text"
                name="protocol"
                value={formData.protocol}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Technician</label>
              <input
                type="text"
                name="technician"
                value={formData.technician}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Area</label>
              <input
                type="text"
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Unit/Regional</label>
              <input
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>

        {/* Client Information Section */}
        <div className="mt-8 space-y-6">
          <h2 className="text-xl font-semibold mb-4">Client Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Client Name</label>
              <input
                type="text"
                name="client"
                value={formData.client}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Project</label>
              <input
                type="text"
                name="project"
                value={formData.project}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>

        {/* Issues Checklist */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Identified Issues</h2>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(formData.issues).map(([key, value]) => (
              <div key={key} className="flex items-center">
                <input
                  type="checkbox"
                  id={key}
                  name={key}
                  checked={value}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label htmlFor={key} className="text-sm">
                  {key.split(/(?=[A-Z])/).join(' ')}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Generate Report Button */}
        <div className="mt-8">
          <button
            onClick={generateReport}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
          >
            <Download size={20} />
            <span>Generate Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TechnicalReportGenerator;
