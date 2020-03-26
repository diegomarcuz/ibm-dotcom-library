/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  ArrowDown20,
  ArrowRight20,
  Launch20,
  PlayOutline20,
} from '@carbon/icons-react';
import React, { useState, useEffect } from 'react';
import { ButtonGroup } from '../../patterns/sub-patterns/ButtonGroup';
import { Card } from '../../patterns/sub-patterns/Card';
import { FeatureCard } from '../../patterns/blocks/FeatureCard';
import { LightboxMediaViewer } from '../LightboxMediaViewer';
import { LinkWithIcon } from '../LinkWithIcon';
import PropTypes from 'prop-types';
import { settings } from 'carbon-components';
import { smoothScroll } from '@carbon/ibmdotcom-utilities';
import { VideoPlayerAPI } from '@carbon/ibmdotcom-services';

const { prefix } = settings;

/**
 * CTA component
 *
 * @param {object} props props object
 * @param {string} props.style cta style ( text | card | button | feature ).
 * @param {string} props.type cta type ( jump | local | external ).
 * @param {string} props.customClassName custom classname from parent
 * @returns {*} CTA component
 */
const CTA = ({ style, type, customClassName, ...otherProps }) => {
  const [renderLightBox, openLightBox] = useState(false);
  const [videoDuration, setVideoDuration] = useState('');

  useEffect(() => {
    (async () => {
      if (type === 'video') {
        const videoId = getVideoId(style, otherProps);
        const videoData = await VideoPlayerAPI.api(videoId);
        setVideoDuration(VideoPlayerAPI.getVideoDuration(videoData.msDuration));
      }
    })();
  }, [otherProps, style, type]);

  return (
    <div className={customClassName}>
      {renderCTA({
        style,
        type,
        renderLightBox,
        openLightBox,
        videoDuration,
        ...otherProps,
      })}
    </div>
  );
};

/**
 * renders CTA component
 *
 * @param {object} props props object
 * @param {string} props.style cta style ( text | card | button | feature ).
 * @param {string} props.type cta type ( jump | local | external ).
 * @returns {*} CTA Component
 */
const renderCTA = ({
  style,
  type,
  renderLightBox,
  openLightBox,
  videoDuration,
  ...otherProps
}) => {
  switch (style) {
    case 'card':
      return type === 'video' ? (
        <div>
          {launchLightBox(renderLightBox, openLightBox, otherProps.media)}
          {!renderLightBox && (
            <Card
              customClassName={`${prefix}--card__CTA`}
              cta={{
                href: '#',
                icon: {
                  src: _iconSelector(type),
                },
              }}
              copy={`${otherProps.copy} ${videoDuration}`}
              type="link"
              handleClick={() => openLightBox(true)}
            />
          )}
        </div>
      ) : (
        <Card
          customClassName={`${prefix}--card__CTA`}
          cta={{
            href: otherProps.cta.href,
            icon: {
              src: _iconSelector(type),
            },
          }}
          copy={otherProps.copy}
          type="link"
          target={_external(type)}
          handleClick={e => _jump(e, type)}
        />
      );
    case 'button':
      return type === 'video' ? (
        <div>
          {launchLightBox(renderLightBox, openLightBox, otherProps.media)}
          {!renderLightBox && (
            <ButtonGroup
              buttons={_renderButtons({ ...otherProps, openLightBox })}
            />
          )}
        </div>
      ) : (
        <ButtonGroup buttons={_renderButtons(otherProps)} />
      );
    case 'feature':
      console.log('otherProps', otherProps);
      return type === 'video' ? (
        <div>
          {launchLightBox(
            renderLightBox,
            openLightBox,
            otherProps.card.cta.media
          )}
          {!renderLightBox && (
            <FeatureCard
              heading={otherProps.heading}
              card={_renderFeatureCard({
                ...otherProps.card,
                heading: `${otherProps.card.heading} ${videoDuration}`,
              })}
              onClick={() => openLightBox(true)}
            />
          )}
        </div>
      ) : (
        <FeatureCard
          heading={otherProps.heading}
          card={_renderFeatureCard(otherProps.card)}
        />
      );
    default: {
      const Icon = _iconSelector(type);
      const href =
        type !== 'video'
          ? otherProps.href
            ? otherProps.href
            : otherProps.cta.href
          : null;
      return type === 'video' ? (
        <div>
          {launchLightBox(renderLightBox, openLightBox, otherProps.media)}
          {!renderLightBox && (
            <LinkWithIcon href="#" onClick={() => openLightBox(true)}>
              {`${otherProps.copy} ${videoDuration}`}
              <Icon />
            </LinkWithIcon>
          )}
        </div>
      ) : (
        <LinkWithIcon
          href={href}
          target={_external(type)}
          onClick={e => _jump(e, type)}>
          {otherProps.copy}
          <Icon />
        </LinkWithIcon>
      );
    }
  }
};

/**
 * Opens the LightBoxMediaViewer component when CTA is clicked
 *
 * @param {boolean} renderLightBox determine whether to render the lightbox
 * @param {Function} openLightBox func to toggle the lightbox
 * @param {object} media media object to render within the lightbox
 * @private
 * @returns {*} lightbox component
 */
const launchLightBox = (renderLightBox, openLightBox, media) => {
  return (
    renderLightBox && (
      <LightboxMediaViewer
        media={media}
        open={true}
        onClose={() => openLightBox(false)}
      />
    )
  );
};

/**
 * extract video id from props
 *
 * @param {string} style cta type ( external | jump | local)
 * @param {object} otherProps cta type ( external | jump | local)
 * @private
 * @returns {*} behaviour object
 */
const getVideoId = (style, otherProps) => {
  switch (style) {
    case 'text':
      return otherProps.media.src;
    case 'card':
      return otherProps.media.src;
    case 'feature':
      return otherProps.card.cta.media.src;
    case 'button':
    default:
  }
};

/**
 * jump to target element  onClick
 *
 * @param {*} e event object
 * @param {string} type cta type ( external | jump | local)
 * @private
 * @returns {*} behaviour object
 */
const _jump = (e, type) => (type === 'jump' ? smoothScroll(e) : null);

/**
 * sets target
 *
 * @param {string} type cta type ( external | jump | local)
 * @private
 * @returns {string} target value
 */
const _external = type => (type === 'external' ? '_blank' : null);

/**
 * sets icon based on link type
 *
 * @param {string} type cta type ( external | jump | local)
 * @private
 * @returns {*} cta type component
 */
const _iconSelector = type => {
  switch (type) {
    case 'external':
      return Launch20;
    case 'jump':
      return ArrowDown20;
    case 'video':
      return PlayOutline20;
    default:
      return ArrowRight20;
  }
};
/**
 * sets button
 *
 * @param {object} param param object
 * @param {object} param.buttons object with buttons array
 * @param {string} param.type type of CTA
 * @param {Function} param.openLightBox func to set renderLightBox state
 * @private
 * @returns {*} object
 */
const _renderButtons = ({ buttons, type, openLightBox }) =>
  buttons.map(button => {
    button.renderIcon = _iconSelector(button.type);
    if (type === 'video') {
      button.onClick = () => openLightBox(true);
      button.href = '#';
    } else {
      button.onClick = e => _jump(e, button.type);
      button.target = _external(button.type);
    }
    return button;
  });

/**
 * sets featureCard
 *
 * @param {object} featureCard object with card object
 * @private
 * @returns {*} object
 */
const _renderFeatureCard = featureCard => {
  featureCard.icon = _iconSelector(featureCard.type);
  featureCard.handleClick = e => _jump(e, featureCard.type);
  featureCard.target = _external(featureCard.type);
  featureCard.type = 'link';
  return featureCard;
};

CTA.propTypes = {
  style: PropTypes.string,
  type: PropTypes.string,
  customClassName: PropTypes.string,
};

export default CTA;
