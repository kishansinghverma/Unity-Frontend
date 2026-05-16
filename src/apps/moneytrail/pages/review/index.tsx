import React, { useEffect, useState } from 'react';
import { getArrayOrDefault } from '../../../../engine/helpers/rtkHelper';
import { useBankRecordQuery, useLocationRecordQuery, useExpensePredictionsQuery, useAppRecordQuery } from '../../store/reviewSlice';
import { Header } from './components/layouts/Headers';
import { BankRecordSection } from './components/sections/BankRecordSection';
import { LocationRecordSection } from './components/sections/LocationRecordSection';
import { AppRecordSection } from './components/sections/AppRecordSection';
import { hydratePredictionSamplesFromApi } from './engine/prediction';

const ReviewExpense: React.FC = () => {
  const bankRecordQuery = useBankRecordQuery();
  const appRecordQuery = useAppRecordQuery();
  const locationRecordQuery = useLocationRecordQuery();
  const predictionsQuery = useExpensePredictionsQuery();

  const bankRecords = getArrayOrDefault(bankRecordQuery);
  const appRecords = getArrayOrDefault(appRecordQuery);
  const locationRecords = getArrayOrDefault(locationRecordQuery);

  const [isManualEntryModalVisible, setManualEntryModalVisible] = useState(false);

  useEffect(() => {
    if (!predictionsQuery.data) return;
    hydratePredictionSamplesFromApi(predictionsQuery.data);
  }, [predictionsQuery.data]);

  return (
    <div className="px-8 pb-4 h-full min-h-0 flex flex-col gap-4">
      <Header setModalVisible={setManualEntryModalVisible} />
      <div className="flex flex-row justify-between gap-4 flex-1 min-h-0">
        <BankRecordSection
          bankRecords={bankRecords}
          appRecords={appRecords}
          locationRecords={locationRecords}
          isLoading={bankRecordQuery.isLoading}
        />
        <AppRecordSection
          appRecords={appRecords}
          locationRecords={locationRecords}
          isLoading={appRecordQuery.isLoading}
        />
        <LocationRecordSection
          locationRecords={locationRecords}
          isLoading={locationRecordQuery.isLoading}
          isManualEntryModalVisible={isManualEntryModalVisible}
          setManualEntryModalVisible={setManualEntryModalVisible}
        />
      </div>
    </div>
  );
};

export default ReviewExpense;
