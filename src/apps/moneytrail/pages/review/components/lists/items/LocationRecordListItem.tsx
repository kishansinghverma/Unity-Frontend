import dayjs from 'dayjs';
import { Calendar, Clock } from 'lucide-react';
import { FC, memo } from 'react';
import { StringUtils } from '../../../../../../../engine/helpers/stringHelper';
import { LocationRecordListItemProps } from '../../../engine/contracts/props';
import { AlphabetIcon } from '../../shared/Common';
import { ProcessedActionButton, ProcessedMarker } from './shared/ProcessedState';
import { SwipeableContent } from './shared/SwipeableContent';

const LocationListItemFC: FC<LocationRecordListItemProps> = ({ isOpen, item, onOpen, setLocationRecordItem, setProcessed }) => {
  const location = StringUtils.isNullOrEmpty(item.location) ? 'Unidentified Location' : item.location;

  const markProcessed = (id: string) => {
    setProcessed(id);
    onOpen(null);
  };

  return (
    <>
      <ProcessedActionButton disabled={item.processed} onClick={() => markProcessed(item._id)} />
      <SwipeableContent
        id={item._id}
        isOpen={isOpen}
        onOpen={onOpen}
        onClick={() => setLocationRecordItem(item)}
      >
        {item.processed && <ProcessedMarker />}
        <a
          target="_blank"
          href={`https://www.google.com/maps?q=${item.coordinate}`}
          onClick={(event) => event.stopPropagation()}
          className="cursor-default"
        >
          <AlphabetIcon seed={item._id} firstLetter={location.charAt(0).toUpperCase()} />
        </a>
        <div className="flex-grow pr-6 pl-4 min-w-4">
          <h3 className="text-gray-800 line-clamp-2 break-all capitalize">{location}</h3>
        </div>
        <div className="text-right min-w-fit">
          <div className="text-gray-400">
            <div className="flex items-center">
              <div className="mr-1"><Calendar width={16} height={16} strokeWidth={2.5} /></div>
              <div>{dayjs(item.dateTime).format('DD MMM')}</div>
            </div>
            <div className="flex items-center">
              <div className="mr-1"><Clock width={16} height={16} strokeWidth={2.5} /></div>
              <div>{dayjs(item.dateTime).format('hh:mm A')}</div>
            </div>
          </div>
        </div>
      </SwipeableContent>
    </>
  );
};

export const LocationRecordListItem = memo(LocationListItemFC);
