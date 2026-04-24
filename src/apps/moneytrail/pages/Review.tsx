import React, { useState } from 'react';
import { BankReviewModal } from '../components/modals/bankReview/ReviewModal';
import { BankList } from '../components/BankList';
import { Nullable, WithId } from '../../../engine/models/types';
import { useBankEntryQuery, useDraftEntryQuery, usePhonepeEntryQuery } from '../store/reviewSlice';
import { getArrayOrDefault } from '../../../engine/helpers/rtkHelper';
import { PhonepeList } from '../components/PhonePeList';
import { DraftList } from '../components/DraftList';
import {  ManualEntryModal } from '../components/modals/manualEntry/ManualEntryModal';
import { DraftEntry, BankEntry, PhonepeEntry } from '../engine/models/types';
import { PhonepeReviewModal } from '../components/modals/phonepeReview/ReviewModal';
import { Header } from '../components/review/Headers';

const BankSection: React.FC<{
  bankEntries: WithId<BankEntry>[];
  phonepeEntries: WithId<PhonepeEntry>[];
  draftEntries: WithId<DraftEntry>[];
  isLoading: boolean;
}> = ({ bankEntries, phonepeEntries, draftEntries, isLoading }) => {
  const [bankItemId, setBankItemId] = useState<Nullable<string>>(null);

  return (
    <div className="w-full min-w-0">
      <BankList
        items={bankEntries}
        isLoading={isLoading}
        setBankItemId={setBankItemId}
      />
      {bankItemId && (
        <BankReviewModal
          key={`bank-${bankItemId}`}
          bankEntries={bankEntries}
          phonepeEntries={phonepeEntries}
          draftEntries={draftEntries}
          bankItemId={bankItemId}
          setBankItemId={setBankItemId}
        />
      )}
    </div>
  );
};

const PhonepeSection: React.FC<{
  phonepeEntries: WithId<PhonepeEntry>[];
  draftEntries: WithId<DraftEntry>[];
  isLoading: boolean;
}> = ({ phonepeEntries, draftEntries, isLoading }) => {
  const [phonepeItemId, setPhonepeItemId] = useState<Nullable<string>>(null);

  return (
    <div className="w-full px-10 min-w-0">
      <PhonepeList
        items={phonepeEntries}
        isLoading={isLoading}
        setPhonepeItemId={setPhonepeItemId}
      />
      {phonepeItemId && (
        <PhonepeReviewModal
          key={`phonepe-${phonepeItemId}`}
          phonepeEntries={phonepeEntries}
          draftEntries={draftEntries}
          phonepeItemId={phonepeItemId}
          setPhonepeItemId={setPhonepeItemId}
        />
      )}
    </div>
  );
};

const DraftSection: React.FC<{
  draftEntries: WithId<DraftEntry>[];
  isLoading: boolean;
  isManualEntryModalVisible: boolean;
  setManualEntryModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ draftEntries, isLoading, isManualEntryModalVisible, setManualEntryModalVisible }) => {
  const [draftItem, setDraftItem] = useState<Nullable<WithId<DraftEntry>>>(null);

  return (
    <div className="w-full min-w-0">
      <DraftList
        items={draftEntries}
        isLoading={isLoading}
        setDraftItem={setDraftItem}
      />
      {(isManualEntryModalVisible || draftItem) && (
        <ManualEntryModal
          key={`manual-${draftItem?._id ?? 'new'}`}
          draftEntry={draftItem}
          setDraftItem={setDraftItem}
          setVisible={setManualEntryModalVisible}
        />
      )}
    </div>
  );
};

const ReviewExpense: React.FC = () => {
  const bankQuery = useBankEntryQuery();
  const phonepeQuery = usePhonepeEntryQuery();
  const draftQuery = useDraftEntryQuery();

  const bankEntries = getArrayOrDefault(bankQuery);
  const phonepeEntries = getArrayOrDefault(phonepeQuery);
  const draftEntries = getArrayOrDefault(draftQuery);

  const [isManualEntryModalVisible, setManualEntryModalVisible] = useState(false);

  return (
    <div className="px-8">
      <Header setModalVisible={setManualEntryModalVisible} />
      <div className="flex flex-row justify-between">
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
