type PredictionRecord = Record<string, unknown>;

type NullableNumber = number | null;

const WEIGHTS = {
  bankDescription: 0.75,
  recipient: 0.25,
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
    description: string;
  };
  paymentApp?: {
    recipient: string;
  };
};

export type PredictionSample = {
  source?: PredictionInput['source'];
  signature?: string;
  bank?: {
    description?: string;
  };
  paymentApp?: {
    recipient?: string;
  };
  output: {
    description?: string;
    category?: number;
    group?: number;
  };
};

export type PredictionPayload = PredictionInput & {
  signature?: string;
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

const toSourceOrUndefined = (value: unknown): PredictionInput['source'] | undefined =>
  value === 'bank_modal' || value === 'payment_app_modal' ? value : undefined;

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

const normalizeText = (value: string | undefined): string => {
  if (!value) return '';
  return value
    .toLowerCase()
    .replace(/\d+/g, ' ')
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

const pushScore = (
  featureValue: NullableNumber,
  weight: number,
  state: { score: number; weight: number },
) => {
  if (featureValue === null) return;
  state.score += featureValue * weight;
  state.weight += weight;
};

const scoreTextFeature = (inputText: string | undefined, sampleText: string | undefined): NullableNumber => {
  const normalizedInputText = normalizeText(inputText);
  if (!normalizedInputText) return null;

  const normalizedSampleText = normalizeText(sampleText);
  if (!normalizedSampleText) return 0;

  return stringSimilarity(normalizedInputText, normalizedSampleText) ?? 0;
};

const hasOutput = (sample: PredictionSample): boolean =>
  Boolean(sample.output.description) ||
  sample.output.category !== undefined ||
  sample.output.group !== undefined;

const normalizeSample = (record: PredictionRecord): PredictionSample | null => {
  const bankRecord = isRecord(record.bank) ? record.bank : null;
  const paymentAppRecord = isRecord(record.paymentApp) ? record.paymentApp : null;
  const outputRecord = isRecord(record.output) ? record.output : null;
  const source = toSourceOrUndefined(record.source);
  const signature = pickString(record, ['signature']);

  const bankDescription = pickString(record, [
    'bankDescription',
    'transactionDescription',
    'narration',
    'statementDescription',
    'rawDescription',
  ]) ?? (bankRecord ? pickString(bankRecord, ['description', 'bankDescription']) : undefined);
  const appRecipient =
    pickString(record, ['recipient', 'paymentRecipient', 'payee', 'merchant', 'party']) ??
    (paymentAppRecord ? pickString(paymentAppRecord, ['recipient', 'payee']) : undefined);

  const sample: PredictionSample = {
    source,
    signature,
    bank: bankDescription
      ? {
          description: bankDescription,
        }
      : undefined,
    paymentApp: appRecipient
      ? {
          recipient: appRecipient,
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

  if (input.source === 'bank_modal') {
    pushScore(
      scoreTextFeature(input.bank?.description, sample.bank?.description),
      WEIGHTS.bankDescription,
      scoreState,
    );
    if (input.paymentApp?.recipient) {
      pushScore(
        scoreTextFeature(input.paymentApp.recipient, sample.paymentApp?.recipient),
        WEIGHTS.recipient,
        scoreState,
      );
    }
  } else {
    pushScore(scoreTextFeature(input.paymentApp?.recipient, sample.paymentApp?.recipient), 1, scoreState);
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

type SignatureSource = Pick<PredictionSample, 'source' | 'bank' | 'paymentApp' | 'output'>;

const getPredictionSignatureSeed = (sample: SignatureSource): string =>
  JSON.stringify({
    source: sample.source,
    bank: {
      description: normalizeText(sample.bank?.description),
    },
    paymentApp: {
      recipient: normalizeText(sample.paymentApp?.recipient),
    },
    output: {
      description: normalizeText(sample.output.description),
      category: sample.output.category ?? null,
      group: sample.output.group ?? null,
    },
  });

const getSampleSignature = (sample: PredictionSample): string =>
  sample.signature?.trim() || getPredictionSignatureSeed(sample);

const hashFallback = (value: string): string => {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return `fnv1a_${(hash >>> 0).toString(16).padStart(8, '0')}`;
};

const toHex = (buffer: ArrayBuffer): string =>
  Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');

export const buildPredictionSignature = async (sample: PredictionPayload): Promise<string> => {
  const seed = getPredictionSignatureSeed(sample);
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) return hashFallback(seed);

  try {
    const digest = await subtle.digest('SHA-256', new TextEncoder().encode(seed));
    return toHex(digest);
  } catch {
    return hashFallback(seed);
  }
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
  const sampleSignatureSeed = getPredictionSignatureSeed(sample);

  const deduped = existing.filter((item) => {
    const itemSignature = getSampleSignature(item);
    if (itemSignature === sampleSignature) return false;

    const itemSignatureSeed = getPredictionSignatureSeed(item);
    return itemSignatureSeed !== sampleSignatureSeed;
  });
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
