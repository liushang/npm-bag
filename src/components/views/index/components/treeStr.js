export default {
  props: [ 'data' ],
  mounted() {
    setTimeout(() => {
      console.log(this.data)
    }, 400)
  },
  methods: {
    getTreeNode(data, parentIndex) {
      let { name, props, children } = data
      if (['oContainer', 'oRow'].includes(name)) {
        children = props.children
      }
      return children.map((x, xndex) => {
        if (x && x.name) {
          return (<a-tree-node key={parentIndex + '-' + xndex} onSelect={() => this.setNewNode(data, parentIndex, xndex)} >
              <a-popover slot="title" placement="right">
                <template slot="content">
                  <p>{(x.renderFun || x.props.renderFun).toString()}</p>
                </template>
                <span style="color: #1890ff">
                  {x.props && (x.props.rawId || x.props.subRawId) || ''}
                </span>
              </a-popover>
          {this.getTreeNode(x, parentIndex + '-' + xndex)}
        </a-tree-node>)
        } else {
          console.log(x)
          return <a-tree-node key={parentIndex + '-' + xndex} title={x}>
        </a-tree-node>
        }
      })
    },
    setNewNode(e) {
      console.log(e)
      if (!e[0]) return
      const nodeArr = e[0].split('-')
      nodeArr.shift()
      const list = [this.data]
      let remainData = this.data
      for (let i = 0;i < nodeArr.length;i++) {
        if (remainData.name && ['oContainer', 'oRow'].includes(remainData.name)) {
          remainData = remainData.props.children[nodeArr[i]]
        } else {
          remainData = remainData.children[nodeArr[i]]
        }
        remainData.name && list.push(remainData)
      }
      this.$emit('changeNode', list)
      console.log(list)
    }
  },
  render() {
    const data = this.data;
    return (
    <a-tree defaultExpandAll={true} onSelect={e => this.setNewNode(e)}>
      <a-icon slot="switcherIcon" type="down" />
      {this.getTreeNode(data, '0')}
    </a-tree>)
  }
}