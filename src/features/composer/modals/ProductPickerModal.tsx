import React from "react";
import { X, ShoppingBag, Plus } from "lucide-react";
import { Product } from "@/types";
import { MOCK_PRODUCTS } from "@/utils/constants";

interface ProductPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (product: Product) => void;
}

export const ProductPickerModal: React.FC<ProductPickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-slate-900/50 dark:bg-slate-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[80vh] border border-slate-200 dark:border-slate-800">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
          <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 flex items-center">
            <ShoppingBag className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
            Select Product
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MOCK_PRODUCTS.map((product) => (
              <div
                key={product.id}
                className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer flex gap-4 bg-white dark:bg-slate-800"
                onClick={() => {
                  onSelect(product);
                  onClose();
                }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-lg bg-slate-100 dark:bg-slate-700"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">
                    {product.name}
                  </h4>
                  <p className="text-indigo-600 dark:text-indigo-400 font-bold text-sm mt-0.5">
                    {product.price}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="mt-2 flex items-center text-xs text-slate-400">
                    <span className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300 font-medium">
                      {product.inventory} in stock
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors min-h-[120px]">
              <Plus className="w-8 h-8 mb-2" />
              <span className="text-sm font-medium">Sync New Product</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPickerModal;
