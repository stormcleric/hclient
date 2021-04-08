import { registerIcons } from '@hypothesis/frontend-shared';
import { render } from 'preact';

import PlaygroundApp from './shared/components/PlaygroundApp';

import sidebarIcons from '../../src/sidebar/icons';
registerIcons(sidebarIcons);

const container = document.querySelector('#app');
render(<PlaygroundApp />, /** @type Element */ (container));
