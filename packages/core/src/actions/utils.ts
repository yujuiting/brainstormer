import * as rtk from '@reduxjs/toolkit';

export function createAction<Type extends string>(type: Type) {
  return <Payload = void>() => rtk.createAction<Payload, Type>(type);
}
