import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/components';

// Define props for the ConfirmationModal component  
interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
  }

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-65">
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h2 className="text-lg font-semibold">Are you sure you want to sign out?</h2>
        <p className="mt-2 text-sm text-gray-600">This action cannot be undone.</p>
        <div className="mt-4 flex  text-sm justify-end space-x-3">
          <button onClick={onClose} className="bg-gray-200 px-4 py-2 place-content-center rounded hover:bg-slate-300">
            Cancel
          </button>
          <LogoutLink className="bg-red-600 text-white px-4 py-2 place-content-center rounded hover:bg-red-700">
            Sign Out
          </LogoutLink>
        </div>
      </div>
    </div>
  );
}