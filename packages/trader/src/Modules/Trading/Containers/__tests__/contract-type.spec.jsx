import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import TraderProviders from '../../../../trader-providers';
import Contract from '../contract-type';

const default_mock_store = {
    modules: {
        trade: {
            is_equal: 0,
            contract_type: 'even_odd',
            contract_types_list: {},
            is_mobile_digit_view_selected: false,
            onChange: jest.fn(),
            symbol: '1HZ100V',
        },
    },
};

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: () => true,
}));
jest.mock('../../Components/Form/ContractType', () =>
    jest.fn(props => <div data-test={props.languageChanged}>ContractTypeWidget component</div>)
);
jest.mock('../toast-popup', () => ({
    ...jest.requireActual('../toast-popup'),
    ToastPopup: () => <div>ToastPopup component</div>,
}));
jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    usePrevious: () => 'EN',
}));

describe('<Contract />', () => {
    const mockContract = mocked_store => {
        return (
            <TraderProviders store={mocked_store}>
                <Contract />
            </TraderProviders>
        );
    };

    it('should render component', () => {
        const mock_root_store = mockStore(default_mock_store);
        render(mockContract(mock_root_store));

        expect(screen.getByText(/ToastPopup/i)).toBeInTheDocument();
        expect(screen.getByText(/ContractTypeWidget/i)).toBeInTheDocument();
    });
    it('should not render <ToastPopup /> inside of parent component if contract type is not digit', () => {
        const new_mock_store = { ...default_mock_store };
        new_mock_store.modules.trade.contract_type = 'test';
        const mock_root_store = mockStore(new_mock_store);
        render(mockContract(mock_root_store));

        expect(screen.queryByText(/ToastPopup/i)).not.toBeInTheDocument();
        expect(screen.getByText(/ContractTypeWidget/i)).toBeInTheDocument();
    });
    it('if user changed the lanuage, ContractTypeWidget component should receive true in languageChanged props', () => {
        const new_mock_store = { ...default_mock_store };
        new_mock_store.common = { current_language: 'RU' };
        const mock_root_store = mockStore(new_mock_store);
        render(mockContract(mock_root_store));

        expect(screen.queryByText(/ContractTypeWidget/i)).toHaveAttribute('data-test', 'true');
    });
});
