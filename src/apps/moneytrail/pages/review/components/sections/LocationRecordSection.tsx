import React, { Suspense, lazy, memo, useState } from 'react';
import { Nullable, WithId } from '../../../../../../engine/models/types';
import { LocationRecord } from '../../engine/contracts/models';
import { LocationRecordSectionProps } from '../../engine/contracts/props';
import { LocationRecordList } from '../lists/LocationRecordList';

const ManualEntryModal = lazy(() =>
  import('../modals/variants/manual/ManualEntryModal').then((module) => ({
    default: module.ManualEntryModal,
  })),
);

const LocationRecordSectionComponent: React.FC<LocationRecordSectionProps> = ({
  locationRecords,
  isLoading,
  isManualEntryModalVisible,
  setManualEntryModalVisible,
}) => {
  const [locationRecordItem, setLocationRecordItem] = useState<Nullable<WithId<LocationRecord>>>(null);

  return (
    <div className="w-full min-w-0 h-full flex">
      <LocationRecordList
        items={locationRecords}
        isLoading={isLoading}
        setLocationRecordItem={setLocationRecordItem}
      />
      {(isManualEntryModalVisible || locationRecordItem) && (
        <Suspense fallback={null}>
          <ManualEntryModal
            key={`manual-${locationRecordItem?._id ?? 'new'}`}
            locationRecord={locationRecordItem}
            setLocationRecordItem={setLocationRecordItem}
            setVisible={setManualEntryModalVisible}
          />
        </Suspense>
      )}
    </div>
  );
};

export const LocationRecordSection = memo(LocationRecordSectionComponent);
