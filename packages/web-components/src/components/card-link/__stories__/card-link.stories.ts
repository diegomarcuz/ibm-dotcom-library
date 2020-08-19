/**
 * @license
 *
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { boolean } from '@storybook/addon-knobs';
import { html } from 'lit-element';
import ArrowRight20 from 'carbon-web-components/es/icons/arrow--right/20';
import Error20 from 'carbon-web-components/es/icons/error/20';
import ifNonNull from 'carbon-web-components/es/globals/directives/if-non-null';
import readme from './README.stories.mdx';
import textNullable from '../../../../.storybook/knob-text-nullable';
import '../card-link';

export const Default = ({ parameters }) => {
  const { disabled, href } = parameters?.props?.CardLink ?? {};
  return html`
    <dds-card-link ?disabled=${disabled} href=${ifNonNull(href || undefined)}>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
      ${disabled ? Error20({ slot: 'footer' }) : ArrowRight20({ slot: 'footer' })}
    </dds-card-link>
  `;
};

export default {
  title: 'Components/Card Link',
  decorators: [
    story => html`
      <div class="bx--grid bx--grid--condensed">
        <div class="bx--row">
          <div class="bx--col-lg-9">
            ${story()}
          </div>
        </div>
      </div>
    `,
  ],
  parameters: {
    ...readme.parameters,
    knobs: {
      CardLink: ({ groupId }) => ({
        disabled: boolean('Disabled (disabled):', false, groupId),
        href: textNullable('Card Href (href):', 'https://example.com', groupId),
      }),
    },
  },
};
