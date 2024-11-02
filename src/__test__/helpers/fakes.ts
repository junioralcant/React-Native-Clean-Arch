import {faker} from '@faker-js/faker';

export const anyString = () => faker.number.int({max: 999999999}).toString();
