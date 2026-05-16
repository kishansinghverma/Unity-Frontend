import React, { Suspense, lazy, memo, useState } from 'react';
import { Nullable } from '../../../../../../engine/models/types';
import { BankRecordSectionProps } from '../../engine/contracts/props';
import { BankRecordList } from '../lists/BankRecordList';

const BankReviewModal = lazy(() =>
  import('../modals/variants/bank/ReviewModal').then((module) => ({
    default: module.BankReviewModal,
  })),
);

const BankRecordSectionComponent: React.FC<BankRecordSectionProps> = ({
  bankRecords,
  appRecords,
  locationRecords,
  isLoading,
}) => {
  const [bankItemId, setBankItemId] = useState<Nullable<string>>(null);

  return (
    <div className="w-full min-w-0 h-full flex">
      <BankRecordList
        items={bankRecords}
        isLoading={isLoading}
        setBankItemId={setBankItemId}
      />
      {bankItemId && (
        <Suspense fallback={null}>
          <BankReviewModal
            key={`bank-${bankItemId}`}
            bankRecords={bankRecords}
            appRecords={appRecords}
            locationRecords={locationRecords}
            bankItemId={bankItemId}
            setBankItemId={setBankItemId}
          />
        </Suspense>
      )}
    </div>
  );
};

export const BankRecordSection = memo(BankRecordSectionComponent);
