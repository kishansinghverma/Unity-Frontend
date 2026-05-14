import { Check, CircleCheckBigIcon } from 'lucide-react';
import { FC } from 'react';

export const ProcessedMarker = () => (
  <div className="absolute top-0 left-0 z-30 flex h-4 w-4 items-center justify-center rounded-br-lg bg-green-600/90 shadow-lg">
    <Check className="h-2 w-2 text-white" strokeWidth={5} />
  </div>
);

type ProcessedActionButtonProps = {
  disabled?: boolean;
  onClick: () => void;
};

export const ProcessedActionButton: FC<ProcessedActionButtonProps> = ({ disabled = false, onClick }) => {
  const disabledStyle = disabled ? 'bg-gray-400/50 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 cursor-pointer';

  return (
    <div className="absolute top-0 right-0 h-full flex items-center">
      <button
        disabled={disabled}
        title="Mark Complete"
        onClick={onClick}
        className={`text-white h-full w-20 flex items-center justify-center transition-colors ${disabledStyle}`}
      >
        <CircleCheckBigIcon />
      </button>
    </div>
  );
};
