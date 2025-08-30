import PinInputRoot from './pin-input-root.svelte';
import PinInputCell from './pin-input-cell.svelte';

// Re-export useful constants from bits-ui
export { REGEXP_ONLY_DIGITS } from 'bits-ui';

// Re-export types that might be useful
export type { PinInputRootSnippetProps } from 'bits-ui';

export { PinInputRoot as Root, PinInputCell as Cell };
