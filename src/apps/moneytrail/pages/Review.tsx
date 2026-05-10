import React, { Suspense, lazy, memo, useMemo, useState } from 'react';
import { BankList } from '../components/BankList';
import { Nullable, WithId } from '../../../engine/models/types';
import { useBankEntryQuery, useDraftEntryQuery, usePhonepeEntryQuery } from '../store/reviewSlice';
import { getArrayOrDefault } from '../../../engine/helpers/rtkHelper';
import { PhonepeList } from '../components/PhonePeList';
import { DraftList } from '../components/DraftList';
import { DraftEntry, BankEntry, PhonepeEntry } from '../engine/models/types';
import { Header } from '../components/review/Headers';

const BankReviewModal = lazy(() =>
  import('../components/modals/bankReview/ReviewModal').then((module) => ({
    default: module.BankReviewModal,
  })),
);

const PhonepeReviewModal = lazy(() =>
  import('../components/modals/phonepeReview/ReviewModal').then((module) => ({
    default: module.PhonepeReviewModal,
  })),
);

const ManualEntryModal = lazy(() =>
  import('../components/modals/manualEntry/ManualEntryModal').then((module) => ({
    default: module.ManualEntryModal,
  })),
);

type BankSectionProps = {
  bankEntries: WithId<BankEntry>[];
  phonepeEntries: WithId<PhonepeEntry>[];
  draftEntries: WithId<DraftEntry>[];
  isLoading: boolean;
};

const BankSection = memo(({ bankEntries, phonepeEntries, draftEntries, isLoading }: BankSectionProps) => {
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
            phonepeEntries={phonepeEntries}
            draftEntries={draftEntries}
            bankItemId={bankItemId}
            setBankItemId={setBankItemId}
          />
        </Suspense>
      )}
    </div>
  );
});

type PhonepeSectionProps = {
  phonepeEntries: WithId<PhonepeEntry>[];
  draftEntries: WithId<DraftEntry>[];
  isLoading: boolean;
};

const PhonepeSection = memo(({ phonepeEntries, draftEntries, isLoading }: PhonepeSectionProps) => {
  const [phonepeItemId, setPhonepeItemId] = useState<Nullable<string>>(null);

  return (
    <div className="w-full xl:px-10 min-w-0 h-full flex">
      <PhonepeList
        items={phonepeEntries}
        isLoading={isLoading}
        setPhonepeItemId={setPhonepeItemId}
      />
      {phonepeItemId && (
        <Suspense fallback={null}>
          <PhonepeReviewModal
            key={`phonepe-${phonepeItemId}`}
            phonepeEntries={phonepeEntries}
            draftEntries={draftEntries}
            phonepeItemId={phonepeItemId}
            setPhonepeItemId={setPhonepeItemId}
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
  const phonepeQuery = usePhonepeEntryQuery();
  const draftQuery = useDraftEntryQuery();

  const bankEntries = useMemo(() => getArrayOrDefault(bankQuery), [bankQuery.data, bankQuery.isError, bankQuery.isLoading]);
  const phonepeEntries = useMemo(() => getArrayOrDefault(phonepeQuery), [phonepeQuery.data, phonepeQuery.isError, phonepeQuery.isLoading]);
  const draftEntries = useMemo(() => getArrayOrDefault(draftQuery), [draftQuery.data, draftQuery.isError, draftQuery.isLoading]);

  const [isManualEntryModalVisible, setManualEntryModalVisible] = useState(false);

  return (
    <div className="px-8 pb-4 h-full min-h-0 flex flex-col gap-4">
      <Header setModalVisible={setManualEntryModalVisible} />
      <div className="flex flex-row justify-between gap-4 flex-1 min-h-0">
        <BankSection
          bankEntries={bankEntries}
          phonepeEntries={phonepeEntries}
          draftEntries={draftEntries}
          isLoading={bankQuery.isLoading}
        />
        <PhonepeSection
          phonepeEntries={phonepeEntries}
          draftEntries={draftEntries}
          isLoading={phonepeQuery.isLoading}
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
