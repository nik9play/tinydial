<div class="add">
  <div class="btn" on:click={visibleToggle}>
    <svg viewBox="0 0 24 24">
      <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
    </svg>
  </div>
  {#if visible}
    <div class="add_container" class:loading={loading} transition:fly="{{ y: 50, duration: 300 }}">
      <label>URL</label>
      <input bind:value={url} type="url" disabled={loading}>
      <label>Name</label>
      <input bind:value={name} type="text" disabled={loading}>
      <label>
        <input type="checkbox" bind:checked={fetchIcons}>
        Fetch icon automaticly <br><i>Icons are fetched from besticon.megaworld.space</i>
      </label>
      <button on:click={addElement} disabled={loading}>OK</button>
    </div>
  {/if}
</div>

<script>
let url
let name
let loading
let fetchIcons = true
let visible = false

import { createEventDispatcher } from 'svelte'
import { urlToDataUrl, checkDark, getLetterIcon } from '../img-converter.js'
import { fly } from 'svelte/transition'

const dispatch = createEventDispatcher()

function visibleToggle() {
  if (visible) visible = false 
  else visible = true;
}

async function addElement() {
  browser.storage.local.get("bookmarks").then(item => {

    let newArray
    if (Array.isArray(item.bookmarks)) newArray = item.bookmarks
    else newArray = []
    url = new URL(url)
    loading = true
    if (fetchIcons) {
      urlToDataUrl(`https://besticon.megaworld.space/icon?url=${url.hostname}&size=16..32..144`, imgDataUrl => {
        checkDark(imgDataUrl, darkHandle)

        function darkHandle(isDark) {
          newArray.push({
            name: name,
            url: url.href,
            imgDataUrl: imgDataUrl,
            dark: isDark
          })

          browser.storage.local.set({
            bookmarks: newArray
          })

          dispatch('add', {
            newBookmarks: newArray
          })
          loading = false
          name = undefined
          url = undefined
        } 
      })
    } else {
      newArray.push({
        name: name,
        url: url.href,
        imgDataUrl: getLetterIcon(url.hostname.charAt(0).toUpperCase()),
        dark: false
      })

      browser.storage.local.set({
        bookmarks: newArray
      })

      dispatch('add', {
        newBookmarks: newArray
      })
      loading = false
      name = undefined
      url = undefined
    }
  })
}
</script>

<style lang="scss">
.btn {
  width: 24px;
  height: 24px;
  position: fixed;
  top:1rem;
  right: 1rem;
  cursor: pointer;
}

.add {
  position: fixed;
  right: 0;
  top: 0;
}

.add_container {
  border-radius: .3rem;
  border: 1px solid rgb(197, 197, 197);
  padding: 1rem;
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.07);
  display: grid;
  grid-gap: .5rem;
  margin: 3rem 1rem;
}

.loading {
  cursor: wait;
}

input {
  border: 1px solid #ccc;
  border-radius: .2rem;
  padding: .5rem;

  &:focus {
    box-shadow: 0px 0px 0px 3px rgba(166, 215, 255, 0.548);
    border: 1px solid rgb(48, 172, 255);
  }

  &:invalid {
    box-shadow: 0px 0px 0px 3px rgba(255, 166, 170, 0.548);
    border: 1px solid rgb(255, 79, 79);
  }
}
button {
  border: 1px solid #ccc;
  border-radius: 0.2rem;
  background: #f7f7f7;
  padding: .5rem;

  &:active {
    border: 1px solid #ccc;
    background: #e4e4e4;
  }
}

@media (prefers-color-scheme: dark) {
  svg {
    fill: #dadada;
  }

  .add_container {
    border: 1px solid #353535;
    background: #202020;
  }

  input {
    color: #dadada;
    background: transparent;
    border: 1px solid #353535;
    &:focus {
      box-shadow: 0px 0px 0px 3px rgba(166, 215, 255, 0.23);
      border: 1px solid rgba(48, 172, 255, 0.58);
    }
  }

  button {
    background: #353535;
    border: 1px solid #353535;
    color: #dadada;
    &:active {
      background: #525252;
      border: 1px solid #464646;
    }
  }
}
</style>