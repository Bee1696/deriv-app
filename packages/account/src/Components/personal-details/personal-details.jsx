import React from 'react';
import classNames from 'classnames';
import { Form, Formik } from 'formik';

import {
    AutoHeightWrapper,
    Div100vhContainer,
    FormSubmitButton,
    Modal,
    Text,
    ThemedScrollbars,
} from '@deriv/components';
import { getIDVNotApplicableOption, isDesktop, isMobile, removeEmptyPropertiesFromObject } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';

import {
    isAdditionalDocumentValid,
    isDocumentNumberValid,
    isDocumentTypeValid,
    shouldHideHelperImage,
    shouldShowIdentityInformation,
} from 'Helpers/utils';
import PoiNameDobExample from '../../Assets/ic-poi-name-dob-example.svg';

import FormSubHeader from '../form-sub-header';
import IDVForm from '../forms/idv-form';
import PersonalDetailsForm from '../forms/personal-details-form';
import { splitValidationResultTypes } from '../real-account-signup/helpers/utils';

const PersonalDetails = ({
    getCurrentStep,
    onSave,
    onCancel,
    onSubmit,
    goToPreviousStep,
    goToNextStep,
    validate,
    salutation_list,
    disabled_items,
    is_mf,
    is_svg,
    residence_list,
    is_virtual,
    is_fully_authenticated,
    account_opening_reason_list,
    selected_step_ref,
    closeRealAccountSignup,
    has_real_account,
    ...props
}) => {
    const { account_status, account_settings, residence, real_account_signup_target } = props;
    const [should_close_tooltip, setShouldCloseTooltip] = React.useState(false);

    const PoiNameDobExampleIcon = PoiNameDobExample;

    const isSubmitDisabled = errors => {
        return selected_step_ref?.current?.isSubmitting || Object.keys(errors).length > 0;
    };

    const handleCancel = values => {
        const current_step = getCurrentStep() - 1;
        onSave(current_step, values);
        onCancel(current_step, goToPreviousStep);
    };

    //is_rendered_for_idv is used for configuring the components when they are used in idv page
    const is_rendered_for_idv = shouldShowIdentityInformation({
        account_status,
        account_settings,
        residence,
        residence_list,
        real_account_signup_target,
    });
    const IDV_NOT_APPLICABLE_OPTION = React.useMemo(() => getIDVNotApplicableOption(), []);

    const validateIDV = values => {
        const errors = {};
        const { document_type, document_number, document_additional } = values;
        if (document_type.id === IDV_NOT_APPLICABLE_OPTION.id) return errors;

        errors.document_type = isDocumentTypeValid(document_type);

        const needs_additional_document = !!document_type.additional;

        if (needs_additional_document) {
            errors.document_additional = isAdditionalDocumentValid(document_type, document_additional);
        }

        errors.document_number = isDocumentNumberValid(document_number, document_type);
        return removeEmptyPropertiesFromObject(errors);
    };

    const handleValidate = values => {
        let idv_error = {};
        if (is_rendered_for_idv) {
            idv_error = validateIDV(values);
        }
        const { errors } = splitValidationResultTypes(validate(values));
        const error_data = { ...idv_error, ...errors };
        return error_data;
    };

    const closeToolTip = () => setShouldCloseTooltip(true);

    /*
    In most modern browsers, setting autocomplete to "off" will not prevent a password manager from asking the user if they would like to save username and password information, or from automatically filling in those values in a site's login form.
    check this link https://developer.mozilla.org/en-US/docs/Web/Security/Securing_your_site/Turning_off_form_autocompletion#the_autocomplete_attribute_and_login_fields
    */
    // for dropdowns use 'none'

    const citizen = account_settings?.citizen || residence;
    const selected_country = residence_list.find(residence_data => residence_data.value === citizen) || {};

    const getEditableFields = (is_confirmed, selected_document_type_id) => {
        const editable_fields = Object.keys(props.value).filter(field => !disabled_items.includes(field)) || [];

        if (IDV_NOT_APPLICABLE_OPTION.id === selected_document_type_id) return editable_fields;

        if (is_confirmed && is_rendered_for_idv) {
            return editable_fields.filter(field => !['first_name', 'last_name', 'date_of_birth'].includes(field));
        }

        return editable_fields;
    };

    return (
        <Formik
            innerRef={selected_step_ref}
            initialValues={{ ...props.value }}
            validate={handleValidate}
            validateOnMount
            enableReinitialize
            initialStatus={{ is_confirmed: !is_rendered_for_idv }}
            onSubmit={(values, actions) => {
                onSubmit(getCurrentStep() - 1, values, actions.setSubmitting, goToNextStep);
            }}
        >
            {({ handleSubmit, errors, values, status }) => (
                <AutoHeightWrapper default_height={380} height_offset={isDesktop() ? 81 : null}>
                    {({ setRef, height }) => (
                        <Form
                            ref={setRef}
                            onSubmit={handleSubmit}
                            autoComplete='off'
                            onClick={closeToolTip}
                            data-testid='personal_details_form'
                        >
                            <Div100vhContainer className='details-form' height_offset='100px' is_disabled={isDesktop()}>
                                {!is_rendered_for_idv && (
                                    <Text as='p' size='xxxs' align='center' className='details-form__description'>
                                        <Localize
                                            i18n_default_text={
                                                'Any information you provide is confidential and will be used for verification purposes only.'
                                            }
                                        />
                                    </Text>
                                )}
                                <ThemedScrollbars
                                    height={height}
                                    onScroll={closeToolTip}
                                    testId='dt_personal_details_container'
                                >
                                    <div
                                        className={classNames('details-form__elements', 'personal-details-form')}
                                        style={{ paddingBottom: isDesktop() ? 'unset' : null }}
                                    >
                                        {is_rendered_for_idv && (
                                            <React.Fragment>
                                                <FormSubHeader title={localize('Identity verification')} />
                                                <IDVForm
                                                    selected_country={selected_country}
                                                    hide_hint={true}
                                                    can_skip_document_verification={true}
                                                />
                                                <FormSubHeader title={localize('Details')} />
                                            </React.Fragment>
                                        )}
                                        <PersonalDetailsForm
                                            class_name={classNames({
                                                'account-form__poi-confirm-example_container':
                                                    is_rendered_for_idv &&
                                                    !shouldHideHelperImage(values?.document_type?.id),
                                            })}
                                            is_virtual={is_virtual}
                                            is_svg={is_svg}
                                            is_mf={is_mf}
                                            side_note={<PoiNameDobExampleIcon />}
                                            is_rendered_for_idv={is_rendered_for_idv}
                                            editable_fields={getEditableFields(
                                                status?.is_confirmed,
                                                values?.document_type?.id
                                            )}
                                            residence_list={residence_list}
                                            has_real_account={has_real_account}
                                            is_fully_authenticated={is_fully_authenticated}
                                            closeRealAccountSignup={closeRealAccountSignup}
                                            salutation_list={salutation_list}
                                            account_opening_reason_list={account_opening_reason_list}
                                            should_close_tooltip={should_close_tooltip}
                                            setShouldCloseTooltip={setShouldCloseTooltip}
                                            should_hide_helper_image={shouldHideHelperImage(values?.document_type?.id)}
                                            inline_note_text={
                                                <Localize
                                                    i18n_default_text='To avoid delays, enter your <0>name</0> and <0>date of birth</0> exactly as they appear on your identity document.'
                                                    components={[<strong key={0} />]}
                                                />
                                            }
                                            no_confirmation_needed={
                                                values?.document_type?.id === IDV_NOT_APPLICABLE_OPTION.id
                                            }
                                        />
                                    </div>
                                </ThemedScrollbars>
                            </Div100vhContainer>
                            <Modal.Footer has_separator is_bypassed={isMobile()}>
                                <FormSubmitButton
                                    cancel_label={localize('Previous')}
                                    has_cancel
                                    is_disabled={!status?.is_confirmed || isSubmitDisabled(errors)}
                                    is_absolute={isMobile()}
                                    label={localize('Next')}
                                    onCancel={() => handleCancel(values)}
                                />
                            </Modal.Footer>
                        </Form>
                    )}
                </AutoHeightWrapper>
            )}
        </Formik>
    );
};

export default PersonalDetails;
