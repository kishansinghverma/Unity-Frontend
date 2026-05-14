import React, { Suspense, lazy, memo, useMemo, useState } from 'react';
import { getArrayOrDefault } from '../../../../engine/helpers/rtkHelper';
import { Nullable, WithId } from '../../../../engine/models/types';
import { BankList } from './components/lists/BankList';
import { DraftList } from './components/lists/DraftList';
import { PaymentAppList } from './components/lists/PaymentAppList';
import { Header } from './components/layouts/Headers';
import { DraftEntry, BankEntry, PaymentAppEntry } from '../../engine/models/types';
import { useBankEntryQuery, useDraftEntryQuery, usePaymentAppEntryQuery } from '../../store/reviewSlice';

const BankReviewModal = lazy(() =>
  import('./components/reviewModals/bank/ReviewModal').then((module) => ({
    default: module.BankReviewModal,
  })),
);

const PaymentAppReviewModal = lazy(() =>
  import('./components/reviewModals/paymentApp/ReviewModal').then((module) => ({
    default: module.PaymentAppReviewModal,
  })),
);

const ManualEntryModal = lazy(() =>
  import('./components/reviewModals/manual/ManualEntryModal').then((module) => ({
    default: module.ManualEntryModal,
  })),
);

type BankSectionProps = {
  bankEntries: WithId<BankEntry>[];
  paymentAppEntries: WithId<PaymentAppEntry>[];
  draftEntries: WithId<DraftEntry>[];
  isLoading: boolean;
};

const BankSection = memo(({ bankEntries, paymentAppEntries, draftEntries, isLoading }: BankSectionProps) => {
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
});

type PaymentAppSectionProps = {
  paymentAppEntries: WithId<PaymentAppEntry>[];
  draftEntries: WithId<DraftEntry>[];
  isLoading: boolean;
};

const PaymentAppSection = memo(({ paymentAppEntries, draftEntries, isLoading }: PaymentAppSectionProps) => {
  const [paymentAppItemId, setPaymentAppItemId] = useState<Nullable<string>>(null);

  return (
    <div className="w-full xl:px-10 min-w-0 h-full flex">
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
  const paymentAppQuery = usePaymentAppEntryQuery();
  const draftQuery = useDraftEntryQuery();

  const bankEntries = useMemo(() => getArrayOrDefault(bankQuery), [bankQuery.data, bankQuery.isError, bankQuery.isLoading]);
  const paymentAppEntries = useMemo(() => getArrayOrDefault(paymentAppQuery), [paymentAppQuery.data, paymentAppQuery.isError, paymentAppQuery.isLoading]);
  const draftEntries = useMemo(() => getArrayOrDefault(draftQuery), [draftQuery.data, draftQuery.isError, draftQuery.isLoading]);

  const [isManualEntryModalVisible, setManualEntryModalVisible] = useState(false);

  return (
    <div className="px-8 pb-4 h-full min-h-0 flex flex-col gap-4">
      <Header setModalVisible={setManualEntryModalVisible} />
      <div className="flex flex-row justify-between gap-4 flex-1 min-h-0">
        <BankSection
          bankEntries={bankEntries}
          paymentAppEntries={paymentAppEntries}
          draftEntries={draftEntries}
          isLoading={bankQuery.isLoading}
        />
        <PaymentAppSection
          paymentAppEntries={paymentAppEntries}
          draftEntries={draftEntries}
          isLoading={paymentAppQuery.isLoading}
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
