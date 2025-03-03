import React from 'react';
import { Text, Popover } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { localize } from '@deriv/translations';
import TradigPlatformIconProps from '../../Assets/svgs/trading-platform';
import { TCompareAccountsCard } from 'Components/props.types';
import { getAccountCardTitle, getMarketType, getAccountIcon } from '../../Helpers/compare-accounts-config';

const CFDCompareAccountsTitleIcon = ({ trading_platforms, is_eu_user, is_demo }: TCompareAccountsCard) => {
    const market_type = !is_eu_user ? getMarketType(trading_platforms) : 'CFDs';
    const market_type_shortcode = market_type.concat('_', trading_platforms.shortcode);
    const jurisdiction_card_icon =
        trading_platforms.platform === 'dxtrade' || trading_platforms.platform === 'ctrader'
            ? getAccountIcon(trading_platforms.platform)
            : getAccountIcon(market_type);
    const jurisdiction_card_title =
        trading_platforms.platform === 'dxtrade' || trading_platforms.platform === 'ctrader'
            ? getAccountCardTitle(trading_platforms.platform, is_demo)
            : getAccountCardTitle(market_type_shortcode, is_demo);
    const labuan_jurisdiction_message = localize(
        'Choosing this jurisdiction will give you a Financial STP account. Your trades will go directly to the market and have tighter spreads.'
    );

    return (
        <React.Fragment>
            <div className={'compare-cfd-account-icon-title'}>
                <TradigPlatformIconProps icon={jurisdiction_card_icon} size={48} />
                <div className='compare-cfd-account-icon-title__separator'>
                    <Text as='h1' weight='bold' size='xs' align='center'>
                        {jurisdiction_card_title}
                    </Text>
                    {market_type_shortcode === 'financial_labuan' && (
                        <Popover
                            alignment='bottom'
                            className='compare-cfd-account-labuan-tooltip'
                            classNameBubble='compare-cfd-account-labuan-tooltip--msg'
                            icon='info'
                            disable_message_icon
                            is_bubble_hover_enabled
                            message={labuan_jurisdiction_message}
                            zIndex={9999}
                        />
                    )}
                </div>
            </div>
            <hr className='compare-cfd-account-underline' />
        </React.Fragment>
    );
};

export default CFDCompareAccountsTitleIcon;
