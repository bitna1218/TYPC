import React from 'react';
import { Plus } from 'lucide-react';

type AssemblyButtonProps = {
    onOpenAddComponentModal: () => void;
}

const AssemblyButton: React.FC<AssemblyButtonProps> = ({onOpenAddComponentModal}) => {

    return (
        <div className="mb-4">
        <button
        onClick={onOpenAddComponentModal}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg text-base font-medium hover:bg-green-700"
        >
            <Plus size={18} />부품 추가
        </button>
        </div>
    )

};

export default AssemblyButton;