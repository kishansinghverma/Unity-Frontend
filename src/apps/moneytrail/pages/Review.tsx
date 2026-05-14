import React, { Suspense, lazy, memo, useMemo, useState } from 'react';
import { getArrayOrDefault } from '../../../engine/helpers/rtkHelper';
import { Nullable, WithId } from '../../../engine/models/types';
import { BankList } from '../components/BankList';
import { DraftList } from '../components/DraftList';
import { PhonePeList } from '../components/PhonePeList';
import { Header } from '../components/review/Headers';
import { DraftEntry, BankEntry, PhonePeEntry } from '../engine/models/types';
import { useBankEntryQuery, useDraftEntryQuery, usePhonePeEntryQuery } from '../store/reviewSlice';

const BankReviewModal = lazy(() =>
  import('../components/modals/bankReview/ReviewModal').then((module) => ({
    default: module.BankReviewModal,
  })),
);

const PhonePeReviewModal = lazy(() =>
  import('../components/modals/phonePeReview/ReviewModal').then((module) => ({
    default: module.PhonePeReviewModal,
  })),
);

const ManualEntryModal = lazy(() =>
  import('../components/modals/manualEntry/ManualEntryModal').then((module) => ({
    default: module.ManualEntryModal,
  })),
);

type BankSectionProps = {
  bankEntries: WithId<BankEntry>[];
  phonePeEntries: WithId<PhonePeEntry>[];
  draftEntries: WithId<DraftEntry>[];
  isLoading: boolean;
};

const BankSection = memo(({ bankEntries, phonePeEntries, draftEntries, isLoading }: BankSectionProps) => {
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
            phonePeEntries={phonePeEntries}
            draftEntries={draftEntries}
            bankItemId={bankItemId}
            setBankItemId={setBankItemId}
          />
        </Suspense>
      )}
    </div>
  );
});

type PhonePeSectionProps = {
  phonePeEntries: WithId<PhonePeEntry>[];
  draftEntries: WithId<DraftEntry>[];
  isLoading: boolean;
};

const PhonePeSection = memo(({ phonePeEntries, draftEntries, isLoading }: PhonePeSectionProps) => {
  const [phonePeItemId, setPhonePeItemId] = useState<Nullable<string>>(null);

  return (
    <div className="w-full xl:px-10 min-w-0 h-full flex">
      <PhonePeList
        items={phonePeEntries}
        isLoading={isLoading}
        setPhonePeItemId={setPhonePeItemId}
      />
      {phonePeItemId && (
        <Suspense fallback={null}>
          <PhonePeReviewModal
            key={`phonePe-${phonePeItemId}`}
            phonePeEntries={phonePeEntries}
            draftEntries={draftEntries}
            phonePeItemId={phonePeItemId}
            setPhonePeItemId={setPhonePeItemId}
          />
        </Suspense>
      )}
    </div>
  );
});

type DraftSectionProps = {
  draftEntries: WithId<DraftEntry>[];
  isLoading: boolean;
  isManualEntryModalVisible: boolean;
  setManualEntryModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const DraftSection = memo(({
  draftEntries,
  isLoading,
  isManualEntryModalVisible,
  setManualEntryModalVisible,
}: DraftSectionProps) => {
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
});

const ReviewExpense: React.FC = () => {
  const bankQuery = useBankEntryQuery();
  const phonePeQuery = usePhonePeEntryQuery();
  const draftQuery = useDraftEntryQuery();

  const bankEntries = useMemo(() => getArrayOrDefault(bankQuery), [bankQuery.data, bankQuery.isError, bankQuery.isLoading]);
  const phonePeEntries = useMemo(() => getArrayOrDefault(phonePeQuery), [phonePeQuery.data, phonePeQuery.isError, phonePeQuery.isLoading]);
  const draftEntries = useMemo(() => getArrayOrDefault(draftQuery), [draftQuery.data, draftQuery.isError, draftQuery.isLoading]);

  const [isManualEntryModalVisible, setManualEntryModalVisible] = useState(false);

  return (
    <div className="px-8 pb-4 h-full min-h-0 flex flex-col gap-4">
      <Header setModalVisible={setManualEntryModalVisible} />
      <div className="flex flex-row justify-between gap-4 flex-1 min-h-0">
        <BankSection
          bankEntries={bankEntries}
          phonePeEntries={phonePeEntries}
          draftEntries={draftEntries}
          isLoading={bankQuery.isLoading}
        />
        <PhonePeSection
          phonePeEntries={phonePeEntries}
          draftEntries={draftEntries}
          isLoading={phonePeQuery.isLoading}
        />
        <DraftSection
          draftEntries={draftEntries}
          isLoading={draftQuery.isLoading}
          isManualEntryModalVisible={isManualEntryModalVisible}
          setManualEntryModalVisible={setManualEntryModalVisible}
        />
      </div>
    </div>
  );
};

export default ReviewExpense;
