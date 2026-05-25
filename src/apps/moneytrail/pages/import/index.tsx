import type { UploadProps } from "antd";
import { Card, Col, List, Row, Table, Tag, Typography, Upload } from "antd";
import { CloudUpload, FileUp } from "lucide-react";
import { useMemo, useState } from "react";
import { PostParams, Routes } from "../../../../engine/constant";
import { handleError, handleJsonResponse } from "../../../../engine/helpers/httpHelper";
import { notify } from "../../../../engine/services/notificationService";
import { AppRecord, BankRecord } from "../review/engine/contracts/models";
import { AppColumns, BankColumns } from "./components/Columns";
import { PreviewTableHeader } from "./components/PreviewTableHeader";
import { NotificationMessages, StatementParams, SupportedFormats } from "./engine/constants";
import { AppPreviewRow, BankPreviewRow, ParsedStatementPreview, UploadResult } from "./engine/contracts/types";
import { parseStatement } from "./engine/parsers";

const { Dragger } = Upload;
const { Text } = Typography;

const parseStatementFile = async (file: File): Promise<ParsedStatementPreview> => {
  const { records, statementType } = await parseStatement(file);

  return {
    records,
    statementType,
    fileName: file.name,
    recordType: ['phonepe', 'paytm'].includes(statementType) ? 'app' : 'bank',
  };
};

const uploadTransactions = (payload: ParsedStatementPreview): Promise<UploadResult> => {
  const route = payload.recordType === "app" ? Routes.AppRecordStatement : Routes.BankRecordStatement;
  return fetch(route, { ...PostParams, body: JSON.stringify(payload.records) }).then(handleJsonResponse);
};

const ImportPage: React.FC = () => {
  const [isParsing, setIsParsing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [parsedPreview, setParsedPreview] = useState<ParsedStatementPreview | null>(null);

  const bankRows = useMemo<BankPreviewRow[]>(() =>
    parsedPreview?.recordType !== "bank" ? [] : (parsedPreview.records as BankRecord[])
      .map((record, index) => ({ ...record, key: `${record.description}-${index}` })),
    [parsedPreview]
  );

  const appRows = useMemo<AppPreviewRow[]>(() =>
    parsedPreview?.recordType !== "app" ? [] : (parsedPreview.records as AppRecord[])
      .map((record, index) => ({ ...record, key: `${record.transactionId}-${index}` })),
    [parsedPreview],
  );

  const parseSelectedFile = async (file: File) => {
    setIsParsing(true);
    setParsedPreview(null);

    try {
      const parsedData = await parseStatementFile(file);
      setParsedPreview(parsedData);

      notify.success({
        message: "Statement Parsed Successfully.",
        description: `Extracted ${parsedData.records.length} ${StatementParams[parsedData.statementType].source} Entries.`,
      });
    } catch (error) {
      handleError(error as Error);
    } finally {
      setIsParsing(false);
    }
  };

  const uploadProps: UploadProps = {
    accept: ".pdf,.xls,.xlsx,.html,.csv",
    showUploadList: false,
    multiple: false,
    beforeUpload: (file) => {
      void parseSelectedFile(file as File);
      return Upload.LIST_IGNORE;
    },
    disabled: isParsing || isUploading,
  };

  const handleUpload = async () => {
    if (!parsedPreview || isUploading) return;
    setIsUploading(true);

    const response = uploadTransactions(parsedPreview);
    notify.promise(response, NotificationMessages, {
      pending: `Uploading ${StatementParams[parsedPreview.statementType].source} Statement...`,
      success: (data: UploadResult) => `Uploaded ${data.insertedCount}/${data.totalCount} Records.`,
    });

    response.finally(() => setIsUploading(false));
  };

  return (
    <div className="flex h-full max-h-full min-h-0 flex-col gap-4">
      <Card
        size="small"
        className="shrink-0"
        title={
          <div className="flex items-center justify-between px-2 py-3">
            <div>
              <div className="flex items-center gap-2">
                <FileUp size={20} className="text-blue-600" />
                <Text className="text-gray-700" style={{ fontSize: 16 }}>Import Statements</Text>
              </div>
              <Text type="secondary" className="font-normal" style={{ fontSize: 14, fontWeight: 'normal' }}>
                Parse files locally, preview records, then upload when verified.
              </Text>
            </div>
            <Tag color="processing" bordered={false}>Supported Formats</Tag>
          </div>
        }
      >
        <Row gutter={48} className="px-2">
          {SupportedFormats.map((group, groupIndex) => (
            <Col key={`format-group-${groupIndex}`} span={8}>
              <List>
                {group.map((item) => {
                  return (
                    <List.Item key={`${item.title}`}>
                      <div className="flex w-full items-center gap-3">
                        <span className={`inline-flex p-2 items-center justify-center rounded-md ${item.iconStyle}`}>
                          {<item.icon size={18} strokeWidth={2} />}
                        </span>
                        <div className="min-w-0 flex flex-col">
                          <Text className="font-medium text-gray-900" style={{ fontSize: 14, lineHeight: 1.2 }}>{item.title}</Text>
                          <Text className="truncate text-gray-500" style={{ fontSize: 12 }}>{item.description}</Text>
                        </div>
                      </div>
                    </List.Item>
                  );
                })}
              </List>
            </Col>
          ))}
        </Row>
      </Card>

      {!parsedPreview ? (
        <Card
          size="small"
          className="flex min-h-0 flex-1 flex-col"
          styles={{
            body: {
              padding: 0,
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
              flex: 1,
            },
          }}
        >
          <div className="flex h-full min-h-0 p-12">
            <Dragger {...uploadProps} className="w-full h-full">
              <div className="mx-auto mb-3 inline-flex p-3 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-600">
                <CloudUpload size={28} strokeWidth={2} />
              </div>
              <div className="mb-1 text-base font-medium text-gray-900">Drop your statement file here</div>
              <div className="text-sm text-gray-500">Or click to browse - PDF, XLSX, HTML, CSV supported</div>
            </Dragger>
          </div>
        </Card>
      ) : (
        <>
          {parsedPreview.recordType === "bank" ? (
            <Table
              size="small"
              bordered
              virtual
              columns={BankColumns}
              dataSource={bankRows}
              pagination={false}
              scroll={{ y: 525 }}
              className="[&_.ant-table-cell]:!px-3"
              title={() => <PreviewTableHeader
                parsedPreview={parsedPreview}
                isUploading={isUploading}
                isParsing={isParsing}
                uploadRecords={handleUpload}
                clearSelection={() => setParsedPreview(null)}
              />}
            />
          ) : (
            <Table
              size="small"
              bordered
              virtual
              columns={AppColumns}
              dataSource={appRows}
              pagination={false}
              scroll={{ y: 525 }}
              className="[&_.ant-table-cell]:!px-3"
              title={() => <PreviewTableHeader
                parsedPreview={parsedPreview}
                isUploading={isUploading}
                isParsing={isParsing}
                uploadRecords={handleUpload}
                clearSelection={() => setParsedPreview(null)}
              />}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ImportPage;
