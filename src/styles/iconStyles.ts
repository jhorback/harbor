

import { css } from 'lit-element';


/**
 * See https://fonts.google.com/icons for icons.
 * 
 * Usage:
 * ```
 * <span class="material-symbols-outlined">settings</span>
 * ```
 */
export const iconStyles = css`
/* iconStyles */
.material-symbols-outlined, .icon-button {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 48;
  font-family: 'Material Symbols Outlined';
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
}

.icon-button {
  position: relative;
  border-radius: var(--md-sys-shape-corner-full);
  cursor: default;
  user-select: none;
  border:1px solid transparent;
}
.icon-button:hover::before {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: var(--md-sys-color-on-background);
  border-radius: var(--md-sys-shape-corner-full);
  opacity: 0.1;
}
.icon-button:active::before {
  opacity: 0.5;
}
.icon-button:active, .icon-button:focus {
  border: 1px solid var(--md-sys-color-on-background);
}
.icon-small {
  font-size:20px;
  padding: 10px;
}
.icon-medium {
  font-size:24px;
  padding: 12px;
}
.icon-large {
  font-size:40px;
  padding: 4px;
}
.icon-extra-large {
  font-size:48px;
  padding: 4px;
}
`;