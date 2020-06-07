<article on:click={goToPage}>
  <img src="{imgDataUrl}" draggable="false" alt="icon" class:dark={dark}>
  <div class="title">{name}</div>
  <div class="remove" on:click|stopPropagation={remove}>
    <svg viewBox="0 0 24 24" draggable="false">
        <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
    </svg>
  </div>
</article>

<script>
import { urlToDataUrl } from '../img-converter.js'
import { createEventDispatcher } from 'svelte'
const dispatch = createEventDispatcher()

export let name = "Unnamed"
export let url
export let imgDataUrl
export let index
export let dark

function goToPage() {
  location.href = url
}

function remove() {
  dispatch('remove', {
    index: index
  })
}
</script>

<style lang="scss">
article {
  height: 50px;
  position: relative;
  background: rgb(252, 252, 252);
  border-radius: .5rem;
  border: 1px solid rgb(197, 197, 197);
  display:grid;
  grid-template-columns: 50px 1fr;
  place-items: center;
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.07);
  transition:transform 0.05s ease-in-out 0s;
  cursor: default;
  user-select: none;

  .remove {
    position: absolute;
    right: .5rem;
    width: 24px;
    height: 24px;
    opacity: .5;
    display: none;
    cursor: pointer;
  }

  &:hover {
    transform:matrix(1.00,0.00,0.00,1.00,0,-3);

    .remove {
      display: inline;
    }
  }

  &:active {
    background: rgb(241, 241, 241);
  }
}

.title {
  box-sizing: border-box;
  justify-self: baseline;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
}

img {
  max-width: 32px;
  max-height: 32px;
}

.dark {
  background: #fff;
  padding: .2rem;
  border-radius: .3rem;
}

@media (prefers-color-scheme: dark) {
  article {
    background: #1a1a1a;
    border: 1px solid #353535;

    &:active {
      background: #292929;
    }
  }

  svg {
    fill: #dadada;
  }
}
</style>