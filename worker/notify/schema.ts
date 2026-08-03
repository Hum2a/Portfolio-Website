import { z } from 'zod';

export const ALLOWED_TYPES = ['new_visitor', 'ref_hit', 'test'] as const;

/** Match legacy: any non-null object (including arrays). */
const payloadSchema = z.custom<Record<string, unknown>>(
  (v) => v != null && typeof v === 'object'
);

export const trafficNotifyBodySchema = z.object({
  type: z.enum(ALLOWED_TYPES),
  payload: payloadSchema,
  recipients: z.array(z.string()).optional(),
});

export type TrafficNotifyBody = z.infer<typeof trafficNotifyBodySchema>;

export const EXPECTED_BODY_ERROR =
  'Expected { type: "new_visitor"|"ref_hit"|"test", payload: object }';
