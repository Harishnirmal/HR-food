import React from 'react';
import { OrderStatus, SpiceLevel } from '../../types';
import { Flame, CheckCircle, Clock, Truck, ChefHat, XCircle, PackageCheck } from 'lucide-react';

export const VegIndicator: React.FC<{ veg: boolean; size?: 'sm' | 'md' | 'lg' }> = ({ veg, size = 'md' }) => {
  const dim = size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
  const dotDim = size === 'sm' ? 'w-1.5 h-1.5' : size === 'lg' ? 'w-2.5 h-2.5' : 'w-2 h-2';

  return (
    <div 
      className={`inline-flex items-center justify-center border ${
        veg ? 'border-emerald-600' : 'border-rose-600'
      } bg-white rounded-xs p-0.5 ${dim}`}
      title={veg ? 'Vegetarian' : 'Non-Vegetarian'}
    >
      <span
        className={`rounded-full ${
          veg ? 'bg-emerald-600' : 'bg-rose-600'
        } ${dotDim}`}
      />
    </div>
  );
};

export const SpiceBadge: React.FC<{ level: SpiceLevel; showLabel?: boolean }> = ({ level, showLabel = true }) => {
  if (level === 'mild') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
        <Flame className="w-3 h-3 text-emerald-600" />
        {showLabel && 'Mild Spice'}
      </span>
    );
  }
  if (level === 'medium') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
        <div className="flex -space-x-1">
          <Flame className="w-3 h-3 text-amber-600" />
          <Flame className="w-3 h-3 text-amber-600" />
        </div>
        {showLabel && 'Medium'}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-800 border border-rose-200">
      <div className="flex -space-x-1">
        <Flame className="w-3 h-3 text-rose-600 fill-rose-600" />
        <Flame className="w-3 h-3 text-rose-600 fill-rose-600" />
        <Flame className="w-3 h-3 text-rose-600 fill-rose-600" />
      </div>
      {showLabel && 'Spicy'}
    </span>
  );
};

export const OrderStatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
  switch (status) {
    case 'Pending':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
          <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
          Order Placed
        </span>
      );
    case 'Confirmed':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
          <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
          Confirmed
        </span>
      );
    case 'Preparing':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200">
          <ChefHat className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
          Preparing in Kitchen
        </span>
      );
    case 'Ready':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200">
          <PackageCheck className="w-3.5 h-3.5 text-teal-600" />
          Food Ready
        </span>
      );
    case 'Out for Delivery':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-300">
          <Truck className="w-3.5 h-3.5 text-amber-700 animate-bounce" />
          Out for Delivery
        </span>
      );
    case 'Delivered':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
          Delivered
        </span>
      );
    case 'Cancelled':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
          <XCircle className="w-3.5 h-3.5 text-rose-600" />
          Cancelled
        </span>
      );
  }
};
