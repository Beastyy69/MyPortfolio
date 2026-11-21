import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import Icon from './Icon.jsx';
import useMagnetic from '../../hooks/useMagnetic.js';

/**
 * Theme‑aware magnetic button / link. Renders <a> when `href` is set.
 * variant: 'primary' | 'ghost' | 'subtle' | 'giant'
 */
const Button = forwardRef(function Button(
  { href, variant = 'primary', icon, iconLeft, children, className = '', magnetic = true, cursor, ...rest },
  ref,
) {
  const Tag = href ? motion.a : motion.button;
  const external = href && /^https?:/.test(href);
  const mag = useMagnetic(variant === 'giant' ? 0.25 : 0.3);

  return (
    <Tag
      ref={ref}
      href={href}
      className={`btn btn--${variant} ${className}`}
      data-cursor={cursor ?? (external ? 'Open' : undefined)}
      whileTap={{ scale: 0.97 }}
      {...(magnetic ? mag : {})}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      {...rest}
    >
      {iconLeft && <Icon name={iconLeft} size={variant === 'giant' ? 22 : 16} />}
      <span className="btn__label">{children}</span>
      {icon && <Icon name={icon} size={variant === 'giant' ? 22 : 16} className="btn__icon" />}
    </Tag>
  );
});

export default Button;
