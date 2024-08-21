import { defineFunction } from '@aws-amplify/backend';

export const sayHello = defineFunction({
  environment: {
    NAME: 'World'
  }
});