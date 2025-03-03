import React from 'react';
import classNames from 'classnames';
import { Formik, Field, FormikErrors, FormikValues, FormikHelpers } from 'formik';
import { Autocomplete, Button, DesktopWrapper, HintBox, MobileWrapper, Text, SelectNative } from '@deriv/components';
import { idv_error_statuses, isMobile, TIDVErrorStatus } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import FormFooter from 'Components/form-footer';

type TCountry = Record<string, string>;

type TCountrySelector = {
    handleSelectionNext: () => void;
    is_from_external: boolean;
    mismatch_status?: TIDVErrorStatus;
    residence_list: TCountry[];
    selected_country: string;
    setSelectedCountry: (value: TCountry) => void;
};

const CountrySelector = ({
    handleSelectionNext,
    is_from_external,
    mismatch_status,
    residence_list,
    selected_country,
    setSelectedCountry,
}: TCountrySelector) => {
    const [country_list, setCountryList] = React.useState<TCountry[]>([]);

    const initial_form_values: FormikValues = {
        country_input: '',
    };

    const validateFields = (values: FormikValues) => {
        const errors: FormikErrors<FormikValues> = {};
        const { country_input } = values;

        if (!country_input) {
            errors.country_input = localize('Please select the country of document issuance.');
        } else if (!country_list.find((c: FormikValues) => c.text === country_input)) {
            errors.country_input = localize('Please select a valid country of document issuance.');
        }

        return errors;
    };

    const updateSelectedCountry = (country_name: string) => {
        const matching_country: TCountry | undefined = country_list.find((c: FormikValues) => c.text === country_name);
        if (matching_country) {
            setSelectedCountry?.(matching_country);
        }
    };

    const submitHandler = (values: FormikValues, { setSubmitting }: FormikHelpers<FormikValues>) => {
        updateSelectedCountry(values.country_input);
        setSubmitting(false);
        handleSelectionNext?.();
    };

    React.useEffect(() => {
        setCountryList(residence_list);
    }, [residence_list]);

    let failed_message: JSX.Element | null = null;
    if (mismatch_status === idv_error_statuses.poi_expired) {
        failed_message = <Localize i18n_default_text='Your identity document has expired.' />;
    }
    if (mismatch_status === idv_error_statuses.poi_failed) {
        failed_message = (
            <Localize i18n_default_text='We were unable to verify the identity document with the details provided.' />
        );
    }

    return (
        <Formik initialValues={initial_form_values} validate={validateFields} onSubmit={submitHandler}>
            {({
                dirty,
                errors,
                handleBlur,
                handleChange,
                handleSubmit,
                isSubmitting,
                isValid,
                setFieldValue,
                touched,
                values,
            }) => (
                <React.Fragment>
                    <div
                        className={classNames('proof-of-identity__container', {
                            'min-height': !is_from_external,
                        })}
                    >
                        {failed_message ? (
                            <React.Fragment>
                                <Text className='' align='center' weight='bold' size={isMobile() ? 'xs' : 's'}>
                                    <Localize i18n_default_text='Your identity verification failed because:' />
                                </Text>
                                <HintBox
                                    className={classNames('proof-of-identity__failed-message', 'hint-box-layout')}
                                    icon='IcAlertDanger'
                                    message={
                                        <Text as='p' size={isMobile() ? 'xxs' : 'xs'}>
                                            {failed_message}
                                        </Text>
                                    }
                                    is_danger
                                />
                            </React.Fragment>
                        ) : (
                            <Text className='proof-of-identity__header' align='center' weight='bold'>
                                <Localize i18n_default_text='Proof of identity' />
                            </Text>
                        )}

                        <Text className='proof-of-identity__country-text ' size='xs'>
                            <Localize i18n_default_text='In which country was your document issued?' />
                        </Text>
                        <fieldset className='proof-of-identity__fieldset'>
                            <Field name='country_input'>
                                {({ field }: FormikValues) => (
                                    <React.Fragment>
                                        <DesktopWrapper>
                                            <Autocomplete
                                                className={classNames({ 'external-dropdown': is_from_external })}
                                                {...field}
                                                data_testid='dt_external_dropdown'
                                                name='country_input'
                                                data-lpignore='true'
                                                error={touched.country_input && errors.country_input}
                                                autoComplete='off'
                                                type='text'
                                                label={localize('Country')}
                                                list_items={country_list}
                                                value={values.country_input}
                                                onBlur={(e: FormikValues) => {
                                                    handleBlur(e);
                                                    const current_input = e.target.value;
                                                    if (
                                                        !country_list.find(
                                                            (c: FormikValues) => c.text === current_input
                                                        )
                                                    ) {
                                                        setFieldValue('country_input', '', true);
                                                        updateSelectedCountry('');
                                                    }
                                                }}
                                                onChange={handleChange}
                                                onItemSelection={({ text }: FormikValues) => {
                                                    const select_value =
                                                        text === 'No results found' || !text ? '' : text;
                                                    setFieldValue('country_input', select_value, true);
                                                    updateSelectedCountry(text);
                                                }}
                                                required
                                            />
                                        </DesktopWrapper>
                                        <MobileWrapper>
                                            <div className='proof-of-identity__dropdown-container'>
                                                <SelectNative
                                                    {...field}
                                                    name='country_input'
                                                    error={touched.country_input && errors.country_input}
                                                    label={localize('Country')}
                                                    placeholder={localize('Please select')}
                                                    list_items={country_list}
                                                    value={values.country_input}
                                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                                        handleChange(e);
                                                        updateSelectedCountry(e.target.value);
                                                    }}
                                                    use_text={true}
                                                    required
                                                />
                                            </div>
                                        </MobileWrapper>
                                    </React.Fragment>
                                )}
                            </Field>
                        </fieldset>
                    </div>
                    <FormFooter
                        className={classNames('proof-of-identity__footer', { 'external-footer': is_from_external })}
                    >
                        <Button
                            className='proof-of-identity__submit-button'
                            type='submit'
                            onClick={() => handleSubmit()}
                            has_effect
                            is_disabled={!dirty || isSubmitting || !isValid || !selected_country}
                            is_loading={false}
                            text={localize('Next')}
                            large
                            primary
                        />
                    </FormFooter>
                </React.Fragment>
            )}
        </Formik>
    );
};

export default CountrySelector;
