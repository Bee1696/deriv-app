import { getTotalProfit } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { getBuyPrice } from 'Utils/multiplier';

export const getSupportedContracts = is_high_low => ({
    ASIANU: {
        name: localize('Asian Up'),
        position: 'top',
    },
    ASIAND: {
        name: localize('Asian Down'),
        position: 'bottom',
    },
    CALL: {
        name: is_high_low ? localize('Higher') : localize('Rise'),
        position: 'top',
    },
    PUT: {
        name: is_high_low ? localize('Lower') : localize('Fall'),
        position: 'bottom',
    },
    CALLE: {
        name: localize('Rise'),
        position: 'top',
    },
    PUTE: {
        name: localize('Fall'),
        position: 'bottom',
    },
    CALLSPREAD: {
        name: localize('Spread Up'),
        position: 'top',
    },
    PUTSPREAD: {
        name: localize('Spread Down'),
        position: 'bottom',
    },
    DIGITMATCH: {
        name: localize('Matches'),
        position: 'top',
    },
    DIGITDIFF: {
        name: localize('Differs'),
        position: 'bottom',
    },
    DIGITEVEN: {
        name: localize('Even'),
        position: 'top',
    },
    DIGITODD: {
        name: localize('Odd'),
        position: 'bottom',
    },
    DIGITOVER: {
        name: localize('Over'),
        position: 'top',
    },
    DIGITUNDER: {
        name: localize('Under'),
        position: 'bottom',
    },
    EXPIRYMISS: {
        name: localize('Ends Outside'),
        position: 'top',
    },
    EXPIRYRANGE: {
        name: localize('Ends Between'),
        position: 'bottom',
    },
    LBFLOATCALL: {
        name: localize('Close-to-Low'),
        position: 'top',
    },
    LBFLOATPUT: {
        name: localize('High-to-Close'),
        position: 'top',
    },
    LBHIGHLOW: {
        name: localize('High-to-Low'),
        position: 'top',
    },
    MULTUP: {
        name: localize('Up'),
        position: 'top',
    },
    MULTDOWN: {
        name: localize('Down'),
        position: 'bottom',
    },
    ONETOUCH: {
        name: localize('Touch'),
        position: 'top',
    },
    NOTOUCH: {
        name: localize('No Touch'),
        position: 'bottom',
    },
    RANGE: {
        name: localize('Stays Between'),
        position: 'top',
    },
    UPORDOWN: {
        name: localize('Goes Outside'),
        position: 'bottom',
    },
    RESETCALL: {
        name: localize('Reset Call'),
        position: 'top',
    },
    RESETPUT: {
        name: localize('Reset Put'),
        position: 'bottom',
    },
    RUNHIGH: {
        name: localize('Only Ups'),
        position: 'top',
    },
    RUNLOW: {
        name: localize('Only Downs'),
        position: 'bottom',
    },
    TICKHIGH: {
        name: localize('High Tick'),
        position: 'top',
    },
    TICKLOW: {
        name: localize('Low Tick'),
        position: 'bottom',
    },
});

export const getContractConfig = is_high_low => ({
    ...getSupportedContracts(is_high_low),
});

export const getContractTypeDisplay = (type, is_high_low = false) =>
    getContractConfig(is_high_low)[type] ? getContractConfig(is_high_low)[type.toUpperCase()].name : '';

export const getValidationRules = () => ({
    has_contract_update_stop_loss: {
        trigger: 'contract_update_stop_loss',
    },
    contract_update_stop_loss: {
        rules: [
            [
                'req',
                {
                    condition: contract_store => !contract_store.contract_update_stop_loss,
                    message: localize('Please enter a stop loss amount.'),
                },
            ],
            [
                'custom',
                {
                    func: (value, options, contract_store) => {
                        const profit = getTotalProfit(contract_store.contract_info);
                        return !(profit < 0 && -value > profit);
                    },
                    message: localize("Please enter a stop loss amount that's higher than the current potential loss."),
                },
            ],
            [
                'custom',
                {
                    func: (value, options, contract_store) => {
                        const stake = getBuyPrice(contract_store);
                        return value < stake + 1;
                    },
                    message: localize('Invalid stop loss. Stop loss cannot be more than stake.'),
                },
            ],
        ],
    },
    has_contract_update_take_profit: {
        trigger: 'contract_update_take_profit',
    },
    contract_update_take_profit: {
        rules: [
            [
                'req',
                {
                    condition: contract_store => !contract_store.contract_update_take_profit,
                    message: localize('Please enter a take profit amount.'),
                },
            ],
            [
                'custom',
                {
                    func: (value, options, contract_store) => {
                        const profit = getTotalProfit(contract_store.contract_info);
                        return !(profit > 0 && +value < profit);
                    },
                    message: localize(
                        "Please enter a take profit amount that's higher than the current potential profit."
                    ),
                },
            ],
        ],
    },
});
