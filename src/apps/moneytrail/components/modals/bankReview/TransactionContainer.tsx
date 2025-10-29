import { FileText } from "lucide-react"
import React, { memo, Profiler, useEffect } from "react";
import { ElementType, PropsWithChildren } from "react"

export const TransactionContainerFC: React.FC<PropsWithChildren<{
  icon: ElementType,
  type: string,
  headerStyle: string,
  iconStyle: string,
  isFirst?: boolean
}>> = ({
  icon: Icon,
  type,
  children,
  headerStyle,
  iconStyle,
  isFirst
}) => {
    console.log(type);
    const childCount = React.Children.count(children);

    useEffect(() => console.log("Render"));

    return (
      <div {...(isFirst && { 'data-first-column': true })} className={`bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col ${!isFirst && 'h-[var(--first-col-height,auto)]'}`}>

        <div className={`px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r ${headerStyle}`}>
          <div className="flex items-center gap-2">
            <Icon className={`w-4 h-4 ${iconStyle}`} />
            <h2 className="text-sm font-semibold text-gray-800 dark:text-white">{type} Transactions</h2>
          </div>
        </div>


        {childCount === 0 && (
          <div className="p-4 flex-1 flex items-center justify-center">
            <div className="text-center">
              <FileText className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">No Transaction Identified.</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{type} transactions will appear here</p>
            </div>
          </div>
        )}

        <Profiler
          id="TransactionContainer"
          onRender={(id, phase, actualDuration) => {
            console.log(`${id} [${phase}] rendered in ${actualDuration} ms`);
          }}
        >
          {childCount > 0 && (<div className="p-4 flex-1 overflow-y-auto"> {children} </div>)}
        </Profiler>
      </div>
    )
  };

export const TransactionContainer = memo(TransactionContainerFC);