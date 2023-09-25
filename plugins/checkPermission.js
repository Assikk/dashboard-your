import { state } from '../store/index'
function checkPermission(name) {
  for (let i = 0; i < state().permissions.length; i++) {
    if (state().permissions[i].name === name) {
      return true;
    }
  }
  return false;
}
export default checkPermission
