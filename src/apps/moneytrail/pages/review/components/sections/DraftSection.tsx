import React, { Suspense, lazy, memo, useState } from 'react';
import { Nullable, WithId } from '../../../../../../engine/models/types';
import { DraftList } from '../lists/DraftList';
import { DraftEntry } from '../../engine/contracts/models';
import { DraftSectionProps } from '../../engine/contracts/props';

const ManualEntryModal = lazy(() =>
  import('../modals/variants/manual/ManualEntryModal').then((module) => ({
    default: module.ManualEntryModal,
  })),
);

const DraftSectionComponent: React.FC<DraftSectionProps> = ({
  draftEntries,
  isLoading,
  isManualEntryModalVisible,
  setManualEntryModalVisible,
}) => {
  const [draftItem, setDraftItem] = useState<Nullable<WithId<DraftEntry>>>(null);

  return (
    <div className="w-full min-w-0 h-full flex">
      <DraftList
        items={draftEntries}
        isLoading={isLoading}
        setDraftItem={setDraftItem}
      />
      {(isManualEntryModalVisible || draftItem) && (
        <Suspense fallback={null}>
          <ManualEntryModal
            key={`manual-${draftItem?._id ?? 'new'}`}
            draftEntry={draftItem}
            setDraftItem={setDraftItem}
            setVisible={setManualEntryModalVisible}
          />
        </Suspense>
      )}
    </div>
  );
};

export const DraftSection = memo(DraftSectionComponent);
