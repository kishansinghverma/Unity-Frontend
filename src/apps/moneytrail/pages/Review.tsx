
import dayjs from 'dayjs';
import React, { memo, useEffect, useState } from 'react';
import { BankReviewModal } from '../components/modals/bankReview/ReviewModal';
import { BankList } from '../components/BankList';
import { AnimatePresence } from 'framer-motion';
import { Nullable, WithId } from '../../../engine/models/types';
import { useBankEntryQuery, useDraftEntryQuery, usePhonepeEntryQuery } from '../store/reviewSlice';
import { getArrayOrDefault } from '../../../engine/helpers/rtkHelper';
import { PhonepeList } from '../components/PhonePeList';
import { DraftList } from '../components/DraftList';
import { CalendarArrowUp, ClockArrowUp, PlusCircle } from 'lucide-react';
import { ManualEntryModal } from '../components/modals/manualEntry/ManualEntryModal';
import { UploadStatement } from '../components/Common';
import { DraftEntry } from '../engine/models/types';
import { PhonepeReviewModal } from '../components/modals/phonepeReview/ReviewModal';
import { Header } from '../components/review/Headers';
import { Modal } from 'antd';

const ReviewExpense: React.FC = () => {
  const bankQuery = useBankEntryQuery();
  const phonepeQuery = usePhonepeEntryQuery();
  const draftQuery = useDraftEntryQuery();

  const bankEntries = getArrayOrDefault(bankQuery).slice(20, 40);
  const phonepeEntries = getArrayOrDefault(phonepeQuery);
  const draftEntries = getArrayOrDefault(draftQuery);

  const [bankItemId, setBankItemId] = useState<Nullable<string>>(null);
  const [phonepeItemId, setPhonepeItemId] = useState<Nullable<string>>(null);
  const [draftItem, setDraftItem] = useState<Nullable<WithId<DraftEntry>>>(null);

  const [isManualEntryModalVisible, setManualEntryModalVisible] = useState(false);

  useEffect(() => console.log('Parent'));

  return (
    <>
      <div className="px-8">
        <Header setModalVisible={setManualEntryModalVisible} />
        <div className="flex flex-row justify-between">
          <div className="w-full min-w-0">
            <BankList
              items={bankEntries}
              isLoading={bankQuery.isLoading}
              setBankItemId={setBankItemId}
            />
          </div>
          {/* <div className="w-full px-10 min-w-0">
            <PhonepeList
              items={phonepeEntries}
              isLoading={phonepeQuery.isLoading}
              setPhonepeItemId={setPhonepeItemId}
            />
          </div>
          <div className="w-full min-w-0">
            <DraftList
              items={draftEntries}
              isLoading={draftQuery.isLoading}
              setDraftItem={setDraftItem}
            />
          </div> */}

          {/* <AnimatePresence>
            {bankItemId && (
              <BankReviewModal
                key={bankItemId}
                bankEntries={getArrayOrDefault(bankEntries)}
                phonepeEntries={getArrayOrDefault(phonepeEntries)}
                draftEntries={getArrayOrDefault(draftEntries)}
                bankItemId={bankItemId}
                setBankItemId={setBankItemId}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {(phonepeItemId) && (
              <PhonepeReviewModal
                key={phonepeItemId}
                phonepeEntries={getArrayOrDefault(phonepeEntries)}
                draftEntries={getArrayOrDefault(draftEntries)}
                phonepeItemId={phonepeItemId}
                setPhonepeItemId={setPhonepeItemId}
              />
            )}
          </AnimatePresence>
           */}

          <AnimatePresence>
            {(isManualEntryModalVisible || !!draftItem) && (
              <ManualEntryModal
                key={bankItemId}
                draftEntry={draftItem}
                setDraftItem={setDraftItem}
                setVisible={setManualEntryModalVisible}
              />
            )}
          </AnimatePresence>

          {/* <Modal
            title="Basic Modal"
            open={isManualEntryModalVisible}
            classNames={{
              mask: 'bg-black/50 backdrop-blur backdrop-saturate-[0.8]',
              content: 'rounded-xl shadow-2xl dark:shadow-slate-100 w-[550px] max-w-7xl max-h-[90vh] overflow-hidden'
            }}
            onCancel={() => setManualEntryModalVisible(false)}
            maskClosable={true}
          >
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
          </Modal> */}

        </div>
      </div >
    </>
  );
};

export default ReviewExpense;
