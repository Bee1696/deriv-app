import { Field, FormikValues, useFormikContext } from 'formik';
import React from 'react';
import { DesktopWrapper, MobileWrapper, Dropdown, SelectNative } from '@deriv/components';
import { localize } from '@deriv/translations';
import {
    getAccountTurnoverList,
    getEducationLevelList,
    getEmploymentIndustryList,
    getEstimatedWorthList,
    getIncomeSourceList,
    getNetIncomeList,
    getOccupationList,
    getSourceOfWealthList,
} from 'Configs/financial-details-config';

type TFinancialDetailsDropdownFieldProps = {
    dropdown_list: Array<object>;
    field_key: string;
    placeholder?: string;
    label: string;
};

/**
 * Dropdown field for financial details form.
 * @name FinancialDetailsDropdownField
 * @param {Array<object>} dropdown_list - list of dropdown items
 * @param {string} field_key - field reference of the field
 * @param {string} placeholder - placeholder of the field
 * @param {string} label - label of the field
 * @returns {JSX.Element}
 */
const FinancialDetailsDropdownField = ({
    dropdown_list,
    field_key,
    placeholder = localize('Please select'),
    label,
}: TFinancialDetailsDropdownFieldProps) => {
    const { values, handleChange, handleBlur, touched, errors, setFieldValue } = useFormikContext<{
        [key: string]: string;
    }>();

    return (
        <Field name={field_key}>
            {({ field }: FormikValues) => (
                <React.Fragment>
                    <DesktopWrapper>
                        <Dropdown
                            placeholder={label}
                            is_align_text_left
                            name={field.name}
                            list={dropdown_list}
                            value={values[field_key]}
                            onChange={handleChange}
                            handleBlur={handleBlur}
                            error={touched?.[field_key] && errors?.[field_key]}
                            list_portal_id='modal_root'
                            {...field}
                            required
                        />
                    </DesktopWrapper>
                    <MobileWrapper>
                        <SelectNative
                            placeholder={placeholder}
                            name={field.name}
                            label={label}
                            list_items={dropdown_list}
                            value={values?.[field_key]}
                            error={touched?.[field_key] && errors?.[field_key]}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                handleChange(e);
                                setFieldValue('field_key', e.target.value, true);
                            }}
                            {...field}
                            required
                        />
                    </MobileWrapper>
                </React.Fragment>
            )}
        </Field>
    );
};

/**
 * Wrapper for financial details form fields.
 * @name FinancialInformation
 * @returns {JSX.Element}
 */
const FinancialInformation = () => {
    return (
        <React.Fragment>
            <FinancialDetailsDropdownField
                dropdown_list={getIncomeSourceList()}
                field_key='income_source'
                label={localize('Source of income')}
            />
            <FinancialDetailsDropdownField
                dropdown_list={getEmploymentIndustryList()}
                field_key='employment_industry'
                label={localize('Industry of employment')}
            />
            <FinancialDetailsDropdownField
                dropdown_list={getOccupationList()}
                field_key='occupation'
                label={localize('Occupation')}
            />
            <FinancialDetailsDropdownField
                dropdown_list={getSourceOfWealthList()}
                field_key='source_of_wealth'
                label={localize('Source of wealth')}
            />
            <FinancialDetailsDropdownField
                dropdown_list={getEducationLevelList()}
                field_key='education_level'
                label={localize('Level of education')}
            />
            <FinancialDetailsDropdownField
                dropdown_list={getNetIncomeList()}
                field_key='net_income'
                label={localize('Net annual income')}
            />
            <FinancialDetailsDropdownField
                dropdown_list={getEstimatedWorthList()}
                field_key='estimated_worth'
                label={localize('Estimated net worth')}
            />
            <FinancialDetailsDropdownField
                dropdown_list={getAccountTurnoverList()}
                field_key='account_turnover'
                label={localize('Anticipated annual turnover')}
            />
        </React.Fragment>
    );
};

export default FinancialInformation;
