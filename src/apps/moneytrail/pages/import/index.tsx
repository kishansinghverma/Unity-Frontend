import { Button, Card, Col, List, Row, Table, Tag, Typography, Upload } from "antd";
import type { UploadProps } from "antd";
import { CloudUpload, CodeXml, Database, FileText, FileUp, LayoutGrid, LoaderCircle, ScanSearch, Table as Table1, Table2, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { PostParams, Routes } from "../../../../engine/constant";
import { handleError, handleJsonResponse } from "../../../../engine/helpers/httpHelper";
import { NotificationMessages, notify } from "../../../../engine/services/notificationService";
import { AppRecord, BankRecord } from "../review/engine/contracts/models";
import { identifyStatementType, parseStatement } from "./engine/parsers";
import { AppPreviewRow, BankPreviewRow, ParsedStatementPreview, StatementType, SupportedFormatItem, UploadResult } from "./engine/contracts/types";
import { appColumns, bankColumns } from "./components";

const { Dragger } = Upload;
const { Text } = Typography;

const notificationMessages: NotificationMessages = {
  pending: "Uploading Parsed Statement...",
  success: "Uploaded Successfully.",
  error: "Error Occured While Uploading!",
};

const supportedFormats: SupportedFormatItem[][] = [
  [
    {
      title: "PhonePe App Statement",
      description: "Download the PDF statement from PhonePe App.",
      iconStyle: "bg-red-100 text-red-700",
      icon: FileText
    },
    {
      title: "Paytm App Statement",
      description: "Download the Excel statement from Paytm App.",
      iconStyle: "bg-green-100 text-green-700",
      icon: Table2
    },
  ],
  [
    {
      title: "HDFC Bank Statement",
      description: "Download Excel File from App/Netbanking.",
      iconStyle: "bg-green-100 text-green-700",
      icon: Table2
    },
    {
      title: "SBI Bank Statement",
      description: "Download Excel File from App/Netbanking.",
      iconStyle: "bg-green-100 text-green-700",
      icon: Table2
    },
  ],
  [
    {
      title: "SBI Credit Card",
      description: "Get <tbody> from Web App as HTML File using VS Code.",
      iconStyle: "bg-blue-100 text-blue-700",
      icon: Table1
    },
    {
      title: "ICICI Credit Card",
      description: "Get Monthly / Yearly Statement as CSV File from WebApp.",
      iconStyle: "bg-amber-100 text-amber-700",
      icon: CodeXml
    },
  ],
];

const StatementParams: Record<StatementType, { source: string, fileType: string }> = {
  hdfc: { source: "HDFC Bank", fileType: "Excel" },
  sbi: { source: "SBI Bank", fileType: "Excel" },
  paytm: { source: "Paytm App", fileType: "Excel" },
  phonepe: { source: "PhonePe App", fileType: "PDF" },
  sbicc: { source: "SBI Credit Card", fileType: "HTML" },
  icici: { source: "ICICI Credit Card", fileType: "CSV" },
};

const parseStatementFile = async (file: File): Promise<ParsedStatementPreview> => {
  const records = await parseStatement(file);
  const statementType = await identifyStatementType(file);

  return {
    records, statementType,
    fileName: file.name,
    recordType: ['phonepe', 'paytm'].includes(statementType) ? 'app' : 'bank'
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

  const previewColumns = parsedPreview?.recordType === "bank" ? bankColumns : appColumns;
  const previewRows = parsedPreview?.recordType === "bank" ? bankRows : appRows;

  const clearSelection = () => setParsedPreview(null);

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
    notify.promise(response, notificationMessages, {
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
          {supportedFormats.map((group, groupIndex) => (
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
      </Card >

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
        <Table
          size="small"
          bordered
          virtual
          columns={previewColumns}
          dataSource={previewRows}
          pagination={false}
          scroll={{ y: 525 }}
          className="[&_.ant-table-cell]:!px-3"
          title={() => (
            <div className="flex items-center justify-between p-1">
              <div className="flex items-center gap-2">
                <ScanSearch size={15} strokeWidth={2.5} />
                <Text style={{ fontSize: 15 }} className="text-gray-800 tracking-wide">Statement Preview</Text>
              </div>
              <div className="flex gap-12">
                <div>
                  <Tag className="rounded-full px-2.5 inline-flex items-center gap-1.5" color="gold">
                    <FileText size={12} strokeWidth={2.5} />
                    <span>{parsedPreview.fileName}</span>
                  </Tag>
                  <Tag className="rounded-full px-2.5 inline-flex items-center gap-1.5" color="green">
                    <Database size={12} strokeWidth={2.5} />
                    <span>Records : {parsedPreview.records.length}</span>
                  </Tag>
                  <Tag className="rounded-full px-2.5 inline-flex items-center gap-1.5" color="purple">
                    <LayoutGrid size={12} strokeWidth={2.5} />
                    <span>{StatementParams[parsedPreview.statementType].source}</span>
                  </Tag>
                  <Tag className="rounded-full px-2.5 inline-flex items-center gap-1.5" color="cyan">
                    <CodeXml size={12} strokeWidth={2.5} />
                    <span>{StatementParams[parsedPreview.statementType].fileType}</span>
                  </Tag>
                </div>
                <div className="flex gap-2.5">
                  <Button
                    size="small"
                    color="primary"
                    variant="outlined"
                    shape="round"
                    icon={isUploading ?
                      <LoaderCircle size={14} strokeWidth={2.5} className="animate-spin" /> :
                      <CloudUpload size={14} strokeWidth={2.5} />
                    }
                    disabled={isUploading || isParsing}
                    onClick={handleUpload}
                  >
                    Upload
                  </Button>
                  <Button
                    size="small"
                    color="danger"
                    variant="outlined"
                    shape="round"
                    icon={<Trash2 size={14} strokeWidth={2.5} />}
                    disabled={isUploading}
                    onClick={clearSelection}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          )}
        />
      )}
    </div >
  );
};

export default ImportPage;
