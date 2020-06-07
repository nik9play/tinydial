<script>
import Card from './components/Card.svelte'
import Add from './components/Add.svelte'
import SortableList from './components/SortableList.svelte'

let bookmarks = []

browser.storage.local.get("bookmarks").then(item => {
	bookmarks = item.bookmarks
})

function handleAdd(e) {
	bookmarks = e.detail.newBookmarks
}

function handleRemove(e) {
	bookmarks.splice(e.detail.index, 1)
	bookmarks = bookmarks
	browser.storage.local.set({
		bookmarks: bookmarks
	})
}

const sortList = ev => {
	bookmarks = ev.detail
	browser.storage.local.set({
		bookmarks: bookmarks
	})
}
</script>

<Add on:add={handleAdd}/>

<!-- {#each bookmarks as bookmark, i (bookmark)}
	<Card on:remove={handleRemove} {...bookmark} index={i}/>
{/each} -->

<SortableList list={bookmarks} let:item let:index on:sort={sortList}>
	<Card on:remove={handleRemove} {...item} index={index}/>
</SortableList>

<style>

</style>