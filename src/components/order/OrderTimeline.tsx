import React from 'react';
import { OrderStatus } from '../../types';
import { Check, Clock, ChefHat, PackageCheck, Truck, Sparkles, XCircle } from 'lucide-react';

interface OrderTimelineProps {
  status: OrderStatus;
  statusHistory?: { status: OrderStatus; timestamp: string; note?: string }[];
}

const STEPS: { key: OrderStatus; label: string; icon: React.FC<{ className?: string }> }[] = [
  { key: 'Pending', label: 'Order Placed', icon: Clock },
  { key: 'Confirmed', label: 'Confirmed', icon: Check },
  { key: 'Preparing', label: 'Preparing Food', icon: ChefHat },
  { key: 'Ready', label: 'Packed & Ready', icon: PackageCheck },
  { key: 'Out for Delivery', label: 'Out for Delivery', icon: Truck },
  { key: 'Delivered', label: 'Delivered', icon: Check },
];

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ status, statusHistory = [] }) => {
  if (status === 'Cancelled') {
    return (
      <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-rose-800">
        <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
        <div>
          <p className="font-bold text-sm">Order has been cancelled</p>
          <p className="text-xs text-rose-600 mt-0.5">Please contact the restaurant for more details.</p>
        </div>
      </div>
    );
  }

  const currentIndex = STEPS.findIndex((s) => s.key === status);
  const activeStepIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className="py-3 px-1">
      {/* Desktop Horizontal Timeline */}
      <div className="hidden sm:flex items-center justify-between relative">
        {/* Background Connecting Line */}
        <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1 bg-[#E8DFD3] z-0" />
        
        {/* Active Connecting Progress Line */}
        <div 
          className="absolute top-1/2 left-4 -translate-y-1/2 h-1 bg-[#183928] z-0 transition-all duration-500"
          style={{
            width: `${(activeStepIndex / (STEPS.length - 1)) * 100}%`
          }}
        />

        {STEPS.map((step, idx) => {
          const isDone = idx < activeStepIndex;
          const isCurrent = idx === activeStepIndex;
          const isUpcoming = idx > activeStepIndex;
          const Icon = step.icon;

          return (
            <div key={step.key} className="flex flex-col items-center relative z-10">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                  isDone
                    ? 'bg-[#183928] text-white'
                    : isCurrent
                    ? 'bg-[#C85A32] text-white ring-4 ring-[#C85A32]/20 scale-110 animate-pulse-subtle'
                    : 'bg-white border-2 border-[#D5C7B5] text-[#9A8C7E]'
                }`}
              >
                {isDone ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              </div>
              <span
                className={`mt-2 text-[11px] font-bold text-center tracking-tight ${
                  isCurrent
                    ? 'text-[#C85A32]'
                    : isDone
                    ? 'text-[#183928]'
                    : 'text-stone-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile Vertical Timeline */}
      <div className="sm:hidden space-y-3 relative pl-6 border-l-2 border-[#D5C7B5] ml-3">
        {STEPS.map((step, idx) => {
          const isDone = idx < activeStepIndex;
          const isCurrent = idx === activeStepIndex;
          const Icon = step.icon;

          return (
            <div key={step.key} className="relative">
              {/* Dot Icon */}
              <div
                className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${
                  isDone
                    ? 'bg-[#183928] text-white'
                    : isCurrent
                    ? 'bg-[#C85A32] text-white ring-2 ring-[#C85A32]/30 animate-pulse'
                    : 'bg-white border border-[#D5C7B5] text-stone-400'
                }`}
              >
                {isDone ? <Check className="w-3 h-3" /> : <Icon className="w-3 h-3" />}
              </div>

              <div className="flex items-baseline justify-between">
                <span
                  className={`text-xs font-bold ${
                    isCurrent
                      ? 'text-[#C85A32]'
                      : isDone
                      ? 'text-[#183928]'
                      : 'text-stone-400'
                  }`}
                >
                  {step.label}
                </span>
                {isCurrent && (
                  <span className="text-[10px] bg-amber-100 text-amber-900 font-extrabold px-1.5 py-0.2 rounded">
                    Active
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
