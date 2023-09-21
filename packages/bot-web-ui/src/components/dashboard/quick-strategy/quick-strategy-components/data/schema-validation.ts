import * as Yup from 'yup';
import { localize } from '@deriv/translations';
import { OPERATORS } from 'Constants/quick-strategies-validation';
import { TDataFields, TInitialValues } from '../../quick-strategy.types';

export const setDefaultValidationNumber = () =>
    Yup.number()
        .typeError(localize('Must be a number'))
        .round('ceil')
        .min(1, localize('Must be a number higher than 0'));

export const CommonSchemaFields = (min: number, max: number) =>
    Yup.object().shape({
        duration: Yup.number()
            .typeError(localize('Must be a number'))
            .required(localize('Field cannot be empty'))
            .min(min, localize('Minimum duration: {{ min }}', { min }))
            .max(max, localize('Maximum duration: {{ max }}', { max })),
        stake: setDefaultValidationNumber(),
        loss: setDefaultValidationNumber(),
        profit: setDefaultValidationNumber(),
    });

export const OscarsGrindSchemaFields = Yup.object().shape({
    oscar_unit: setDefaultValidationNumber(),
});

export const MartingaleSchemaFields = Yup.object().shape({
    size: Yup.number()
        .typeError(localize('Must be a number'))
        .round('floor')
        .min(2, localize('The value must be equal to or greater than 2.')),
});

export const DAlembertSchemaFields = Yup.object().shape({
    alembert_uni: setDefaultValidationNumber(),
});

const execute_operations = <T>({ operator, op1, op2 }: { operator: keyof typeof OPERATORS; op1: T; op2: T }) => {
    switch (operator) {
        case OPERATORS.EQUAL:
            return op1 == op2;
        case OPERATORS.NOT_EQUAL:
            return op1 !== op2;
        case OPERATORS.GREATER_THAN:
            return op1 > op2;
        case OPERATORS.GREATER_THAN_OR_EQUAL:
            return op1 >= op2;
        case OPERATORS.LESS_THAN:
            return op1 < op2;
        case OPERATORS.LESS_THAN_OR_EQUAL:
            return op1 <= op2;
        default:
            return false;
    }
};

export const handleConditionsOfInput = (conditions: TDataFields['conditions'], current_form_data: TInitialValues) => {
    if (conditions?.length) {
        const condition = conditions?.every(element => {
            const { name, value, operator } = element;
            const op1 = `${current_form_data?.[name]}`;
            const op2 = value;
            const result = execute_operations({ operator, op1, op2 });
            return result;
        });
        if (condition) return true;
    }
    return false;
};

export const mergeSchema = (first: ReturnType<typeof CommonSchemaFields>, ...rest: Yup.AnyObjectSchema[]) => {
    const merged = rest.reduce((mergedSchemas, schema) => (mergedSchemas as any).concat(schema as any), first);

    return merged;
};
