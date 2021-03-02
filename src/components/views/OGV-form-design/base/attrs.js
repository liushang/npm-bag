const props = {
  styles: {
    type: Object,
    default: () => {
        return {};
    }
  },
  renderFun: {
      type: Function,
      default: x => x
  },
  rawId: {
      type: String,
      default: ''
  },
  children: {
    type: Array,
    default: () => []
  },
  data: {
    type: Object,
    default: () => {}
  },
  on: {
      type: Object,
      default: () => {}
  },
  insData: {
    type: Object,
    default: () => {}
  }
}
export default {
  props,
}