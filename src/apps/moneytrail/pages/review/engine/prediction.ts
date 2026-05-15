type TransactionType = 'Credit' | 'Debit';

type PredictionRecord = Record<string, unknown>;

type OptionalTransactionType = TransactionType | null;

type NullableNumber = number | null;

const WEIGHTS = {
  typeMatch: 0.22,
  bankMatch: 0.18,
  bankDescription: 0.30,
  recipient: 0.18,
  utr: 0.07,
  appBankMatch: 0.05,
};

const STOP_WORDS = new Set([
  'a',
  'an',
  'and',
  'app',
  'bank',
  'for',
  'from',
  'in',
  'of',
  'on',
  'paid',
  'payment',
  'received',
  'the',
  'to',
  'txn',
  'transaction',
  'upi',
  'via',
]);

const HIGH_CONFIDENCE = 0.82;
const MEDIUM_CONFIDENCE = 0.65;
const LOW_CONFIDENCE = 0.45;
const AMBIGUITY_GAP = 0.05;
const STORAGE_VERSION = 1;
const STORAGE_LIMIT = 500;
const STORAGE_KEY = 'moneytrail.review.predictions.v1';

export type PredictionInput = {
  source: 'bank_modal' | 'payment_app_modal';
  bank?: {
    type: TransactionType;
    bank: string;
    description: string;
  };
  paymentApp?: {
    recipient: string;
    utr: string;
    bank: string;
    type?: TransactionType;
  };
};

export type PredictionSample = {
  bank?: {
    type?: TransactionType;
    bank?: string;
    description?: string;
  };
  paymentApp?: {
    recipient?: string;
    utr?: string;
    bank?: string;
    type?: TransactionType;
  };
  output: {
    description?: string;
    category?: number;
    group?: number;
  };
};

export type PredictionConfidence = 'none' | 'low' | 'medium' | 'high';

export type PredictionResult = {
  description?: string;
  category?: number;
  group?: number;
  confidence: PredictionConfidence;
  score: number;
  hasSuggestion: boolean;
};

const isRecord = (value: unknown): value is PredictionRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const toRecordArray = (value: unknown): PredictionRecord[] => {
  if (Array.isArray(value)) return value.filter(isRecord);
  if (isRecord(value) && Array.isArray(value.value)) return value.value.filter(isRecord);
  if (isRecord(value) && Array.isArray(value.data)) return value.data.filter(isRecord);
  return [];
};

const toStringOrUndefined = (value: unknown): string | undefined => {
  if (typeof value !== 'string' && typeof value !== 'number') return undefined;
  const formatted = `${value}`.trim();
  return formatted.length ? formatted : undefined;
};

const toNumberOrUndefined = (value: unknown): number | undefined => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value !== 'string') return undefined;
  const parsed = Number(value.trim());
  return Number.isFinite(parsed) ? parsed : undefined;
};

const pickString = (record: PredictionRecord, keys: string[]): string | undefined => {
  for (const key of keys) {
    const value = toStringOrUndefined(record[key]);
    if (value) return value;
  }
  return undefined;
};

const pickNumber = (record: PredictionRecord, keys: string[]): number | undefined => {
  for (const key of keys) {
    const value = toNumberOrUndefined(record[key]);
    if (value !== undefined) return value;
  }
  return undefined;
};

const normalizeType = (value: string | undefined): OptionalTransactionType => {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  if (normalized.includes('credit') || normalized === 'cr') return 'Credit';
  if (normalized.includes('debit') || normalized === 'dr') return 'Debit';
  return null;
};

const normalizeText = (value: string | undefined): string => {
  if (!value) return '';
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const tokenize = (value: string): Set<string> =>
  new Set(
    value
      .split(' ')
      .map((token) => token.trim())
      .filter((token) => token.length > 1 && !STOP_WORDS.has(token)),
  );

const jaccardSimilarity = (left: Set<string>, right: Set<string>): number => {
  if (left.size === 0 || right.size === 0) return 0;
  let intersection = 0;
  for (const token of left) {
    if (right.has(token)) intersection += 1;
  }
  const union = left.size + right.size - intersection;
  return union === 0 ? 0 : intersection / union;
};

const stringSimilarity = (left: string | undefined, right: string | undefined): NullableNumber => {
  const normalizedLeft = normalizeText(left);
  const normalizedRight = normalizeText(right);
  if (!normalizedLeft || !normalizedRight) return null;

  if (normalizedLeft === normalizedRight) return 1;

  const contains =
    normalizedLeft.includes(normalizedRight) || normalizedRight.includes(normalizedLeft) ? 0.85 : 0;

  const tokenScore = jaccardSimilarity(tokenize(normalizedLeft), tokenize(normalizedRight));
  return Math.max(contains, tokenScore);
};

const typeSimilarity = (left: string | undefined, right: string | undefined): NullableNumber => {
  const normalizedLeft = normalizeType(left);
  const normalizedRight = normalizeType(right);
  if (!normalizedLeft || !normalizedRight) return null;
  return normalizedLeft === normalizedRight ? 1 : 0;
};

const normalizeUtr = (value: string | undefined): string => {
  if (!value) return '';
  return value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
};

const utrSimilarity = (left: string | undefined, right: string | undefined): NullableNumber => {
  const normalizedLeft = normalizeUtr(left);
  const normalizedRight = normalizeUtr(right);
  if (!normalizedLeft || !normalizedRight) return null;
  if (normalizedLeft === normalizedRight) return 1;

  const shorter = normalizedLeft.length <= normalizedRight.length ? normalizedLeft : normalizedRight;
  const longer = normalizedLeft.length > normalizedRight.length ? normalizedLeft : normalizedRight;

  if (shorter.length >= 6 && longer.includes(shorter)) return 0.6;
  if (shorter.length >= 6 && longer.endsWith(shorter.slice(-6))) return 0.45;
  return 0;
};

const pushScore = (
  featureValue: NullableNumber,
  weight: number,
  state: { score: number; weight: number },
) => {
  if (featureValue === null) return;
  state.score += featureValue * weight;
  state.weight += weight;
};

const scoreTypeFeature = (inputType: string | undefined, sampleType: string | undefined): NullableNumber => {
  const normalizedInputType = normalizeType(inputType);
  if (!normalizedInputType) return null;

  const normalizedSampleType = normalizeType(sampleType);
  if (!normalizedSampleType) return 0;

  return normalizedInputType === normalizedSampleType ? 1 : 0;
};

const scoreTextFeature = (inputText: string | undefined, sampleText: string | undefined): NullableNumber => {
  const normalizedInputText = normalizeText(inputText);
  if (!normalizedInputText) return null;

  const normalizedSampleText = normalizeText(sampleText);
  if (!normalizedSampleText) return 0;

  return stringSimilarity(normalizedInputText, normalizedSampleText) ?? 0;
};

const scoreUtrFeature = (inputUtr: string | undefined, sampleUtr: string | undefined): NullableNumber => {
  const normalizedInputUtr = normalizeUtr(inputUtr);
  if (!normalizedInputUtr) return null;

  const normalizedSampleUtr = normalizeUtr(sampleUtr);
  if (!normalizedSampleUtr) return 0;

  return utrSimilarity(normalizedInputUtr, normalizedSampleUtr) ?? 0;
};

const hasOutput = (sample: PredictionSample): boolean =>
  Boolean(sample.output.description) ||
  sample.output.category !== undefined ||
  sample.output.group !== undefined;

const normalizeSample = (record: PredictionRecord): PredictionSample | null => {
  const bankRecord = isRecord(record.bank) ? record.bank : null;
  const paymentAppRecord = isRecord(record.paymentApp) ? record.paymentApp : null;
  const outputRecord = isRecord(record.output) ? record.output : null;

  const bankDescription = pickString(record, [
    'bankDescription',
    'transactionDescription',
    'narration',
    'statementDescription',
    'rawDescription',
  ]) ?? (bankRecord ? pickString(bankRecord, ['description', 'bankDescription']) : undefined);
  const recipient = pickString(record, ['recipient', 'paymentRecipient', 'payee', 'merchant', 'party']);
  const genericType = pickString(record, ['type', 'txnType', 'transactionType']);
  const genericBank = pickString(record, ['bank', 'bankName']);

  const bankType =
    (bankRecord ? pickString(bankRecord, ['type']) : undefined) ??
    pickString(record, ['bankType', 'bankTxnType']) ??
    (bankDescription ? genericType : undefined);
  const bankName =
    (bankRecord ? pickString(bankRecord, ['bank']) : undefined) ??
    pickString(record, ['bankAccount', 'sourceBank']) ??
    (bankDescription ? genericBank : undefined);

  const appType =
    (paymentAppRecord ? pickString(paymentAppRecord, ['type']) : undefined) ??
    pickString(record, ['paymentType', 'paymentTxnType', 'upiType']) ?? (recipient ? genericType : undefined);
  const appBank =
    (paymentAppRecord ? pickString(paymentAppRecord, ['bank']) : undefined) ??
    pickString(record, ['paymentBank', 'paymentAppBank', 'upiBank', 'appBank']) ??
    (recipient ? genericBank : undefined);
  const appRecipient =
    recipient ?? (paymentAppRecord ? pickString(paymentAppRecord, ['recipient', 'payee']) : undefined);
  const appUtr =
    (paymentAppRecord ? pickString(paymentAppRecord, ['utr', 'reference']) : undefined) ??
    pickString(record, ['utr', 'upiRef', 'reference', 'transactionRef', 'upiTransactionId']);

  const sample: PredictionSample = {
    bank: bankType || bankName || bankDescription
      ? {
          type: normalizeType(bankType ?? undefined) ?? undefined,
          bank: bankName,
          description: bankDescription,
        }
      : undefined,
    paymentApp: appType || appBank || appRecipient
      ? {
          type: normalizeType(appType ?? undefined) ?? undefined,
          recipient: appRecipient,
          utr: appUtr,
          bank: appBank,
        }
      : undefined,
    output: {
      description:
        (outputRecord ? pickString(outputRecord, ['description']) : undefined) ??
        pickString(record, [
          'outputDescription',
          'finalDescription',
          'expenseDescription',
          'description',
        ]),
      category:
        (outputRecord ? pickNumber(outputRecord, ['category']) : undefined) ??
        pickNumber(record, ['categoryId', 'outputCategory', 'finalCategory', 'category']),
      group:
        (outputRecord ? pickNumber(outputRecord, ['group']) : undefined) ??
        pickNumber(record, ['groupId', 'outputGroup', 'finalGroup', 'group']),
    },
  };

  if (!sample.bank && !sample.paymentApp) return null;
  if (!hasOutput(sample)) return null;
  return sample;
};

const scoreSample = (input: PredictionInput, sample: PredictionSample): number => {
  const scoreState = { score: 0, weight: 0 };

  const inputType = input.bank?.type ?? input.paymentApp?.type;
  const sampleType = input.paymentApp
    ? sample.paymentApp?.type ?? sample.bank?.type
    : sample.bank?.type ?? sample.paymentApp?.type;
  pushScore(scoreTypeFeature(inputType, sampleType), WEIGHTS.typeMatch, scoreState);

  if (input.bank) {
    pushScore(scoreTextFeature(input.bank.bank, sample.bank?.bank), WEIGHTS.bankMatch, scoreState);
    pushScore(
      scoreTextFeature(input.bank.description, sample.bank?.description),
      WEIGHTS.bankDescription,
      scoreState,
    );
  }

  if (input.paymentApp) {
    pushScore(
      scoreTextFeature(input.paymentApp.recipient, sample.paymentApp?.recipient),
      WEIGHTS.recipient,
      scoreState,
    );
    pushScore(scoreUtrFeature(input.paymentApp.utr, sample.paymentApp?.utr), WEIGHTS.utr, scoreState);
    pushScore(
      scoreTextFeature(input.paymentApp.bank, sample.paymentApp?.bank),
      WEIGHTS.appBankMatch,
      scoreState,
    );
  }

  return scoreState.weight === 0 ? 0 : scoreState.score / scoreState.weight;
};

const resolveConfidence = (score: number): PredictionConfidence => {
  if (score >= HIGH_CONFIDENCE) return 'high';
  if (score >= MEDIUM_CONFIDENCE) return 'medium';
  if (score >= LOW_CONFIDENCE) return 'low';
  return 'none';
};

const hasPredictionInput = (input: PredictionInput): boolean =>
  Boolean(input.bank || input.paymentApp);

type PredictionStorageState = {
  version: number;
  updatedAt: number;
  samples: PredictionSample[];
};

const getStorage = (): Storage | null => {
  if (typeof window === 'undefined') return null;
  return window.localStorage;
};

const toStorageState = (value: unknown): PredictionStorageState | null => {
  if (!isRecord(value)) return null;
  const samples = toPredictionSamples((value as PredictionRecord).samples);
  return {
    version: STORAGE_VERSION,
    updatedAt: Date.now(),
    samples,
  };
};

const getSampleSignature = (sample: PredictionSample): string => {
  return JSON.stringify({
    bank: {
      type: sample.bank?.type ?? null,
      bank: normalizeText(sample.bank?.bank),
      description: normalizeText(sample.bank?.description),
    },
    paymentApp: {
      type: sample.paymentApp?.type ?? null,
      bank: normalizeText(sample.paymentApp?.bank),
      recipient: normalizeText(sample.paymentApp?.recipient),
      utr: normalizeUtr(sample.paymentApp?.utr),
    },
    output: {
      description: normalizeText(sample.output.description),
      category: sample.output.category ?? null,
      group: sample.output.group ?? null,
    },
  });
};

export const toPredictionSamples = (raw: unknown): PredictionSample[] =>
  toRecordArray(raw)
    .map(normalizeSample)
    .filter((sample): sample is PredictionSample => sample !== null);

export const loadPredictionSamplesFromStorage = (): PredictionSample[] => {
  const storage = getStorage();
  if (!storage) return [];

  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as unknown;
    const state = toStorageState(parsed);
    return state?.samples ?? [];
  } catch {
    return [];
  }
};

export const savePredictionSamplesToStorage = (samples: PredictionSample[]): PredictionSample[] => {
  const storage = getStorage();
  const trimmedSamples = samples.slice(0, STORAGE_LIMIT);
  if (!storage) return trimmedSamples;

  const state: PredictionStorageState = {
    version: STORAGE_VERSION,
    updatedAt: Date.now(),
    samples: trimmedSamples,
  };

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    return trimmedSamples;
  }

  return trimmedSamples;
};

export const hydratePredictionSamplesFromApi = (raw: unknown): PredictionSample[] => {
  const samples = toPredictionSamples(raw);
  return savePredictionSamplesToStorage(samples);
};

export const upsertPredictionSampleInStorage = (sample: PredictionSample): PredictionSample[] => {
  if (!hasOutput(sample)) return loadPredictionSamplesFromStorage();

  const existing = loadPredictionSamplesFromStorage();
  const sampleSignature = getSampleSignature(sample);

  const deduped = existing.filter((item) => getSampleSignature(item) !== sampleSignature);
  const updated = [sample, ...deduped];

  return savePredictionSamplesToStorage(updated);
};

export const predictReviewFields = (
  input: PredictionInput,
  samples: PredictionSample[],
): PredictionResult => {
  if (!hasPredictionInput(input) || samples.length === 0) {
    return { confidence: 'none', score: 0, hasSuggestion: false };
  }

  const ranked = samples
    .map((sample) => ({
      sample,
      score: scoreSample(input, sample),
    }))
    .filter((candidate) => candidate.score > 0)
    .sort((left, right) => right.score - left.score);

  const top = ranked[0];
  if (!top || !hasOutput(top.sample)) {
    return { confidence: 'none', score: 0, hasSuggestion: false };
  }

  let confidence = resolveConfidence(top.score);
  const second = ranked[1];
  if (second && top.score - second.score < AMBIGUITY_GAP && confidence === 'high') {
    confidence = 'medium';
  }

  const hasSuggestion = confidence !== 'none';
  return {
    description: top.sample.output.description,
    category: top.sample.output.category,
    group: top.sample.output.group,
    confidence,
    score: top.score,
    hasSuggestion,
  };
};

export const formatPredictionScore = (score: number): string => `${Math.round(score * 100)}%`;
