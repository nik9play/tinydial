<script>
import { quintOut } from "svelte/easing"
import { crossfade } from "svelte/transition"
import { flip } from "svelte/animate"

// FLIP ANIMATION
const [send, receive] = crossfade({
  duration: d => Math.sqrt(d * 200),

  fallback(node, params) {
    const style = getComputedStyle(node)
    const transform = style.transform === "none" ? "" : style.transform

    return {
      duration: 600,
      easing: quintOut,
      css: t => `
        transform: ${transform} scale(${t});
        opacity: ${t}
      `
    }
  }
})

// DRAG AND DROP
let isOver = false
const getDraggedParent = node =>
  node.dataset && node.dataset.index
    ? node.dataset
    : getDraggedParent(node.parentNode)
const start = ev => {
  ev.dataTransfer.setData("source", ev.target.dataset.index)
}
const over = ev => {
  ev.preventDefault()
  let dragged = getDraggedParent(ev.target)
  if (isOver !== dragged.id) isOver = JSON.parse(dragged.id)
}
const leave = ev => {
  let dragged = getDraggedParent(ev.target)
  if (isOver === dragged.id) isOver = false
}
const drop = ev => {
  isOver = false
  ev.preventDefault()
  let dragged = getDraggedParent(ev.target)
  let from = ev.dataTransfer.getData("source")
  let to = dragged.index
  if (to && from) reorder({ from, to })
}

// DISPATCH REORDER
import { createEventDispatcher } from "svelte"
const dispatch = createEventDispatcher()
const reorder = ({ from, to }) => {
  let newList = [...list]
  newList[from] = [newList[to], (newList[to] = newList[from])][0]

  dispatch("sort", newList)
}

// UTILS
const getKey = item => (key ? item[key] : item)

// PROPS
export let list
export let key
</script>

<style>
.over {
  border-color: rgba(48, 12, 200, 0.2);
}
main {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(100px, 250px));
	place-content: center;
	grid-gap: 1rem;
	align-items: center;
	justify-content: center;
	padding: 15vh 15vw;
	height: 100%;
	box-sizing: border-box;
}
</style>

{#if list && list.length}
  <main>
    {#each list as item, index (getKey(item))}
      <div
        data-index={index}
        data-id={JSON.stringify(getKey(item))}
        draggable="true"
        on:dragstart={start}
        on:dragover={over}
        on:dragleave={leave}
        on:drop={drop}
        in:receive={{ key: getKey(item) }}
        out:send={{ key: getKey(item) }}
        animate:flip={{ duration: 300 }}
        class:over={getKey(item) === isOver}>
        <slot {item} {index}>
          <p>{getKey(item)}</p>
        </slot>
      </div>
    {/each}
  </main>
{/if}
