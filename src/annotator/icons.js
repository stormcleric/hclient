// @ts-nocheck

import {
  cancel,
  caretLeft,
  caretRight,
  caution,
  hide,
  highlight,
  note,
  show,
  fileCode,
  fileCodeFilled,
} from '@hypothesis/frontend-shared/lib/icons';

// Different variant than shared icon
import annotateIcon from '../images/icons/annotate.svg';
// Not in shared icon set
import pointerIcon from '../images/icons/pointer.svg';

/**
 * Set of icons used by the annotator part of the application via the `Icon`
 * component.
 */
export const annotatorIcons = {
  annotate: annotateIcon,
  cancel,
  caution,
  'caret-left': caretLeft,
  'caret-right': caretRight,
  'file-code': fileCode,
  'file-code-filled': fileCodeFilled,
  hide,
  highlight,
  note,
  pointer: pointerIcon,
  show,
};
