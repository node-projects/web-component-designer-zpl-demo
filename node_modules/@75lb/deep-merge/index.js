import assignWith from 'lodash.assignwith'
import { isPlainObject, isDefined } from 'typical'

function customiser (previousValue, newValue, key, object, source) {
  /* deep merge plain objects */
  if (isPlainObject(previousValue) && isPlainObject(newValue)) {
    return assignWith(previousValue, newValue, customiser)
    /* overwrite arrays if the new array has items */
  } else if (Array.isArray(previousValue) && Array.isArray(newValue) && newValue.length) {
    return newValue
    /* ignore incoming arrays if empty */
  } else if (Array.isArray(newValue) && !newValue.length) {
    return previousValue
  } else if (!isDefined(previousValue) && Array.isArray(newValue)) {
    return newValue
  }
}

function deepMerge (...args) {
  return assignWith(...args, customiser)
}

export default deepMerge
