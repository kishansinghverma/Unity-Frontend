import React, { Suspense, lazy, memo, useState } from 'react';
import { Nullable } from '../../../../../../engine/models/types';
import { PaymentAppSectionProps } from '../../engine/contracts/props';
import { PaymentAppList } from '../lists/PaymentAppList';

const PaymentAppReviewModal = lazy(() =>
  import('../modals/variants/paymentApp/ReviewModal').then((module) => ({
    default: module.PaymentAppReviewModal,
  })),
);

const PaymentAppSectionComponent: React.FC<PaymentAppSectionProps> = ({
  paymentAppEntries,
  draftEntries,
  isLoading,
}) => {
  const [paymentAppItemId, setPaymentAppItemId] = useState<Nullable<string>>(null);

  return (
    <div className="w-full mx-2 min-w-0 h-full flex">
      <PaymentAppList
        items={paymentAppEntries}
        isLoading={isLoading}
        setPaymentAppItemId={setPaymentAppItemId}
      />
      {paymentAppItemId && (
        <Suspense fallback={null}>
          <PaymentAppReviewModal
            key={`payment-app-${paymentAppItemId}`}
            paymentAppEntries={paymentAppEntries}
            draftEntries={draftEntries}
            paymentAppItemId={paymentAppItemId}
            setPaymentAppItemId={setPaymentAppItemId}
          />
        </Suspense>
      )}
    </div>
  );
};

export const PaymentAppSection = memo(PaymentAppSectionComponent);
