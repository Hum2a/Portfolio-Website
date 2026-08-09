import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import './HoverCutout.css';

type SharedProps = {
  children: React.ReactNode;
  className?: string;
  size?: 'default' | 'sm';
  block?: boolean;
};

type LinkProps = SharedProps &
  Omit<React.ComponentPropsWithoutRef<typeof Link>, 'className' | 'children'> & {
    href?: never;
    type?: never;
    disabled?: never;
  };

type AnchorProps = SharedProps &
  Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    'className' | 'children' | 'href'
  > & {
    href: string;
    to?: never;
    type?: never;
    disabled?: never;
  };

type ButtonProps = SharedProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & {
    to?: never;
    href?: never;
  };

export type CutoutActionProps = LinkProps | AnchorProps | ButtonProps;

function itemClass(size: 'default' | 'sm', block: boolean, className?: string) {
  return cn(
    'hco__item',
    size === 'sm' && 'hco__item--sm',
    block && 'hco__item--block',
    className
  );
}

function CutoutInner({ children }: { children: React.ReactNode }) {
  return (
    <>
      <span className="hco__red" aria-hidden="true" />
      <span className="hco__mass" aria-hidden="true" />
      <span className="hco__cut" aria-hidden="true" />
      <span className="hco__label">{children}</span>
    </>
  );
}

export const CutoutAction = React.forwardRef<
  HTMLAnchorElement | HTMLButtonElement,
  CutoutActionProps
>(function CutoutAction(props, ref) {
  const { children, className, size = 'default', block = false } = props;
  const rootClass = itemClass(size, block, className);

  if ('to' in props && props.to != null) {
    const { children: _children, className: _className, size: _size, block: _block, ...rest } =
      props;
    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        className={rootClass}
        {...rest}
      >
        <CutoutInner>{children}</CutoutInner>
      </Link>
    );
  }

  if ('href' in props && props.href) {
    const { children: _children, className: _className, size: _size, block: _block, ...rest } =
      props;
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        className={rootClass}
        {...rest}
      >
        <CutoutInner>{children}</CutoutInner>
      </a>
    );
  }

  const {
    children: _children,
    className: _className,
    size: _size,
    block: _block,
    type = 'button',
    ...rest
  } = props as ButtonProps;

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      className={rootClass}
      {...rest}
    >
      <CutoutInner>{children}</CutoutInner>
    </button>
  );
});
