import React from 'react';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

const Switch: React.FC<SwitchProps> = ({ checked, onChange, label }) => {
  return (
    <div className="flex items-center">
      {label && <span className="mr-2 text-gray-700">{label}</span>}
      <div
        className={`relative inline-block w-12 h-6 transition duration-200 ease-in-out ${
          checked ? 'bg-[--purple]' : 'bg-gray-300'
        } rounded-full cursor-pointer`}
        onClick={() => onChange(!checked)}
      >
        <span
          className={`absolute left-0 top-0 bottom-0 m-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
            checked ? 'translate-x-6' : 'translate-x-0'
          }`}
        />
      </div>
    </div>
  );
};

export default Switch;