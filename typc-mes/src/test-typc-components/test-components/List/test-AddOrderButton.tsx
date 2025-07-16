import React from 'react';
import { Plus} from 'lucide-react';

type AddOrderButtonProps = {
  onOpenAddOrderModal: () => void;
};


const AddOrderButton: React.FC<AddOrderButtonProps> = ({onOpenAddOrderModal}) => {


return (
    <button
    onClick={onOpenAddOrderModal}
    className="w-full bg-green-600 text-white py-3 rounded-lg mb-3 flex items-center justify-center gap-2 hover:bg-green-700"
    >
    <Plus size={16} />주문 추가
    </button>
);


};

export default AddOrderButton;