import React from 'react';
import { cn } from '@/lib/utils';
import './textarea-paper-expansion.css';
import './textarea-paper-expansion-host.css';

export type TextareaPaperExpansionProps = {
  label: React.ReactNode;
  id: string;
  error?: boolean;
  className?: string;
  embed?: boolean;
} & Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  'className' | 'rows'
>;

const TextareaPaperExpansion: React.FC<TextareaPaperExpansionProps> = ({
  label,
  id,
  error = false,
  className,
  embed = true,
  disabled,
  spellCheck = false,
  autoComplete = 'off',
  placeholder = ' ',
  ...textareaProps
}) => (
  <section
    className={cn('tpe', embed && 'tpe--embed', error && 'tpe--error', className)}
    data-textarea-paper-expansion
  >
    <label className="tpe__label" htmlFor={id}>
      {label}
    </label>

    <div className="tpe__stack">
      <span className="tpe__sheet tpe__sheet--cyan" aria-hidden="true" />
      <span className="tpe__sheet tpe__sheet--grey" aria-hidden="true" />
      <textarea
        className="tpe__area"
        id={id}
        rows={3}
        placeholder={placeholder}
        disabled={disabled}
        spellCheck={spellCheck}
        autoComplete={autoComplete}
        aria-invalid={error || undefined}
        {...textareaProps}
      />
      <span className="tpe__fold" aria-hidden="true" />
    </div>
  </section>
);

export default TextareaPaperExpansion;
