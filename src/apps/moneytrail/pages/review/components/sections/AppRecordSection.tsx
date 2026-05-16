import React, { Suspense, lazy, memo, useState } from 'react';
import { Nullable } from '../../../../../../engine/models/types';
import { AppRecordSectionProps } from '../../engine/contracts/props';
import { AppRecordList } from '../lists/AppRecordList';

const AppRecordReviewModal = lazy(() =>
  import('../modals/variants/paymentApp/ReviewModal').then((module) => ({
    default: module.AppRecordReviewModal,
  })),
);

const AppRecordSectionComponent: React.FC<AppRecordSectionProps> = ({
  appRecords,
  locationRecords,
  isLoading,
}) => {
  const [appRecordItemId, setAppRecordItemId] = useState<Nullable<string>>(null);

  return (
    <div className="w-full mx-2 min-w-0 h-full flex">
      <AppRecordList
        items={appRecords}
        isLoading={isLoading}
        setAppRecordItemId={setAppRecordItemId}
      />
      {appRecordItemId && (
        <Suspense fallback={null}>
          <AppRecordReviewModal
            key={`payment-app-${appRecordItemId}`}
            appRecords={appRecords}
            locationRecords={locationRecords}
            appRecordItemId={appRecordItemId}
            setAppRecordItemId={setAppRecordItemId}
          />
        </Suspense>
      )}
    </div>
  );
};

export const AppRecordSection = memo(AppRecordSectionComponent);
