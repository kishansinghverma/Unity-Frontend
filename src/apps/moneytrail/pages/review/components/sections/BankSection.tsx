import React, { Suspense, lazy, memo, useState } from 'react';
import { Nullable } from '../../../../../../engine/models/types';
import { BankSectionProps } from '../../engine/contracts/props';
import { BankList } from '../lists/BankList';

const BankReviewModal = lazy(() =>
  import('../modals/variants/bank/ReviewModal').then((module) => ({
    default: module.BankReviewModal,
  })),
);

const BankSectionComponent: React.FC<BankSectionProps> = ({
  bankEntries,
  paymentAppEntries,
  draftEntries,
  isLoading,
}) => {
  const [bankItemId, setBankItemId] = useState<Nullable<string>>(null);

  return (
    <div className="w-full min-w-0 h-full flex">
      <BankList
        items={bankEntries}
        isLoading={isLoading}
        setBankItemId={setBankItemId}
      />
      {bankItemId && (
        <Suspense fallback={null}>
          <BankReviewModal
            key={`bank-${bankItemId}`}
            bankEntries={bankEntries}
            paymentAppEntries={paymentAppEntries}
            draftEntries={draftEntries}
            bankItemId={bankItemId}
            setBankItemId={setBankItemId}
          />
        </Suspense>
      )}
    </div>
  );
};

export const BankSection = memo(BankSectionComponent);
