import React from 'react';
import classnames from 'classnames';
import { ThemedScrollbars } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { observer } from '@deriv/stores';
import { useDBotStore } from 'Stores/useDBotStore';
import SummaryCard from './summary-card';

type TSummary = {
    is_drawer_open: boolean;
};

const Summary = observer(({ is_drawer_open }: TSummary) => {
    const { summary_card } = useDBotStore();
    const { is_contract_loading, contract_info } = summary_card;
    const is_mobile = isMobile();
    return (
        <div
            className={classnames({
                'run-panel-tab__content': !is_mobile,
                'run-panel-tab__content--mobile': is_mobile && is_drawer_open,
                'run-panel-tab__content--summary-tab': !is_mobile && is_drawer_open,
            })}
        >
            <ThemedScrollbars
                className={classnames({
                    summary: !is_contract_loading && !contract_info,
                    'summary--loading':
                        (is_mobile && is_contract_loading) || (is_mobile && !is_contract_loading && contract_info),
                })}
            >
                <SummaryCard is_contract_loading={is_contract_loading} contract_info={contract_info} />
            </ThemedScrollbars>
        </div>
    );
});

export default Summary;
