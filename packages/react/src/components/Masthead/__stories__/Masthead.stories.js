import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, select, boolean, text } from '@storybook/addon-knobs';
import Masthead from '../Masthead';
import mastheadKnobs from './data/Masthead.stories.knobs.js';
import readme from '../README.md';
import '../../../../../styles/scss/components/masthead/index.scss';
import { MASTHEAD_L1 } from '../../../internal/FeatureFlags';

storiesOf('Masthead', module)
  .addDecorator(withKnobs)
  .addParameters({
    readme: {
      sidebar: readme,
    },
  })
  .add('Default', () => {
    const standardProps = {
      navigation: select(
        'Navigation',
        mastheadKnobs.navigation,
        mastheadKnobs.navigation.default
      ),
      platform: select(
        'Platform name',
        mastheadKnobs.platform,
        mastheadKnobs.platform.none
      ),
      hasProfile: boolean('Has profile', true),
      hasSearch: boolean('Has search', true),
    };
    const mastheadL1Props = MASTHEAD_L1 && {
      title: text('Title', 'Stock Charts'),
      eyebrowText: text('Eyebrow text', 'Eyebrow'),
      eyebrowLink: text('Eyebrow link', '#'),
    };
    return (
      <Masthead
        {...standardProps}
        {...mastheadL1Props}
        placeHolderText={text('Search placeholder', 'Search all of IBM')}
      />
    );
  })
  .add('Search open by default', () => {
    const standardProps = {
      navigation: select(
        'Navigation',
        mastheadKnobs.navigation,
        mastheadKnobs.navigation.default
      ),
      platform: select(
        'Platform name',
        mastheadKnobs.platform,
        mastheadKnobs.platform.none
      ),
      hasProfile: boolean('Has profile', true),
      hasSearch: boolean('Has search', true),
    };
    const mastheadL1Props = MASTHEAD_L1 && {
      title: text('Title', 'Stock Charts'),
      eyebrowText: text('Eyebrow text', 'Eyebrow'),
      eyebrowLink: text('Eyebrow link', '#'),
    };
    return (
      <Masthead
        {...standardProps}
        {...mastheadL1Props}
        searchOpenOnload={true}
        placeHolderText={text('Search placeholder', 'Search all of IBM')}
      />
    );
  });
