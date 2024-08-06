/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { MediaDescription } from './MediaDescription';
import type { MediaRenameOrigin } from './MediaRenameOrigin';

export type RenamedMediaOptions = {
    origin?: MediaRenameOrigin;
    mediaDescriptions?: Array<MediaDescription>;
};

