import React from 'react';
import { Upload, Edit3, FileText, ChevronRight } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';


const MethodSelector = ({ selectedMethod, onMethodSelect }) => {
  const methods = [
    {
      id: 'csv',
      title: 'CSV Upload',
      description: 'Upload a CSV file and automatically detect columns and data types',
      icon: Upload,
      features: ['Automatic column detection', 'Data type inference', 'Delimiter configuration', 'Encoding support'],
      recommended: true
    },
    {
      id: 'manual',
      title: 'Manual Builder',
      description: 'Build your table structure from scratch with full control',
      icon: Edit3,
      features: ['Custom column design', 'Advanced constraints', 'Relationship setup', 'Index configuration']
    },
    {
      id: 'template',
      title: 'Template Based',
      description: 'Start with pre-built templates for common use cases',
      icon: FileText,
      features: ['Common table patterns', 'Industry standards', 'Best practices', 'Quick setup'],
      comingSoon: true
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Choose Creation Method</h2>
        <p className="text-gray-600">Select how you'd like to create your table structure</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {methods?.map((method) => {
          const Icon = method?.icon;
          const isSelected = selectedMethod === method?.id;
          const isDisabled = method?.comingSoon;

          return (
            <div
              key={method?.id}
              className={`
                relative border-2 rounded-lg p-4 cursor-pointer transition-all duration-200
                ${isSelected 
                  ? 'border-blue-500 bg-blue-50' 
                  : isDisabled 
                    ? 'border-gray-200 bg-gray-50 opacity-60' :'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }
                ${isDisabled ? 'cursor-not-allowed' : ''}
              `}
              onClick={() => !isDisabled && onMethodSelect(method?.id)}
            >
              {method?.recommended && (
                <div className="absolute -top-2 left-4 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Recommended
                </div>
              )}
              {method?.comingSoon && (
                <div className="absolute -top-2 right-4 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                  Coming Soon
                </div>
              )}
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
                </div>
                {isSelected && !isDisabled && (
                  <ChevronRight className="w-5 h-5 text-blue-600" />
                )}
              </div>
              <h3 className={`font-medium mb-2 ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                {method?.title}
              </h3>
              <p className={`text-sm mb-4 ${isSelected ? 'text-blue-700' : 'text-gray-600'}`}>
                {method?.description}
              </p>
              <div className="space-y-2">
                {method?.features?.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-blue-500' : 'bg-gray-400'}`} />
                    {feature}
                  </div>
                ))}
              </div>
              {isSelected && !isDisabled && (
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <Button size="sm" className="w-full">
                    Continue with {method?.title}
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {selectedMethod && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Next Steps</h4>
          <p className="text-sm text-blue-700">
            {selectedMethod === 'csv' && 'Upload your CSV file to automatically detect columns and configure your table structure.'}
            {selectedMethod === 'manual' && 'Start building your table by defining columns, data types, and constraints manually.'}
            {selectedMethod === 'template' && 'Choose from pre-built templates to quickly set up common table structures.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default MethodSelector;