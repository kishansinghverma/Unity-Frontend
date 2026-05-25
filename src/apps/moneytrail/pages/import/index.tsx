import { Button, Card, Col, List, Row, Table, Tag, Typography, Upload } from "antd";
import type { TableColumnsType, UploadProps } from "antd";
import dayjs from "dayjs";
import { AlignLeft, BadgeIndianRupee, Calendar, Clock, CloudUpload, CodeXml, Database, FileText, FileUp, Hash, LoaderCircle, ScanSearch, Table as Table1, Table2, Trash2, UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import { PostParams, Routes } from "../../../../engine/constant";
import { handleError, handleJsonResponse } from "../../../../engine/helpers/httpHelper";
import { getFormattedAmount } from "../../../../engine/helpers/numberHelper";
import { NotificationMessages, notify } from "../../../../engine/services/notificationService";
import { AppRecord, BankRecord } from "../review/engine/contracts/models";
import { extractDataFromCsv, extractDataFromExcel, extractDataFromHtml, parsePhonePeStatement } from "./engine/parser";

const { Dragger } = Upload;
const { Text } = Typography;

type ParsedRecordType = "bank" | "app";

type ParsedStatementPreview = {
  fileName: string;
  fileType: string;
  recordType: ParsedRecordType;
  records: Array<BankRecord> | Array<AppRecord>;
};

type UploadResult = {
  insertedCount: number;
  totalCount: number;
};

type BankPreviewRow = BankRecord & { key: string };
type AppPreviewRow = AppRecord & { key: string };
type FormatTone = "pdf" | "xlsx" | "html" | "csv";

type SupportedFormatItem = {
  tone: FormatTone;
  extension: "PDF" | "XLSX" | "HTML" | "CSV";
  title: string;
  description: string;
};

const SUPPORTED_FORMAT_GROUPS: SupportedFormatItem[][] = [
  [
    {
      tone: "pdf",
      extension: "PDF",
      title: "PhonePe Statement",
      description: "Download the PDF statement from PhonePe App.",
    },
    {
      tone: "xlsx",
      extension: "XLSX",
      title: "Paytm Statement",
      description: "Download the Excel statement from Paytm App.",
    },
  ],
  [
    {
      tone: "xlsx",
      extension: "XLSX",
      title: "HDFC Statement",
      description: "Download Excel File from App/Netbanking.",
    },
    {
      tone: "xlsx",
      extension: "XLSX",
      title: "SBI Statement",
      description: "Download Excel File from App/Netbanking.",
    },
  ],
  [
    {
      tone: "html",
      extension: "HTML",
      title: "SBI Credit Card",
      description: "Get <tbody> from Web App as HTML File using VS Code.",
    },
    {
      tone: "csv",
      extension: "CSV",
      title: "ICICI Credit Card",
      description: "Get Monthly / Yearly Statement as CSV File from WebApp.",
    },
  ],
];

const formatToneStyles: Record<FormatTone, { iconClassName: string }> = {
  pdf: {
    iconClassName: "bg-red-100 text-red-700",
  },
  xlsx: {
    iconClassName: "bg-green-100 text-green-700",
  },
  html: {
    iconClassName: "bg-amber-100 text-amber-700",
  },
  csv: {
    iconClassName: "bg-blue-100 text-blue-700",
  },
};

const getFormatIcon = (tone: FormatTone) => {
  switch (tone) {
    case "xlsx":
      return <Table2 size={18} strokeWidth={2} />;
    case "html":
      return <CodeXml size={18} strokeWidth={2} />;
    case "csv":
      return <Table1 size={18} strokeWidth={2} />;
    default:
      return <FileText size={18} strokeWidth={2} />;
  }
};

const notificationMessages: NotificationMessages = {
  pending: "Uploading Document",
  success: "Upload Success",
  error: "Upload Failed",
};

const isExcelMimeType = (fileType: string) =>
  fileType === "application/vnd.ms-excel" ||
  fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

const isAppRecordArray = (records: Array<BankRecord> | Array<AppRecord>): records is Array<AppRecord> =>
  records.length > 0 && "transactionId" in records[0];


const getRecordLabel = (recordType: ParsedRecordType) => (recordType === "app" ? "AppRecord" : "BankRecord");

const parseStatementFile = async (file: File): Promise<ParsedStatementPreview> => {
  const extension = file.name.split(".").pop()?.toLowerCase();
  const mimeType = file.type;

  if (mimeType === "application/pdf" || extension === "pdf") {
    const records = await parsePhonePeStatement(file);
    if (records.length === 0) throw new Error("No records extracted from statement.");
    return { fileName: file.name, fileType: "PDF", recordType: "app", records };
  }

  if (isExcelMimeType(mimeType) || extension === "xls" || extension === "xlsx") {
    const records = await extractDataFromExcel(file);
    if (records.length === 0) throw new Error("No records extracted from statement.");

    return {
      fileName: file.name,
      fileType: "Excel",
      recordType: isAppRecordArray(records) ? "app" : "bank",
      records,
    };
  }

  if (mimeType === "text/html" || extension === "html") {
    const records = await extractDataFromHtml(file);
    if (records.length === 0) throw new Error("No BankRecord extracted from statement.");
    return { fileName: file.name, fileType: "HTML", recordType: "bank", records };
  }

  if (mimeType === "text/csv" || extension === "csv") {
    const records = await extractDataFromCsv(file);
    if (records.length === 0) throw new Error("No BankRecord extracted from statement.");
    return { fileName: file.name, fileType: "CSV", recordType: "bank", records };
  }

  throw new Error("File type not supported.");
};

const uploadTransactions = (payload: ParsedStatementPreview): Promise<UploadResult> => {
  const route = payload.recordType === "app" ? Routes.AppRecordStatement : Routes.BankRecordStatement;
  return fetch(route, { ...PostParams, body: JSON.stringify(payload.records) }).then(handleJsonResponse);
};

const ImportPage: React.FC = () => {
  const [isParsing, setIsParsing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [parsedPreview, setParsedPreview] = useState<ParsedStatementPreview | null>(null);

  const bankColumns: TableColumnsType<BankPreviewRow> = [
    {
      title: (
        <span className="flex items-center gap-1.5 text-gray-600">
          <Calendar size={14} /> Date
        </span>
      ),
      dataIndex: "date",
      key: "date",
      width: 130,
      render: (value: Date) => (<Text type="secondary">{dayjs(value).format("DD MMM YYYY")}</Text>)
    },
    {
      title: (
        <span className="flex items-center gap-1.5 text-gray-600">
          <AlignLeft size={14} /> Description
        </span>
      ),
      dataIndex: "description",
      key: "description",
      render: (value: string) => <Text style={{ textTransform: "capitalize" }}>{value.toLowerCase()}</Text>,
    },
    {
      title: (
        <span className="flex items-center justify-end gap-1.5 text-gray-600">
          <BadgeIndianRupee size={14} /> Amount
        </span>
      ),
      dataIndex: "amount",
      key: "amount",
      width: 150,
      align: "right",
      onCell: (record: BankPreviewRow) => ({
        className: record.type === "Credit" ? "bg-green-50/50" : "bg-red-50/50",
      }),
      render: (value: number, record: BankPreviewRow) => (
        <Text strong className={record.type === "Credit" ? "text-green-600" : "text-red-600"}>
          {record.type === "Credit" ? "+" : "-"}{getFormattedAmount(value)}
        </Text>
      ),
    },
  ];

  const appColumns: TableColumnsType<AppPreviewRow> = [
    {
      title: (
        <span className="flex items-center gap-1.5 text-gray-600">
          <Calendar size={14} /> Date
        </span>
      ),
      dataIndex: "date",
      key: "date",
      width: 120,
      render: (value: Date) => (
        <Text>{dayjs(value).format("DD MMM YYYY")}</Text>
      ),
    },
    {
      title: (
        <span className="flex items-center gap-1.5 text-gray-600">
          <Clock size={14} /> Time
        </span>
      ),
      dataIndex: "date",
      key: "time",
      width: 100,
      render: (value: Date) => (
        <Text type="secondary">{dayjs(value).format("hh:mm A")}</Text>
      ),
    },
    {
      title: (
        <span className="flex items-center gap-1.5 text-gray-600">
          <Hash size={14} /> UTR
        </span>
      ),
      dataIndex: "utr",
      key: "utr",
      width: 400,
      render: (value: string) => <a type="secondary">{value}</a>,
    },
    {
      title: (
        <span className="flex items-center gap-1.5 text-gray-600">
          <UserRound size={14} /> Recipient
        </span>
      ),
      dataIndex: "recipient",
      key: "recipient",
      render: (value: string) => <Text style={{ textTransform: "capitalize" }}>{value.toLowerCase()}</Text>,
    },
    {
      title: (
        <span className="flex items-center justify-end gap-1.5 text-gray-600">
          <BadgeIndianRupee size={14} /> Amount
        </span>
      ),
      dataIndex: "amount",
      key: "amount",
      width: 120,
      align: "right",
      onCell: (record: AppPreviewRow) => ({
        className: record.type === "Credit" ? "bg-green-50/50" : "bg-red-50/50",
      }),
      render: (value: number, record: AppPreviewRow) => (
        <Text strong className={record.type === "Credit" ? "text-green-600" : "text-red-600"}>
          {record.type === "Credit" ? "+" : "-"}{getFormattedAmount(value)}
        </Text>
      ),
    },
  ];

  const bankRows = useMemo<BankPreviewRow[]>(
    () =>
      parsedPreview?.recordType === "bank"
        ? (parsedPreview.records as BankRecord[]).map((record, index) => ({
          ...record,
          key: `${record.description}-${index}`,
        }))
        : [],
    [parsedPreview],
  );

  const appRows = useMemo<AppPreviewRow[]>(
    () =>
      parsedPreview?.recordType === "app"
        ? (parsedPreview.records as AppRecord[]).map((record, index) => ({
          ...record,
          key: `${record.transactionId}-${index}`,
        }))
        : [],
    [parsedPreview],
  );

  const previewColumns = parsedPreview?.recordType === "bank" ? bankColumns : appColumns;
  const previewRows = parsedPreview?.recordType === "bank" ? bankRows : appRows;

  const clearSelection = () => {
    setParsedPreview(null);
  };

  const parseSelectedFile = async (file: File) => {
    setIsParsing(true);
    setParsedPreview(null);

    try {
      const parsedData = await parseStatementFile(file);
      setParsedPreview(parsedData);

      notify.success({
        message: "Parsing Successful",
        description: `Parsed ${parsedData.records.length} ${getRecordLabel(parsedData.recordType)} entries.`,
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
      pending: `Uploading ${getRecordLabel(parsedPreview.recordType)} statement...`,
      success: (data: UploadResult) =>
        `Uploaded ${data.insertedCount}/${data.totalCount} ${getRecordLabel(parsedPreview.recordType)} entries.`,
    });

    try {
      await response;
      clearSelection();
    } catch {
      // handled by notify.promise
    } finally {
      setIsUploading(false);
    }
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
          {SUPPORTED_FORMAT_GROUPS.map((group, groupIndex) => (
            <Col key={`format-group-${groupIndex}`} span={8}>
              <List>
                {group.map((item) => {
                  const toneStyle = formatToneStyles[item.tone];

                  return (
                    <List.Item key={`${item.title}-${item.extension}`}>
                      <div className="flex w-full items-center gap-3">
                        <span className={`inline-flex p-2 items-center justify-center rounded-md ${toneStyle.iconClassName}`}>
                          {getFormatIcon(item.tone)}
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
                  <Tag className="rounded-full px-2.5 inline-flex items-center gap-1.5" color="cyan">
                    <CodeXml size={12} strokeWidth={2.5} />
                    <span>{parsedPreview.fileType}</span>
                  </Tag>
                  <Tag className="rounded-full px-2.5 inline-flex items-center gap-1.5" color="green">
                    <Database size={12} strokeWidth={2.5} />
                    <span>Records : {parsedPreview.records.length}</span>
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
