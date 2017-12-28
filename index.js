/*

x0,y0
   g
  dh
 bei
acfj

*/

var sample = [
  {
    id: "a",
    parent: null,
    expected: {
      x: 0,
      y: 4
    },
    measurements: {
      x: null,
      y: null,
      width: 1,
      height: 1
    }
  },
  {
    id: "b",
    parent: "a",
    expected: {
      x: 1,
      y: 3
    },
    measurements: {
      x: null,
      y: null,
      width: 1,
      height: 1
    }
  },
  {
    id: "c",
    parent: "a",
    expected: {
      x: 1,
      y: 4
    },
    measurements: {
      x: null,
      y: null,
      width: 1,
      height: 1
    }
  },
  {
    id: "d",
    parent: "b",
    expected: {
      x: 2,
      y: 2
    },
    measurements: {
      x: null,
      y: null,
      width: 1,
      height: 1
    }
  },
  {
    id: "e",
    parent: "b",
    expected: {
      x: 2,
      y: 3
    },
    measurements: {
      x: null,
      y: null,
      width: 1,
      height: 1
    }
  },
  {
    id: "f",
    parent: "c",
    expected: {
      x: 2,
      y: 4
    },
    measurements: {
      x: null,
      y: null,
      width: 1,
      height: 1
    }
  },
  {
    id: "g",
    parent: "d",
    expected: {
      x: 3,
      y: 1
    },
    measurements: {
      x: null,
      y: null,
      width: 1,
      height: 1
    }
  },
  {
    id: "h",
    parent: "d",
    expected: {
      x: 3,
      y: 2
    },
    measurements: {
      x: null,
      y: null,
      width: 1,
      height: 1
    }
  },
  {
    id: "i",
    parent: "e",
    expected: {
      x: 3,
      y: 3
    },
    measurements: {
      x: null,
      y: null,
      width: 1,
      height: 1
    }
  },
  {
    id: "j",
    parent: "f",
    expected: {
      x: 3,
      y: 4
    },
    measurements: {
      x: null,
      y: null,
      width: 1,
      height: 1
    }
  }
]


var findLeafs = tree => tree
.filter(({ id }, n, all) => !all
  .find(({parent}) => parent === id)
)

var findAncestors = (i, tree, ancestors = []) => i.parent ? 
findAncestors(tree.find(o => o.id === i.parent), tree, [...ancestors, i.id])
: ancestors

var decorateAncestors = tree => tree.map(i => ({...i, ancestors:findAncestors(i, tree) }))

var flatten = arr => arr.reduce((acc, cur) => Array.isArray(cur) ? flatten([...acc, ...cur]) : [...acc, cur], [])

var findDecendants = (i, tree, decendants = [], children =  tree.filter(o => i.id === o.parent)) =>
children.length ? children.map(child => findDecendants(child, tree, [...decendants, child.id])) : decendants

var decorateDecendants = tree => tree.map(i => ({
    ...i, 
    decendants: flatten(findDecendants(i, tree))
}))

var accumulateLeafOffsetY = (tree, leafs) => tree.map(i => {
    const decendantLeafs = leafs.filter(leaf => leaf.id === i.id || i.decendants.includes(leaf.id))
    const bottomLeaf = decendantLeafs[decendantLeafs.length-1]
    const bottomLeafIndex = bottomLeaf && leafs.findIndex(leaf => leaf.id === bottomLeaf.id)
    const leafsAbove = leafs.slice(0, bottomLeafIndex+1)

    return {
        ...i, 
        measurements: {
            ...i.measurements,
            y: leafsAbove.reduce((acc, cur) => acc + cur.measurements.height, 0)
    }}
})

var accumulateLeafOffsetX = tree => tree.map( i => ({
    ...i,
    measurements: {
        ...i.measurements,
        x: i.ancestors.length
    }
}))

var decorateLeafs = tree => accumulateLeafOffsetX(
  decorateAncestors(
    accumulateLeafOffsetY(
      decorateDecendants(tree),
      findLeafs(tree)
    )
  )
)

decorateLeafs(sample)

var validateResults = tree => tree.map(branch => 
  branch.expected.x === branch.measurements.x &&
  branch.expected.y === branch.measurements.y)


validateResults(decorateLeafs(sample))
