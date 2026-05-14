import React, { useMemo, useState } from 'react';
import { getArrayOrDefault } from '../../../../engine/helpers/rtkHelper';
import { Header } from './components/layouts/Headers';
import { BankSection } from './components/sections/BankSection';
import { DraftSection } from './components/sections/DraftSection';
import { PaymentAppSection } from './components/sections/PaymentAppSection';
import { useBankEntryQuery, useDraftEntryQuery, usePaymentAppEntryQuery } from '../../store/reviewSlice';

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
